export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export class OAuthError extends Error {
  code: string;
  redirectUri?: string;

  constructor(code: string, message: string, redirectUri?: string) {
    super(message);
    this.code = code;
    this.redirectUri = redirectUri;
  }
}

// Held strictly in JS/React memory (never written to localStorage/sessionStorage)
let inMemorySessionToken: string | null = null;

export function getSessionToken(): string | null {
  return inMemorySessionToken;
}

export function setSessionToken(token: string | null): void {
  inMemorySessionToken = token;
}

export function getAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Requested-With': 'CodePath',
    ...extra,
  };
  if (inMemorySessionToken) {
    headers.Authorization = `Bearer ${inMemorySessionToken}`;
  }
  return headers;
}

function isAllowedOAuthOrigin(origin: string): boolean {
  if (!origin) return false;
  if (origin === window.location.origin) return true;
  try {
    const parsed = new URL(origin);
    return (
      parsed.hostname.endsWith('.run.app') ||
      parsed.hostname.endsWith('.vercel.app') ||
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

export async function fetchCurrentSession(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: AuthUser | null };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function logoutSession(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
    });
  } finally {
    inMemorySessionToken = null;
  }
}

export async function openGoogleOAuthPopup(): Promise<AuthUser> {
  const urlRes = await fetch('/api/auth/url', {
    method: 'GET',
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const urlData = (await urlRes.json()) as {
    url?: string;
    redirectUri?: string;
    error?: string;
    message?: string;
  };

  if (!urlRes.ok || !urlData.url) {
    throw new OAuthError(
      urlData.error ?? 'OAUTH_UNAVAILABLE',
      urlData.message ?? 'Google OAuth is not configured on the server.',
      urlData.redirectUri
    );
  }

  const width = 520;
  const height = 660;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

  const popup = window.open(
    urlData.url,
    'codepath_google_oauth',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  if (!popup) {
    throw new OAuthError('auth/popup-blocked', 'Popup was blocked by the browser.');
  }

  return new Promise<AuthUser>((resolve, reject) => {
    let settled = false;
    let closeGraceTimer: number | null = null;

    const cleanup = () => {
      window.removeEventListener('message', onMessage);
      window.clearInterval(pollTimer);
      if (closeGraceTimer !== null) {
        window.clearTimeout(closeGraceTimer);
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (!isAllowedOAuthOrigin(event.origin)) return;
      const data = event.data as {
        type?: string;
        token?: string;
        user?: AuthUser;
        error?: string;
      } | null;

      if (!data || typeof data !== 'object') return;

      if (data.type === 'GOOGLE_OAUTH_SUCCESS' && data.token && data.user) {
        if (settled) return;
        settled = true;
        cleanup();
        inMemorySessionToken = data.token;
        resolve(data.user);
      } else if (data.type === 'GOOGLE_OAUTH_ERROR') {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new OAuthError('auth/oauth-failed', data.error ?? 'Google sign-in failed.'));
      }
    };

    window.addEventListener('message', onMessage);

    const pollTimer = window.setInterval(() => {
      if (popup.closed && !settled && closeGraceTimer === null) {
        closeGraceTimer = window.setTimeout(() => {
          if (settled) return;
          settled = true;
          cleanup();
          reject(
            new OAuthError(
              'auth/popup-closed-by-user',
              'Sign-in window was closed before completing authentication.'
            )
          );
        }, 700);
      }
    }, 350);
  });
}
