// Encode/decode a device-onboarding invite in a URL #fragment.
// Carries ONLY the GitHub connection {owner, repo, token} — never the passphrase.

const MAX_PAYLOAD = 4096;

function b64urlEncode(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s) {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return decodeURIComponent(escape(atob(b64)));
}

export function buildInviteUrl({ owner, repo, token }, baseUrl) {
  const payload = b64urlEncode(JSON.stringify({ owner, repo, token }));
  return `${baseUrl}#invite=${payload}`;
}

export function parseInvite(hashOrUrl) {
  if (!hashOrUrl || typeof hashOrUrl !== 'string') return null;
  const frag = hashOrUrl.includes('#') ? hashOrUrl.slice(hashOrUrl.indexOf('#') + 1) : hashOrUrl;
  const m = frag.match(/(?:^|&)invite=([^&]+)/);
  if (!m) return null;
  const encoded = m[1];
  if (encoded.length > MAX_PAYLOAD) return null;
  let obj;
  try { obj = JSON.parse(b64urlDecode(encoded)); }
  catch { return null; }
  if (!obj || typeof obj !== 'object') return null;
  const { owner, repo, token } = obj;
  const ok = [owner, repo, token].every(v => typeof v === 'string' && v.length > 0);
  return ok ? { owner, repo, token } : null;
}
