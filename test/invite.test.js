import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildInviteUrl, parseInvite } from '../js/invite.js';

const BASE = 'https://family-finances-1kc.pages.dev/';
const CFG = { owner: 'lvannoli', repo: 'family-finances-data', token: 'github_pat_ABC123' };

test('round-trips owner/repo/token through build → parse', () => {
  const url = parseInvite(buildInviteUrl(CFG, BASE));
  assert.deepEqual(url, CFG);
});

test('parseInvite works on a full URL, a bare #fragment, and a bare invite= string', () => {
  const full = buildInviteUrl(CFG, BASE);
  const frag = '#' + full.split('#')[1];
  const bare = full.split('#')[1];
  assert.deepEqual(parseInvite(full), CFG);
  assert.deepEqual(parseInvite(frag), CFG);
  assert.deepEqual(parseInvite(bare), CFG);
});

test('the built link never contains the passphrase', () => {
  const url = buildInviteUrl({ ...CFG, passphrase: 'super-secret-pass' }, BASE);
  assert.ok(!url.includes('super-secret-pass'));
  const parsed = parseInvite(url);
  assert.deepEqual(parsed, CFG);           // only the 3 keys survive
  assert.equal(parsed.passphrase, undefined);
});

test('parseInvite returns null for junk / missing / oversized / incomplete', () => {
  assert.equal(parseInvite('https://family-finances-1kc.pages.dev/'), null); // no #invite
  assert.equal(parseInvite('#other=1'), null);
  assert.equal(parseInvite('#invite=@@@not-base64@@@'), null);
  assert.equal(parseInvite('#invite=' + 'A'.repeat(5000)), null);            // oversized
  // valid base64url but not the right shape:
  const notJson = Buffer.from('hello', 'utf-8').toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  assert.equal(parseInvite('#invite=' + notJson), null);
  const missingToken = Buffer.from(JSON.stringify({ owner: 'x', repo: 'y' }), 'utf-8').toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  assert.equal(parseInvite('#invite=' + missingToken), null);
});
