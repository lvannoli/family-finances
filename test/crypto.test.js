import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encryptJSON, decryptJSON } from '../js/crypto.js';

test('round-trips an object through encrypt/decrypt', async () => {
  const data = { a: [{ id: 'a1', name: 'Savings' }], t: [{ amt: 12.5 }] };
  const env = await encryptJSON(data, 'correct horse');
  assert.equal(env.v, 1);
  assert.ok(env.salt && env.iv && env.ct);
  const out = await decryptJSON(env, 'correct horse');
  assert.deepEqual(out, data);
});

test('wrong passphrase throws WRONG_PASSPHRASE', async () => {
  const env = await encryptJSON({ x: 1 }, 'right');
  await assert.rejects(() => decryptJSON(env, 'wrong'), /WRONG_PASSPHRASE/);
});

test('two encryptions of same data differ (random salt+iv)', async () => {
  const a = await encryptJSON({ x: 1 }, 'p');
  const b = await encryptJSON({ x: 1 }, 'p');
  assert.notEqual(a.ct, b.ct);
  assert.notEqual(a.iv, b.iv);
});
