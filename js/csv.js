// CSV statement parser (extracted from index.html; behavior preserved).
export const CSV = {
  parse(raw) {
    const lines = raw.trim().replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
    // Find header row
    let hi = 0;
    for (let i = 0; i < Math.min(lines.length, 8); i++) {
      const l = lines[i].toLowerCase();
      if (l.includes('date') || l.includes('amount') || l.includes('balance')) { hi = i; break; }
    }
    const hdr = this.split(lines[hi]).map(h => h.toLowerCase().replace(/[^a-z0-9 ]/g,'').trim());
    const rows = lines.slice(hi + 1).filter(l => l.trim());
    const fmt = this.detect(hdr);
    const txs = [];
    for (const row of rows) {
      const f = this.split(row);
      const tx = this.parseTx(f, hdr, fmt);
      if (tx) txs.push(tx);
    }
    return txs;
  },

  detect(h) {
    const s = h.join(',');
    if (s.includes('money out') || s.includes('money in')) return 'monzo';
    if (s.includes('debit amount') || s.includes('credit amount')) return 'lloyds';
    if (s.includes('debits') && s.includes('credits')) return 'nationwide';
    return 'generic';
  },

  parseTx(f, h, fmt) {
    const g = (...names) => {
      for (const n of names) {
        const i = h.findIndex(x => x.includes(n));
        if (i >= 0 && f[i] != null) return f[i].replace(/"/g,'').trim();
      }
      return '';
    };
    let date, desc, amt, bal;

    if (fmt === 'monzo') {
      date = this.parseDate(g('date'));
      desc = g('name','description','merchant');
      const mIn  = this.parseAmt(g('money in'));
      const mOut = this.parseAmt(g('money out'));
      amt = (mIn || 0) - (mOut || 0);
      bal = this.parseAmt(g('balance'));
    } else if (fmt === 'lloyds') {
      date = this.parseDate(g('transaction date','date'));
      desc = g('transaction description','description');
      const dbt = this.parseAmt(g('debit amount','debit'));
      const crd = this.parseAmt(g('credit amount','credit'));
      amt = (crd || 0) - (dbt || 0);
      bal = this.parseAmt(g('balance'));
    } else if (fmt === 'nationwide') {
      date = this.parseDate(g('date'));
      desc = g('transactions','description','transaction');
      const dbt = this.parseAmt(g('debits'));
      const crd = this.parseAmt(g('credits'));
      amt = (crd || 0) - (dbt || 0);
      bal = this.parseAmt(g('balance'));
    } else {
      date = this.parseDate(g('date'));
      desc = g('description','memo','reference','narrative','name','counter party','details');
      let a = this.parseAmt(g('amount','value','paid in out'));
      if (a == null) {
        const crd = this.parseAmt(g('credit','paid in','in'));
        const dbt = this.parseAmt(g('debit','paid out','out'));
        a = (crd || 0) - (dbt || 0);
      }
      amt = a;
      bal = this.parseAmt(g('balance','running balance'));
    }

    if (!date || amt == null || isNaN(amt)) return null;
    const tx = { date, desc: desc || 'Transaction', amt: Math.round(amt * 100) / 100 };
    if (bal != null && !isNaN(bal)) tx.bal = Math.round(bal * 100) / 100;
    return tx;
  },

  split(line) {
    const out = []; let cur = '', q = false;
    for (const c of line) {
      if (c === '"') { q = !q; }
      else if (c === ',' && !q) { out.push(cur); cur = ''; }
      else cur += c;
    }
    out.push(cur);
    return out;
  },

  parseDate(s) {
    if (!s) return null;
    s = s.replace(/"/g,'').trim();
    let m;
    // DD/MM/YYYY or DD-MM-YYYY
    m = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (m) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
    // YYYY-MM-DD
    m = s.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
    if (m) return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
    // DD MMM YYYY
    const MONTHS = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
    m = s.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
    if (m) {
      const mo = MONTHS[m[2].toLowerCase().slice(0,3)];
      if (mo) return `${m[3]}-${String(mo).padStart(2,'0')}-${m[1].padStart(2,'0')}`;
    }
    // MMM DD YYYY
    m = s.match(/^([A-Za-z]{3,})\s+(\d{1,2}),?\s+(\d{4})/);
    if (m) {
      const mo = MONTHS[m[1].toLowerCase().slice(0,3)];
      if (mo) return `${m[3]}-${String(mo).padStart(2,'0')}-${m[2].padStart(2,'0')}`;
    }
    return null;
  },

  parseAmt(s) {
    if (s == null) return null;
    const n = parseFloat(String(s).replace(/[£$€,"]/g,'').trim());
    return isNaN(n) ? null : n;
  }
};
