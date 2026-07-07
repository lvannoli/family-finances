// Local-first encrypted file sync: merge + bundle + share/import orchestration.
import { encryptJSON, decryptJSON } from './crypto.js';

const PASS_KEY = 'ff_pass';
const getPass = () => localStorage.getItem(PASS_KEY) || '';
const setPass = (p) => localStorage.setItem(PASS_KEY, p);

// Pure: union by id, newest updatedAt wins (missing = oldest; tie keeps local). Tombstones participate.
export function mergeData(local, incoming) {
  const mergeArr = (a = [], b = []) => {
    const map = new Map();
    for (const x of a) map.set(x.id, x);
    for (const y of b) {
      const cur = map.get(y.id);
      if (!cur || (y.updatedAt || '') > (cur.updatedAt || '')) map.set(y.id, y);
    }
    return [...map.values()];
  };
  return { a: mergeArr(local && local.a, incoming && incoming.a), t: mergeArr(local && local.t, incoming && incoming.t) };
}

export function buildEnvelope(data, exportedAt) {
  return { version: 1, exportedAt, data: { a: (data && data.a) || [], t: (data && data.t) || [] } };
}

async function bundleText() {
  const pass = getPass();
  if (!pass) { window.alert('Set a passphrase in Settings → Sync first.'); return null; }
  const env = buildEnvelope(window.DB.load(), new Date().toISOString());
  return JSON.stringify(await encryptJSON(env, pass));
}
function fileName() { return `family-finances-${new Date().toISOString().slice(0,10)}.json`; }
function downloadText(text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = fileName(); a.click();
  URL.revokeObjectURL(url); window.toast('Sync file downloaded ✓');
}
async function shareBundle() {
  const text = await bundleText(); if (!text) return;
  const file = new File([text], fileName(), { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Family Finances data' }); } catch (e) { /* user cancelled */ }
  } else { downloadText(text); }
}
async function copyBundle() {
  const text = await bundleText(); if (!text) return;
  try { await navigator.clipboard.writeText(text); window.toast('Sync bundle copied — paste it to the other person ✓'); }
  catch { window.prompt('Copy this sync bundle:', text); }
}
async function downloadBundle() { const text = await bundleText(); if (text) downloadText(text); }

let _pending = null;
function showBar(msg) { const b = document.getElementById('pass-bar'); if (!b) return; b.style.display = ''; const e = document.getElementById('pass-bar-err'); if (e) e.textContent = msg || ''; const i = document.getElementById('pass-bar-input'); if (i) { i.value = ''; i.focus?.(); } }
function hideBar() { const b = document.getElementById('pass-bar'); if (b) b.style.display = 'none'; }
function barErr(m) { const e = document.getElementById('pass-bar-err'); if (e) e.textContent = m || ''; }

function beginImport(text) {
  let env;
  try { env = JSON.parse(text); if (!env || !env.ct || !env.salt || !env.iv) throw 0; }
  catch { window.alert('Not a valid sync file.'); return; }
  _pending = env; showBar();
}
async function submitImportPassphrase() {
  const inp = document.getElementById('pass-bar-input');
  const pass = inp ? inp.value : '';
  if (!pass || !_pending) { barErr('Enter your passphrase.'); return; }
  const btn = document.getElementById('pass-bar-btn'); if (btn) { btn.disabled = true; btn.textContent = 'Decrypting…'; }
  barErr('');
  try {
    const payload = await decryptJSON(_pending, pass);      // {version, exportedAt, data}
    setPass(pass);
    window.App.snapshot();
    window.DB._d = mergeData(window.DB.load(), payload.data);
    window.DB.save();
    _pending = null; hideBar();
    window.toast('Imported', 6000, { label: 'Undo', fn: () => window.App.undoLast() });
    window.App.go(window.S.view || 'home');
  } catch (e) {
    if (e && e.message === 'WRONG_PASSPHRASE') barErr('Incorrect passphrase — try again. Your own data is untouched.');
    else barErr('Could not read that file — your own data is untouched.');
  } finally { if (btn) { btn.disabled = false; btn.textContent = 'Decrypt & Import'; } }
}

if (typeof window !== 'undefined') {
  window.FileSync = { mergeData, buildEnvelope, shareBundle, copyBundle, downloadBundle, beginImport, submitImportPassphrase, hasPass: () => !!getPass(), setPass };
}
