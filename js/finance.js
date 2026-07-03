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
