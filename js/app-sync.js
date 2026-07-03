import { encryptJSON, decryptJSON } from './crypto.js';
import { GitHubClient } from './github.js';
import { SyncEngine } from './sync.js';
import { buildInviteUrl, parseInvite } from './invite.js';

const CFG_KEY = 'ff_sync_cfg';   // { owner, repo, token }
const PASS_KEY = 'ff_pass';      // passphrase (per-device)
const DEV_KEY = 'ff_device';

function loadCfg() { try { return JSON.parse(localStorage.getItem(CFG_KEY)) || {}; } catch { return {}; } }
function saveCfg(c) { localStorage.setItem(CFG_KEY, JSON.stringify(c)); }
function getPass() { return localStorage.getItem(PASS_KEY) || ''; }
function savePass(p) { localStorage.setItem(PASS_KEY, p); }
function getDeviceId() {
  let id = localStorage.getItem(DEV_KEY);
  if (!id) { id = 'd-' + crypto.randomUUID(); localStorage.setItem(DEV_KEY, id); }
  return id;
}

let engine = null;
let status = 'local';      // local | syncing | synced | offline | error | conflict
let applyingRemote = false;
let pushTimer = null;

function statusLabel() {
  return {
    local: 'Local only — set up sync below',
    syncing: 'Syncing…',
    synced: 'Synced ✓',
    offline: 'Offline — will sync when back online',
    error: 'Sync error — check your token/passphrase',
    conflict: 'Resolving conflict…',
  }[status] || status;
}

function setStatus(s) {
  status = s;
  const el = document.getElementById('sync-status');
  if (el) el.textContent = statusLabel();
}

function buildEngine() {
  const cfg = loadCfg();
  const pass = getPass();
  if (!cfg.owner || !cfg.token || !pass) { engine = null; return null; }
  const client = new GitHubClient({ owner: cfg.owner, repo: cfg.repo || 'family-finances-data', token: cfg.token });
  engine = new SyncEngine({ client, passphrase: pass, crypto: { encryptJSON, decryptJSON }, deviceId: getDeviceId() });
  return engine;
}

function applyRemote(envelope) {
  applyingRemote = true;
  window.DB._d = envelope.data;
  window.DB.save();                 // persist to localStorage cache
  applyingRemote = false;
  window.App.go(window.S.view || 'home');
}

function handleError(e) {
  if (e && e.message === 'WRONG_PASSPHRASE') {
    setStatus('error');
    window.alert('Wrong passphrase — could not decrypt your synced data. Fix it in Settings → Sync.');
    return;
  }
  if (e && /^GITHUB_/.test(e.message || '')) {
    setStatus('error');
    console.warn('Sync error:', e.message);
    return;
  }
  setStatus('offline');            // network/other → treat as offline, retry later
  console.warn('Sync offline:', e);
}

async function startup() {
  if (!buildEngine()) { setStatus('local'); return; }
  setStatus('syncing');
  try {
    const remote = await engine.pull();
    if (remote && remote.data) applyRemote(remote);
    setStatus('synced');
  } catch (e) {
    handleError(e);
  }
}

async function doPush() {
  if (!engine) return;
  setStatus('syncing');
  try {
    await engine.push(window.DB.load(), new Date().toISOString());
    setStatus('synced');
  } catch (e) {
    if (e && e.message === 'CONFLICT') return handleConflict();
    handleError(e);
  }
}

async function handleConflict() {
  setStatus('conflict');
  let remote;
  try { remote = await engine.pull(); }   // refreshes engine.sha
  catch (e) { return handleError(e); }
  const useRemote = window.confirm(
    'This data was changed on another device.\n\n' +
    'OK  = load the other device’s version (discard changes made here since last sync)\n' +
    'Cancel = keep THIS device’s version (overwrite the other device)'
  );
  if (useRemote) {
    if (remote && remote.data) applyRemote(remote);
    setStatus('synced');
  } else {
    try { await engine.push(window.DB.load(), new Date().toISOString()); setStatus('synced'); }
    catch (e) { handleError(e); }
  }
}

function onLocalChange() {
  if (applyingRemote || !engine) return;
  setStatus('syncing');
  clearTimeout(pushTimer);
  pushTimer = setTimeout(doPush, 1200);   // debounce bursts of changes
}

function saveSettings() {
  const owner = document.getElementById('sy-owner').value.trim();
  const repo = document.getElementById('sy-repo').value.trim() || 'family-finances-data';
  const tokenInput = document.getElementById('sy-token').value.trim();
  const passInput = document.getElementById('sy-pass').value;
  const existing = loadCfg();
  const token = tokenInput || existing.token;      // blank = keep saved
  const pass = passInput || getPass();             // blank = keep saved
  if (!owner || !token || !pass) {
    window.alert('Enter your GitHub username, an access token, and a passphrase.');
    return;
  }
  saveCfg({ owner, repo, token });
  savePass(pass);
  buildEngine();
  window.toast('Sync configured ✓');
  startup();
}

function createInviteLink() {
  const cfg = loadCfg();
  if (!cfg.owner || !cfg.token) {
    window.alert('Set up sync on this device first (username + token), then create an invite link.');
    return;
  }
  const base = location.origin + location.pathname;
  const url = buildInviteUrl({ owner: cfg.owner, repo: cfg.repo || 'family-finances-data', token: cfg.token }, base);
  const note = 'Invite link copied.\n\nTreat it like a password — it connects a device to your finances. The passphrase is NOT in the link and is still required on the new device.';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => window.alert(note), () => window.prompt('Copy this invite link (treat like a password):', url));
  } else {
    window.prompt('Copy this invite link (treat like a password):', url);
  }
}

// Wrap DB.save so every local change schedules a push.
const _save = window.DB.save.bind(window.DB);
window.DB.save = function () { _save(); onLocalChange(); };

// Retry when connectivity returns.
window.addEventListener('online', () => { if (engine) doPush(); });

window.Sync = {
  saveSettings,
  syncNow: startup,
  onLocalChange,
  statusLabel,
  status: () => status,
  cfg: loadCfg,
  hasPass: () => !!getPass(),
  createInviteLink,
};

startup();
