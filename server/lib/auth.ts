import crypto from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import { getFirstHeader, parseCookies } from './http.js';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface SessionClaims {
  user: AuthUser;
  exp: number;
}

interface StateClaims {
  nonce: string;
  exp: number;
}

export const SESSION_COOKIE_NAME = 'codepath_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const VALID_UID_REGEX = /^[a-zA-Z0-9_-]+$/;
const SAFE_HOST_REGEX = /^[a-zA-Z0-9.-]+(:\d{1,5})?$/;

let ephemeralSecret: string | null = null;

function getSessionSecret(): string {
  const configured = process.env.SESSION_SECRET?.trim();
  if (configured && configured.length >= 16) {
    return configured;
  }
  if (!ephemeralSecret) {
    ephemeralSecret = crypto.randomBytes(32).toString('hex');
  }
  return ephemeralSecret;
}

function signBase64Url(payloadObj: unknown): string {
  const encoded = Buffer.from(JSON.stringify(payloadObj), 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', getSessionSecret()).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyBase64Url<T>(token: string): T | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  if (!encoded || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(encoded)
    .digest('base64url');

  const sigBuf = Buffer.from(sig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

export function sanitizeUid(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  return cleaned && VALID_UID_REGEX.test(cleaned) ? cleaned : 'user';
}

export function getAppBaseUrl(req?: IncomingMessage): string {
  const envAppUrl = process.env.APP_URL?.trim();
  if (envAppUrl && envAppUrl !== 'MY_APP_URL') {
    return envAppUrl.replace(/\/+$/, '');
  }

  if (req) {
    const forwardedHost = getFirstHeader(req.headers['x-forwarded-host']).split(',')[0]?.trim();
    const host = forwardedHost || getFirstHeader(req.headers.host).split(',')[0]?.trim();
    if (host && SAFE_HOST_REGEX.test(host)) {
      const forwardedProto = getFirstHeader(req.headers['x-forwarded-proto']).split(',')[0]?.trim();
      const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
      const proto = forwardedProto === 'http' || isLocal ? 'http' : 'https';
      return `${proto}://${host}`;
    }
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) {
    return `https://${vercelProd.replace(/\/+$/, '')}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/+$/, '')}`;
  }

  const port = Number(process.env.PORT) || 3000;
  return `http://localhost:${port}`;
}

export function getGoogleRedirectUri(req?: IncomingMessage): string {
  return `${getAppBaseUrl(req)}/api/auth/callback`;
}

export function getGoogleOAuthCredentials(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return null;
  }
  return { clientId, clientSecret };
}

export function createOAuthState(): string {
  const claims: StateClaims = {
    nonce: crypto.randomBytes(16).toString('hex'),
    exp: Date.now() + OAUTH_STATE_TTL_MS,
  };
  return signBase64Url(claims);
}

export function verifyOAuthState(state: string): boolean {
  const claims = verifyBase64Url<StateClaims>(state);
  if (!claims || typeof claims.nonce !== 'string' || typeof claims.exp !== 'number') {
    return false;
  }
  return Date.now() <= claims.exp;
}

export function buildGoogleAuthUrl(req?: IncomingMessage): { url: string; redirectUri: string } | null {
  const creds = getGoogleOAuthCredentials();
  const redirectUri = getGoogleRedirectUri(req);
  if (!creds) return null;

  const params = new URLSearchParams({
    client_id: creds.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    access_type: 'online',
    state: createOAuthState(),
  });

  return {
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    redirectUri,
  };
}

export async function exchangeCodeForGoogleUser(
  code: string,
  redirectUri: string
): Promise<AuthUser> {
  const creds = getGoogleOAuthCredentials();
  if (!creds) {
    throw new Error('GOOGLE_OAUTH_NOT_CONFIGURED');
  }

  const tokenParams = new URLSearchParams({
    code,
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString(),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`GOOGLE_TOKEN_EXCHANGE_FAILED: ${errText.slice(0, 200)}`);
  }

  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenJson.access_token;
  if (!accessToken) {
    throw new Error('GOOGLE_ACCESS_TOKEN_MISSING');
  }

  const userInfoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userInfoRes.ok) {
    throw new Error('GOOGLE_USERINFO_FAILED');
  }

  const profile = (await userInfoRes.json()) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  };

  if (!profile.sub || !profile.email || profile.email_verified !== true) {
    throw new Error('GOOGLE_EMAIL_NOT_VERIFIED');
  }

  return {
    uid: sanitizeUid(`g_${profile.sub}`),
    email: profile.email,
    displayName: typeof profile.name === 'string' ? profile.name.slice(0, 120) : null,
    photoURL: typeof profile.picture === 'string' && profile.picture.startsWith('https://')
      ? profile.picture.slice(0, 512)
      : null,
  };
}

export function createSessionToken(user: AuthUser): string {
  const claims: SessionClaims = {
    user,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  return signBase64Url(claims);
}

export function verifySessionToken(token: string): AuthUser | null {
  const claims = verifyBase64Url<SessionClaims>(token);
  if (!claims || !claims.user || typeof claims.exp !== 'number') return null;
  if (Date.now() > claims.exp) return null;
  const { uid, email, displayName, photoURL } = claims.user;
  if (typeof uid !== 'string' || !VALID_UID_REGEX.test(uid) || typeof email !== 'string') {
    return null;
  }
  return {
    uid,
    email,
    displayName: typeof displayName === 'string' ? displayName : null,
    photoURL: typeof photoURL === 'string' ? photoURL : null,
  };
}

export function extractSessionUser(req: IncomingMessage): AuthUser | null {
  const authHeader = getFirstHeader(req.headers.authorization);
  if (authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    const user = verifySessionToken(bearer);
    if (user) return user;
  }

  const cookies = parseCookies(req);
  const cookieToken = cookies[SESSION_COOKIE_NAME];
  if (cookieToken) {
    return verifySessionToken(cookieToken);
  }
  return null;
}

export function buildSessionCookieHeader(token: string): string {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function buildClearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=0`;
}

export function renderOAuthCallbackHtml(payload: {
  ok: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}): string {
  const messageObj = payload.ok
    ? { type: 'GOOGLE_OAUTH_SUCCESS', token: payload.token, user: payload.user }
    : { type: 'GOOGLE_OAUTH_ERROR', error: payload.error ?? 'Authentication failed.' };

  const serialized = JSON.stringify(messageObj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodePath — Google Sign-In</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        color: #111111;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 24px;
        text-align: center;
      }
      .box {
        max-width: 360px;
        border: 1px solid #e7e7e7;
        border-radius: 6px;
        padding: 24px;
      }
      h1 { font-size: 16px; margin: 0 0 8px; }
      p { font-size: 13px; color: #777777; margin: 0; }
    </style>
  </head>
  <body>
    <div class="box">
      <h1>${payload.ok ? 'Sign-in complete' : 'Sign-in could not be completed'}</h1>
      <p>${payload.ok ? 'Returning to CodePath...' : 'You may close this window and try again.'}</p>
    </div>
    <script>
      (function () {
        var msg = ${serialized};
        try {
          if (window.opener) {
            window.opener.postMessage(msg, window.location.origin);
          }
        } catch (e) {}
        setTimeout(function () {
          if (window.opener) {
            window.close();
          } else {
            window.location.href = '/';
          }
        }, 120);
      })();
    </script>
  </body>
</html>`;
}
