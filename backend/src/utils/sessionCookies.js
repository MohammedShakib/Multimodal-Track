export const SESSION_COOKIE_NAME = 'mt_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export function readCookie(req, name) {
  const header = req.headers.cookie;

  if (!header) return '';

  const cookies = header.split(';').map((part) => part.trim());
  const match = cookies.find((part) => part.startsWith(`${name}=`));

  if (!match) return '';

  return decodeURIComponent(match.slice(name.length + 1));
}

function isSecureRequest(req) {
  return (
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    req.headers.origin?.startsWith('https://')
  );
}

export function buildSessionCookie(req, token) {
  const secure = isSecureRequest(req);
  const sameSite = secure ? 'None' : 'Lax';
  const secureFlag = secure ? '; Secure' : '';

  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_SECONDS}; SameSite=${sameSite}${secureFlag}`;
}

export function buildExpiredSessionCookie(req) {
  const secure = isSecureRequest(req);
  const sameSite = secure ? 'None' : 'Lax';
  const secureFlag = secure ? '; Secure' : '';

  return `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=${sameSite}${secureFlag}`;
}
