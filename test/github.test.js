import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { GitHubClient } from '../js/github.js';

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

function b64(str) { return Buffer.from(str, 'utf-8').toString('base64'); }

test('getFile returns null on 404', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 404, json: async () => ({}) });
  const c = new GitHubClient({ owner: 'o', repo: 'r', token: 't' });
  assert.equal(await c.getFile(), null);
});

test('getFile decodes base64 content and returns sha', async () => {
  const payload = { v: 1, ct: 'abc' };
  globalThis.fetch = async (url, opts) => {
    assert.match(url, /repos\/o\/r\/contents\/data\.json\.enc/);
    assert.equal(opts.headers.Authorization, 'Bearer t');
    return { ok: true, status: 200, json: async () => ({ content: b64(JSON.stringify(payload)) + '\n', sha: 'SHA1' }) };
  };
  const c = new GitHubClient({ owner: 'o', repo: 'r', token: 't' });
  const res = await c.getFile();
  assert.deepEqual(res.json, payload);
  assert.equal(res.sha, 'SHA1');
});

test('putFile without sha creates (no sha in body) and returns new sha', async () => {
  let sentBody;
  globalThis.fetch = async (url, opts) => {
    sentBody = JSON.parse(opts.body);
    assert.equal(opts.method, 'PUT');
    return { ok: true, status: 201, json: async () => ({ content: { sha: 'NEW' } }) };
  };
  const c = new GitHubClient({ owner: 'o', repo: 'r', token: 't' });
  const res = await c.putFile({ v: 1 });
  assert.equal(res.sha, 'NEW');
  assert.equal(sentBody.sha, undefined);
  assert.ok(sentBody.content); // base64 string
});

test('putFile with sha includes it in body', async () => {
  let sentBody;
  globalThis.fetch = async (url, opts) => { sentBody = JSON.parse(opts.body); return { ok: true, status: 200, json: async () => ({ content: { sha: 'NEW2' } }) }; };
  const c = new GitHubClient({ owner: 'o', repo: 'r', token: 't' });
  await c.putFile({ v: 1 }, 'OLD');
  assert.equal(sentBody.sha, 'OLD');
});

test('putFile throws CONFLICT on 409', async () => {
  globalThis.fetch = async () => ({ ok: false, status: 409, json: async () => ({}) });
  const c = new GitHubClient({ owner: 'o', repo: 'r', token: 't' });
  await assert.rejects(() => c.putFile({ v: 1 }, 'STALE'), /CONFLICT/);
});
