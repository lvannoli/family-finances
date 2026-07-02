import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SyncEngine } from '../js/sync.js';

// Fake crypto: identity envelope so we can assert on structure without real AES.
const fakeCrypto = {
  encryptJSON: async (obj) => ({ fake: obj }),
  decryptJSON: async (env) => env.fake,
};

// Fake client backed by an in-memory store with sha versioning.
function makeClient(initial = null) {
  let store = initial; // { obj, sha } | null
  let counter = 1;
  return {
    _store: () => store,
    async getFile() { return store ? { json: store.obj, sha: store.sha } : null; },
    async putFile(obj, sha) {
      if (store && sha !== store.sha) throw new Error('CONFLICT');
      if (!store && sha) throw new Error('CONFLICT');
      store = { obj, sha: 'sha' + (++counter) };
      return { sha: store.sha };
    },
  };
}

test('pull returns null when remote is empty', async () => {
  const eng = new SyncEngine({ client: makeClient(null), passphrase: 'p', crypto: fakeCrypto, deviceId: 'devA' });
  assert.equal(await eng.pull(), null);
  assert.equal(eng.sha, null);
});

test('pull decrypts envelope and tracks sha', async () => {
  const envelope = { version: 1, updatedAt: '2026-07-02T00:00:00Z', deviceId: 'devB', data: { a: [1], t: [] } };
  const client = makeClient({ obj: { fake: envelope }, sha: 'sha1' });
  const eng = new SyncEngine({ client, passphrase: 'p', crypto: fakeCrypto, deviceId: 'devA' });
  const out = await eng.pull();
  assert.deepEqual(out, envelope);
  assert.equal(eng.sha, 'sha1');
});

test('push wraps data, encrypts, writes, and updates sha', async () => {
  const client = makeClient(null);
  const eng = new SyncEngine({ client, passphrase: 'p', crypto: fakeCrypto, deviceId: 'devA' });
  const env = await eng.push({ a: [], t: [] }, '2026-07-02T10:00:00Z');
  assert.equal(env.version, 1);
  assert.equal(env.deviceId, 'devA');
  assert.equal(env.updatedAt, '2026-07-02T10:00:00Z');
  assert.deepEqual(env.data, { a: [], t: [] });
  assert.ok(eng.sha); // sha now set from write
  // stored object is the encrypted (fake) envelope
  assert.deepEqual(client._store().obj, { fake: env });
});

test('push with a stale sha throws CONFLICT', async () => {
  const envelope = { version: 1, updatedAt: 'x', deviceId: 'devB', data: { a: [], t: [] } };
  const client = makeClient({ obj: { fake: envelope }, sha: 'sha1' });
  const eng = new SyncEngine({ client, passphrase: 'p', crypto: fakeCrypto, deviceId: 'devA' });
  // engine has never pulled, so its sha is null -> stale vs existing 'sha1'
  await assert.rejects(() => eng.push({ a: [], t: [] }, 'now'), /CONFLICT/);
});

test('after a conflicting write, pull refreshes sha so next push succeeds (keep-mine)', async () => {
  const envelope = { version: 1, updatedAt: 'x', deviceId: 'devB', data: { a: [], t: [] } };
  const client = makeClient({ obj: { fake: envelope }, sha: 'sha1' });
  const eng = new SyncEngine({ client, passphrase: 'p', crypto: fakeCrypto, deviceId: 'devA' });
  await assert.rejects(() => eng.push({ a: [1], t: [] }, 'now'), /CONFLICT/);
  await eng.pull();                       // refreshes sha to 'sha1'
  const env = await eng.push({ a: [1], t: [] }, 'now2');  // now succeeds
  assert.deepEqual(env.data, { a: [1], t: [] });
});
