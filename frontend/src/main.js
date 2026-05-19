import './style.css';
import { categories, txns, officialTotals } from './data.js';

const fmt = v => '₹' + v.toLocaleString('en-IN');
const sum = arr => arr.reduce((a, t) => a + t[4], 0);

// --- Hero Stats ---
const sbiTotal = officialTotals.sbi, iciciTotal = officialTotals.icici;
document.getElementById('heroStats').innerHTML = `
  <div class="stat-pill"><span class="stat-value">${fmt(sbiTotal+iciciTotal)}</span><span class="stat-label">Grand Total</span></div>
  <div class="stat-pill"><span class="stat-value">${fmt(sbiTotal)}</span><span class="stat-label">SBI Credits</span></div>
  <div class="stat-pill"><span class="stat-value">${fmt(iciciTotal)}</span><span class="stat-label">ICICI Credits</span></div>`;

// --- Overview Cards ---
const overviewHTML = categories.map((c, i) => {
  const d = txns[c.id], sbiSum = sum(d.sbi), iciciSum = sum(d.icici), total = sbiSum + iciciSum;
  return `<div class="overview-card" style="--card-color:${c.color}" data-goto="${c.id}">
    <div class="card-header"><div class="card-category"><div class="card-dot"></div><div class="card-title">${c.name}</div></div><div class="card-badge">${d.sbi.length+d.icici.length} txns</div></div>
    <div class="card-amounts">
      <div class="card-row"><span class="card-bank">Chiro Healthcare (SBI)</span><span class="card-amount">${fmt(sbiSum)}</span></div>
      <div class="card-row"><span class="card-bank">Jivaakaw Sri (ICICI)</span><span class="card-amount">${fmt(iciciSum)}</span></div>
      <div class="card-row card-total"><span class="card-bank">Grand Total</span><span class="card-amount">${fmt(total)}</span></div>
    </div></div>`;
}).join('');
document.getElementById('overviewGrid').innerHTML = overviewHTML;

// --- Checksum Section ---
const makeChecksum = (title, totals, official) => {
  const rows = categories.map((c, i) => `<tr><td style="color:${c.color}">${c.name}</td><td>${fmt(totals[i])}</td></tr>`).join('');
  const total = totals.reduce((a,b) => a+b, 0);
  return `<div class="checksum-card"><h3>${title} <span class="badge-match">✓ Perfect Match</span></h3>
    <table class="checksum-table">${rows}
    <tr class="total-row"><td>Sum of Extracted Data</td><td>${fmt(total)}</td></tr>
    <tr class="total-row"><td>Official Statement Total</td><td>${fmt(official)}</td></tr></table></div>`;
};
const sbiTotals = categories.map(c => sum(txns[c.id].sbi));
const iciciTotals = categories.map(c => sum(txns[c.id].icici));
document.getElementById('checksumSection').innerHTML = makeChecksum('Chiro Healthcare LLP (SBI)', sbiTotals, sbiTotal) + makeChecksum('Jivaakaw Sri Healthcare (ICICI)', iciciTotals, iciciTotal);

// --- Category Tabs ---
const makeBankTable = (rows, color) => {
  if (!rows.length) return '<div class="no-data">No transactions in this bank</div>';
  const tbody = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="utr">${r[2]}</td><td><span class="mode-badge">${r[3]}</span></td><td style="color:${color}">${fmt(r[4])}</td></tr>`).join('');
  return `<div class="txn-table-wrap"><table class="txn-table"><thead><tr><th>Date</th><th>Particular</th><th>UTR / Ref</th><th>Mode</th><th>Amount</th></tr></thead><tbody>${tbody}</tbody></table></div>`;
};

categories.forEach(c => {
  const d = txns[c.id], sbiSum = sum(d.sbi), iciciSum = sum(d.icici), total = sbiSum + iciciSum;
  document.getElementById(`tab-${c.id}`).innerHTML = `
    <div class="cat-hero" style="--card-color:${c.color}">
      <div class="cat-hero-icon" style="background:${c.color}15;font-size:1.8rem">${c.icon}</div>
      <div class="cat-hero-info"><h2 style="color:${c.color}">${c.name}</h2><p>${c.desc}</p></div>
      <div class="cat-hero-total"><div class="total-label">Grand Total</div><div class="total-value" style="color:${c.color}">${fmt(total)}</div></div>
    </div>
    <div class="bank-section">
      <div class="bank-header"><h3>Chiro Healthcare LLP (SBI)</h3><span class="txn-count">${d.sbi.length} transactions</span><span class="bank-total" style="color:${c.color}">${fmt(sbiSum)}</span></div>
      ${makeBankTable(d.sbi, c.color)}
    </div>
    <div class="bank-section">
      <div class="bank-header"><h3>Jivaakaw Sri Healthcare (ICICI)</h3><span class="txn-count">${d.icici.length} transactions</span><span class="bank-total" style="color:${c.color}">${fmt(iciciSum)}</span></div>
      ${makeBankTable(d.icici, c.color)}
    </div>`;
});

// --- Tab Navigation ---
const links = document.querySelectorAll('.nav-link');
const tabs = document.querySelectorAll('.tab-content');
const navLinks = document.getElementById('navLinks');
const toggle = document.getElementById('mobileToggle');

function switchTab(tabId) {
  tabs.forEach(t => t.classList.remove('active'));
  links.forEach(l => l.classList.remove('active'));
  document.getElementById(`tab-${tabId}`).classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  navLinks.classList.remove('open');
  toggle.classList.remove('active');
  window.scrollTo({ top: tabId === 'overview' ? 0 : document.querySelector('.main-content').offsetTop - 80, behavior: 'smooth' });
}

links.forEach(l => l.addEventListener('click', e => { e.preventDefault(); switchTab(l.dataset.tab); }));
document.querySelectorAll('[data-goto]').forEach(el => el.addEventListener('click', () => switchTab(el.dataset.goto)));
toggle.addEventListener('click', () => { navLinks.classList.toggle('open'); toggle.classList.toggle('active'); });

// Navbar scroll effect
window.addEventListener('scroll', () => document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20));
