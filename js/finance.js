// Pure finance domain logic: account types, tax-year contributions, forecasts, ISA allowance.
// Importable for node --test; also loaded in the browser (exposed as window.Finance).

export const ISA_ALLOWANCE = 20000;
export const LISA_ALLOWANCE = 4000;
export const LISA_BONUS_RATE = 0.25;

export const TYPES = {
  savings:  { lbl: 'Personal Savings',     icon: '🏦', col: '#059669', cls: 't-savings',  isa: false, lisa: false },
  cash_isa: { lbl: 'Cash ISA',             icon: '💷', col: '#0ea5e9', cls: 't-cash-isa', isa: true,  lisa: false },
  ss_isa:   { lbl: 'Stocks & Shares ISA',  icon: '📈', col: '#f59e0b', cls: 't-ss-isa',   isa: true,  lisa: false },
  lisa:     { lbl: 'Cash LISA',            icon: '🏠', col: '#7c3aed', cls: 't-lisa',     isa: true,  lisa: true  },
  ss_lisa:  { lbl: 'Stocks & Shares LISA', icon: '📊', col: '#db2777', cls: 't-ss-lisa',  isa: true,  lisa: true  },
  business: { lbl: 'Business Savings',     icon: '💼', col: '#0891b2', cls: 't-business', isa: false, lisa: false },
  other:    { lbl: 'Other',                icon: '💰', col: '#64748b', cls: 't-other',    isa: false, lisa: false },
};

export function typeInfo(key) { return TYPES[key] || TYPES.other; }
export function isaFamily(key) { return !!(TYPES[key] && TYPES[key].isa); }
export function lisaFamily(key) { return !!(TYPES[key] && TYPES[key].lisa); }

export function currentTaxYearStart(now = new Date()) {
  const before6Apr = now.getMonth() < 3 || (now.getMonth() === 3 && now.getDate() < 6);
  const y = before6Apr ? now.getFullYear() - 1 : now.getFullYear();
  return new Date(y, 3, 6);
}

export function taxYearLabel(now = new Date()) {
  const s = currentTaxYearStart(now);
  return `${s.getFullYear()}/${String(s.getFullYear() + 1).slice(2)}`;
}

export function contributionsThisTaxYear(account, txs = [], now = new Date()) {
  const tyStart = currentTaxYearStart(now);
  const deposits = txs.filter(t => t && t.contribution === true && new Date(t.date + 'T12:00:00') >= tyStart);
  if (deposits.length) return Math.round(deposits.reduce((s, t) => s + t.amt, 0) * 100) / 100;
  return Math.round((parseFloat(account.contribTaxYear) || 0) * 100) / 100;
}

export function monthly(txs) {
  const m = {};
  for (const t of txs) {
    const k = t.date.slice(0, 7);
    if (!m[k]) m[k] = { net: 0, bal: null, in: 0, out: 0 };
    m[k].net += t.amt;
    if (t.amt > 0) m[k].in += t.amt; else m[k].out += Math.abs(t.amt);
    if (t.bal != null) m[k].bal = t.bal;
  }
  return Object.entries(m).sort((a, b) => a[0].localeCompare(b[0]));
}

export function avgChange(txs, n = 6) {
  const mo = monthly(txs).slice(-n);
  if (!mo.length) return 0;
  return mo.reduce((s, [, m]) => s + m.net, 0) / mo.length;
}

export function projectAccount({ balance, rate, monthlyDeposit }, txs = [], months = 12, now = new Date()) {
  const hasRate = rate != null && rate !== '' && !isNaN(parseFloat(rate));
  const hist = monthly(txs);
  const mode = hasRate ? 'rate' : (hist.length >= 2 ? 'history' : 'flat');
  const monthlyRate = hasRate ? parseFloat(rate) / 100 / 12 : 0;
  const deposit = parseFloat(monthlyDeposit) || 0;
  const avg = mode === 'history' ? avgChange(txs) : 0;

  let bal = balance;
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
    let chg;
    if (mode === 'rate') { chg = bal * monthlyRate + deposit; bal = bal + chg; }
    else if (mode === 'history') { chg = avg; bal = bal + avg; }
    else { chg = 0; }
    return {
      lbl: d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      bal: Math.round(bal * 100) / 100,
      chg: Math.round(chg * 100) / 100,
    };
  });
}

export function projectTotal(entries = [], months = 12, now = new Date()) {
  const per = entries.map(e => projectAccount(e, e.txs || [], months, now));
  return Array.from({ length: months }, (_, i) => {
    const bal = per.reduce((s, p) => s + (p[i]?.bal || 0), 0);
    const chg = per.reduce((s, p) => s + (p[i]?.chg || 0), 0);
    return {
      lbl: per[0]?.[i]?.lbl || '',
      key: per[0]?.[i]?.key || '',
      bal: Math.round(bal * 100) / 100,
      chg: Math.round(chg * 100) / 100,
    };
  });
}
