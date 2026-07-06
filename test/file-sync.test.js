import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeData, buildEnvelope } from '../js/file-sync.js';
import { encryptJSON, decryptJSON } from '../js/crypto.js';

test('mergeData: incoming newer wins, local newer stays', () => {
  const local = { a: [{ id: 'a1', name: 'Old', updatedAt: '2026-01-01' }, { id: 'a2', name: 'KeepLocal', updatedAt: '2026-03-01' }], t: [] };
  const incoming = { a: [{ id: 'a1', name: 'New', updatedAt: '2026-02-01' }, { id: 'a2', name: 'Older', updatedAt: '2026-01-01' }], t: [] };
  const m = mergeData(local, incoming);
  const byId = Object.fromEntries(m.a.map(x => [x.id, x.name]));
  assert.equal(byId.a1, 'New');       // incoming newer
  assert.equal(byId.a2, 'KeepLocal'); // local newer
});
test('mergeData: soft-delete with newer stamp beats older edit; disjoint unioned', () => {
  const local = { a: [{ id: 'a1', name: 'Edited', updatedAt: '2026-01-02' }, { id: 'a3', name: 'OnlyLocal', updatedAt: '2026-01-01' }], t: [] };
  const incoming = { a: [{ id: 'a1', deleted: true, updatedAt: '2026-02-01' }, { id: 'a4', name: 'OnlyIncoming', updatedAt: '2026-01-01' }], t: [] };
  const m = mergeData(local, incoming);
  const a1 = m.a.find(x => x.id === 'a1');
  assert.equal(a1.deleted, true);
  assert.ok(m.a.find(x => x.id === 'a3'));
  assert.ok(m.a.find(x => x.id === 'a4'));
});
test('mergeData: equal timestamp keeps local; missing updatedAt = oldest', () => {
  const local = { a: [{ id: 'a1', name: 'Local', updatedAt: '2026-01-01' }, { id: 'a2', name: 'HasStamp', updatedAt: '2026-01-01' }], t: [] };
  const incoming = { a: [{ id: 'a1', name: 'Incoming', updatedAt: '2026-01-01' }, { id: 'a2', name: 'NoStamp' }], t: [] };
  const m = mergeData(local, incoming);
  const byId = Object.fromEntries(m.a.map(x => [x.id, x.name]));
  assert.equal(byId.a1, 'Local');     // tie → local
  assert.equal(byId.a2, 'HasStamp');  // incoming missing updatedAt loses
});
test('mergeData: transactions merge by id too', () => {
  const local = { a: [], t: [{ id: 't1', amt: 5, updatedAt: '2026-01-01' }] };
  const incoming = { a: [], t: [{ id: 't1', amt: 9, updatedAt: '2026-02-01' }, { id: 't2', amt: 3, updatedAt: '2026-01-01' }] };
  const m = mergeData(local, incoming);
  assert.equal(m.t.find(x => x.id === 't1').amt, 9);
  assert.ok(m.t.find(x => x.id === 't2'));
});
test('bundle round-trips through encrypt/serialize/decrypt', async () => {
  const data = { a: [{ id: 'a1', name: 'X', updatedAt: '2026-01-01' }], t: [] };
  const env = buildEnvelope(data, '2026-07-06T00:00:00.000Z');
  const text = JSON.stringify(await encryptJSON(env, 'pass'));
  const back = await decryptJSON(JSON.parse(text), 'pass');
  assert.deepEqual(back, env);
});
