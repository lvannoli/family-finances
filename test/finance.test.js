import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TYPES, typeInfo, isaFamily, lisaFamily,
  ISA_ALLOWANCE, LISA_ALLOWANCE,
  currentTaxYearStart, taxYearLabel, contributionsThisTaxYear,
} from '../js/finance.js';

test('TYPES has the 7 expected keys with isa/lisa flags', () => {
  assert.deepEqual(Object.keys(TYPES), ['savings','cash_isa','ss_isa','lisa','ss_lisa','business','other']);
  assert.equal(TYPES.lisa.lbl, 'Cash LISA');
  assert.equal(isaFamily('cash_isa'), true);
  assert.equal(isaFamily('ss_lisa'), true);
  assert.equal(isaFamily('savings'), false);
  assert.equal(lisaFamily('ss_lisa'), true);
  assert.equal(lisaFamily('cash_isa'), false);
});

test('typeInfo falls back to other for unknown keys', () => {
  assert.equal(typeInfo('nope'), TYPES.other);
  assert.equal(typeInfo('lisa'), TYPES.lisa);
});

test('allowance constants', () => {
  assert.equal(ISA_ALLOWANCE, 20000);
  assert.equal(LISA_ALLOWANCE, 4000);
});

test('currentTaxYearStart respects the 6 April boundary', () => {
  assert.deepEqual(currentTaxYearStart(new Date(2026, 3, 5)), new Date(2025, 3, 6)); // 5 Apr → prev year
  assert.deepEqual(currentTaxYearStart(new Date(2026, 3, 6)), new Date(2026, 3, 6)); // 6 Apr → this year
  assert.deepEqual(currentTaxYearStart(new Date(2026, 0, 15)), new Date(2025, 3, 6)); // Jan → prev year
  assert.equal(taxYearLabel(new Date(2026, 5, 1)), '2026/27');
});

test('contributionsThisTaxYear: manual field when no deposit txs', () => {
  const now = new Date(2026, 5, 1);
  assert.equal(contributionsThisTaxYear({ contribTaxYear: 3000 }, [], now), 3000);
  assert.equal(contributionsThisTaxYear({}, [], now), 0);
});

test('contributionsThisTaxYear: sums flagged deposit txs in tax year, ignoring others', () => {
  const now = new Date(2026, 5, 1); // tax year started 2026-04-06
  const txs = [
    { date: '2026-05-01', amt: 1000, contribution: true },
    { date: '2026-05-10', amt: 500,  contribution: true },
    { date: '2026-05-15', amt: 999,  contribution: false }, // not a contribution
    { date: '2026-03-01', amt: 800,  contribution: true },  // previous tax year
  ];
  assert.equal(contributionsThisTaxYear({ contribTaxYear: 99 }, txs, now), 1500); // auto wins over manual
});
