import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CSV } from '../js/csv.js';

test('monzo: money in/out → signed amount', () => {
  const txs = CSV.parse('Date,Name,Money In,Money Out,Balance\n01/02/2026,Coffee,,3.50,100.00');
  assert.deepEqual(txs, [{ date: '2026-02-01', desc: 'Coffee', amt: -3.5, bal: 100 }]);
});

test('lloyds: debit/credit columns → credit positive', () => {
  const txs = CSV.parse('Transaction Date,Transaction Description,Debit Amount,Credit Amount,Balance\n02/02/2026,Salary,,2000.00,2100.00');
  assert.deepEqual(txs, [{ date: '2026-02-02', desc: 'Salary', amt: 2000, bal: 2100 }]);
});

test('nationwide: debits/credits → debit negative', () => {
  const txs = CSV.parse('Date,Transactions,Debits,Credits,Balance\n03/02/2026,Shop,10.00,,90.00');
  assert.deepEqual(txs, [{ date: '2026-02-03', desc: 'Shop', amt: -10, bal: 90 }]);
});

test('generic: date/description/amount/balance', () => {
  const txs = CSV.parse('Date,Description,Amount,Balance\n04/02/2026,Interest,1.23,91.23');
  assert.deepEqual(txs, [{ date: '2026-02-04', desc: 'Interest', amt: 1.23, bal: 91.23 }]);
});

test('detect classifies the existing formats', () => {
  assert.equal(CSV.detect(['date','name','money in','money out','balance']), 'monzo');
  assert.equal(CSV.detect(['transaction date','debit amount','credit amount','balance']), 'lloyds');
  assert.equal(CSV.detect(['date','transactions','debits','credits','balance']), 'nationwide');
  assert.equal(CSV.detect(['date','description','amount','balance']), 'generic');
});
