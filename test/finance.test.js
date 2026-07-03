import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TYPES, typeInfo, isaFamily, lisaFamily,
  ISA_ALLOWANCE, LISA_ALLOWANCE,
  currentTaxYearStart, taxYearLabel, contributionsThisTaxYear,
  monthly, avgChange, projectAccount, projectTotal,
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

test('monthly groups and sorts by YYYY-MM with net/in/out', () => {
  const rows = monthly([
    { date: '2026-01-05', amt: 100 },
    { date: '2026-01-20', amt: -30 },
    { date: '2026-02-01', amt: 50, bal: 500 },
  ]);
  assert.equal(rows.length, 2);
  assert.equal(rows[0][0], '2026-01');
  assert.equal(rows[0][1].net, 70);
  assert.equal(rows[0][1].in, 100);
  assert.equal(rows[0][1].out, 30);
  assert.equal(rows[1][1].bal, 500);
});

test('projectAccount: rate set → compound growth + monthly deposit', () => {
  const now = new Date(2026, 0, 1);
  const proj = projectAccount({ balance: 1000, rate: 12, monthlyDeposit: 100 }, [], 2, now);
  // month 1: 1000*(1+0.01)+100 = 1110 ; month 2: 1110*1.01+100 = 1221.10
  assert.equal(proj.length, 2);
  assert.equal(proj[0].bal, 1110);
  assert.equal(proj[0].chg, 110);
  assert.equal(proj[1].bal, 1221.10);
});

test('projectAccount: rate set with no deposit defaults deposit to 0', () => {
  const now = new Date(2026, 0, 1);
  const proj = projectAccount({ balance: 1000, rate: 12 }, [], 1, now);
  assert.equal(proj[0].bal, 1010);
});

test('projectAccount: no rate but history → average-change projection', () => {
  const now = new Date(2026, 0, 1);
  const txs = [
    { date: '2025-11-01', amt: 200 },
    { date: '2025-12-01', amt: 200 },
  ];
  const proj = projectAccount({ balance: 1000 }, txs, 2, now);
  assert.equal(proj[0].bal, 1200);
  assert.equal(proj[1].bal, 1400);
  assert.equal(proj[0].chg, 200);
});

test('projectAccount: no rate and <2 months history → flat', () => {
  const now = new Date(2026, 0, 1);
  const proj = projectAccount({ balance: 1000 }, [{ date: '2025-12-01', amt: 50 }], 3, now);
  assert.deepEqual(proj.map(p => p.bal), [1000, 1000, 1000]);
  assert.equal(proj[0].chg, 0);
});

test('projectTotal sums per-account projections month by month', () => {
  const now = new Date(2026, 0, 1);
  const total = projectTotal([
    { balance: 1000, rate: 12, monthlyDeposit: 0 },   // →1010, 1020.10
    { balance: 500 },                                 // flat →500, 500
  ], 2, now);
  assert.equal(total[0].bal, 1510);
  assert.equal(total[1].bal, 1520.10);
});
