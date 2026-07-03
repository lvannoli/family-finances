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

test('detect recognizes Trading212 (action + total)', () => {
  assert.equal(CSV.detect(['action','time','notes','id','total','currency total']), 'trading212');
});

test('trading212: deposit rows parse and are flagged as contributions', () => {
  const raw = [
    'Action,Time,Notes,ID,Total,Currency (Total)',
    'Deposit,06/06/2026 12:08,Transaction ID: ba34e77e,019e9cd5,20000,GBP',
    'Deposit,23/06/2026 01:31,Bank Transfer,019ef21a,9542.67,GBP',
    ',,,,25542.67,',
  ].join('\n');
  const txs = CSV.parse(raw);
  assert.equal(txs.length, 2);                       // summary row skipped
  assert.deepEqual(txs[0], { date: '2026-06-06', desc: 'Deposit', amt: 20000, contribution: true });
  assert.deepEqual(txs[1], { date: '2026-06-23', desc: 'Bank Transfer', amt: 9542.67, contribution: true });
});

test('trading212: non-deposit actions are not flagged as contributions', () => {
  const raw = [
    'Action,Time,Notes,ID,Total,Currency (Total)',
    'Withdrawal,10/06/2026 09:00,Cash out,019eff,-500,GBP',
  ].join('\n');
  const txs = CSV.parse(raw);
  assert.equal(txs.length, 1);
  assert.equal(txs[0].amt, -500);
  assert.equal(txs[0].contribution, undefined);
});
