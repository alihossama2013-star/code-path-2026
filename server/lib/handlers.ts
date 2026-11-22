import {
  buildClearSessionCookieHeader,
  buildGoogleAuthUrl,
  buildSessionCookieHeader,
  createSessionToken,
  exchangeCodeForGoogleUser,
  extractSessionUser,
  getGoogleRedirectUri,
  renderOAuthCallbackHtml,
  verifyOAuthState,
} from './auth.js';
import {
  ApiRequest,
  ApiResponse,
  getFirstHeader,
  getQueryParam,
  readJsonBody,
  sendHtml,
  sendJson,
} from './http.js';
import {
  deleteRemoteAccountSnapshot,
  readRemoteAccountSnapshot,
  sanitizeAccountSnapshot,
  writeRemoteAccountSnapshot,
} from './progressStore.js';
import { generateTtsAudio } from './tts.js';

function isSafeStateChangingRequest(req: ApiRequest): boolean {
  const authHeader = getFirstHeader(req.headers.authorization);
  if (authHeader.startsWith('Bearer ')) {
    return true;
  }
  const requestedWith = getFirstHeader(req.headers['x-requested-with']);
  if (requestedWith === 'CodePath') {
    return true;
  }
  const origin = getFirstHeader(req.headers.origin);
  const host =
    getFirstHeader(req.headers['x-forwarded-host']).split(',')[0]?.trim() ||
    getFirstHeader(req.headers.host).split(',')[0]?.trim();
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      return originHost === host;
    } catch {
      return false;
    }
  }
  return false;
}

export async function handleTts(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(req, 64 * 1024);
  } catch {
    sendJson(res, 413, { error: 'PAYLOAD_TOO_LARGE' });
    return;
  }

  const rawText = typeof body.text === 'string' ? body.text : '';
  const lang = body.lang === 'en' ? 'en' : 'ar';

  const result = await generateTtsAudio(rawText, lang);
  if (!result.ok) {
    sendJson(res, result.status, { error: result.error, message: result.message });
    return;
  }

  sendJson(res, 200, {
    audioBase64: result.audioBase64,
    mimeType: result.mimeType,
  });
}

export async function handleAuthUrl(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const built = buildGoogleAuthUrl(req);
  const redirectUri = getGoogleRedirectUri(req);
  if (!built) {
    sendJson(res, 503, {
      error: 'OAUTH_NOT_CONFIGURED',
      message: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured on the server.',
      redirectUri,
    });
    return;
  }

  sendJson(res, 200, built);
}

export async function handleAuthCallback(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const errorParam = getQueryParam(req, 'error');
  if (errorParam) {
    sendHtml(res, 200, renderOAuthCallbackHtml({ ok: false, error: errorParam }));
    return;
  }

  const code = getQueryParam(req, 'code');
  const state = getQueryParam(req, 'state');
  if (!code || !state || !verifyOAuthState(state)) {
    sendHtml(
      res,
      400,
      renderOAuthCallbackHtml({ ok: false, error: 'Invalid or expired OAuth state.' })
    );
    return;
  }

  try {
    const redirectUri = getGoogleRedirectUri(req);
    const user = await exchangeCodeForGoogleUser(code, redirectUri);
    const token = createSessionToken(user);
    res.setHeader('Set-Cookie', buildSessionCookieHeader(token));
    sendHtml(res, 200, renderOAuthCallbackHtml({ ok: true, token, user }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Google authentication failed.';
    console.error('[/api/auth/callback] Error:', msg);
    sendHtml(res, 500, renderOAuthCallbackHtml({ ok: false, error: 'Authentication failed.' }));
  }
}

export async function handleAuthMe(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }

  const user = extractSessionUser(req);
  if (!user) {
    sendJson(res, 200, { user: null });
    return;
  }

  sendJson(res, 200, { user });
}

export async function handleAuthLogout(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  if (!isSafeStateChangingRequest(req)) {
    sendJson(res, 403, { error: 'FORBIDDEN' });
    return;
  }

  res.setHeader('Set-Cookie', buildClearSessionCookieHeader());
  sendJson(res, 200, { ok: true });
}

export async function handleProgress(req: ApiRequest, res: ApiResponse): Promise<void> {
  const user = extractSessionUser(req);
  if (!user) {
    sendJson(res, 401, { error: 'UNAUTHORIZED' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const { enabled, snapshot } = await readRemoteAccountSnapshot(user.uid);
      sendJson(res, 200, { remoteEnabled: enabled, snapshot });
    } catch (err) {
      console.error('[/api/progress GET] Error:', err);
      sendJson(res, 500, { error: 'PROGRESS_READ_FAILED' });
    }
    return;
  }

  if (!isSafeStateChangingRequest(req)) {
    sendJson(res, 403, { error: 'FORBIDDEN' });
    return;
  }

  if (req.method === 'PUT') {
    let body: Record<string, unknown>;
    try {
      body = await readJsonBody(req, 128 * 1024);
    } catch {
      sendJson(res, 413, { error: 'PAYLOAD_TOO_LARGE' });
      return;
    }

    try {
      const sanitized = sanitizeAccountSnapshot(user.uid, body);
      const { enabled } = await writeRemoteAccountSnapshot(user.uid, sanitized);
      sendJson(res, 200, { ok: true, remoteEnabled: enabled, snapshot: sanitized });
    } catch (err) {
      console.error('[/api/progress PUT] Error:', err);
      sendJson(res, 500, { error: 'PROGRESS_WRITE_FAILED' });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const { enabled } = await deleteRemoteAccountSnapshot(user.uid);
      sendJson(res, 200, { ok: true, remoteEnabled: enabled });
    } catch (err) {
      console.error('[/api/progress DELETE] Error:', err);
      sendJson(res, 500, { error: 'PROGRESS_DELETE_FAILED' });
    }
    return;
  }

  sendJson(res, 405, { error: 'METHOD_NOT_ALLOWED' });
}
