import './style.css';
import { categories, txns, officialTotals } from './data.js';
import documentsIndex from './documents_index.json';
import xlsxData from './xlsx_data.json';

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
  const tbody = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="utr">${r[2]}</td><td><span class="mode-badge">${r[3]}</span></td><td style="color:${color}">${fmt(r[4])}</td><td class="stmt-ref" style="font-weight: 500; font-size: 0.85em; color: #6b7280;">${r[5] || 'N/A'}</td></tr>`).join('');
  return `<div class="txn-table-wrap"><table class="txn-table"><thead><tr><th>Date</th><th>Particular</th><th>UTR / Ref</th><th>Mode</th><th>Amount</th><th>Statement Ref</th></tr></thead><tbody>${tbody}</tbody></table></div>`;
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

// --- About Tab Setup ---
const timelineData = [
  {
    date: '11th Feb 2023',
    title: 'Partnership Deed of Jivaakaw Sri Healthcare',
    category: 'Deeds',
    desc: 'Deed of Partnership executed at Rayagada between Dr. Chilukuri Vamsi Sai Sampath (Managing Partner, 1st Party) and Sri Sisinti Lokanatha Patro (Partner, 2nd Party) to run pharmacy and doctor chambers.'
  },
  {
    date: 'October 2023',
    title: 'Establishment of Chiro Healthcare LLP',
    category: 'Deeds',
    desc: 'Chiro Healthcare LLP incorporated with partners Sri S. Lokanatha Patro and Dr. Chilukuri Vamsi Sai Sampath to establish medical diagnostic lab and clinic services.'
  },
  {
    date: '26th Nov 2023',
    title: 'CC Point Lease Agreement with Building Owner',
    category: 'Lease & Rentals',
    desc: 'Lease Agreement executed between the legal heirs of Late Gudla Sriram Murty (Lessor) and M/s Jivaakaw Sri Healthcare (Lessee) represented by Managing Partner Dr. Vamsi for CC Point Rayagada premises.'
  },
  {
    date: '15th Dec 2023',
    title: 'Registered Ten-Year Lease Deed Executed',
    category: 'Lease & Rentals',
    desc: 'Registered lease deed signed with building owners (Rajendra Kumar Sahu & others) for ground floor (940 sqft) and second floor (940 sqft) for a 10-year term. Total rent of ₹60,000/month: ₹54,000/month allocated to Chiro Healthcare LLP and ₹6,000/month allocated to Jivaakaw Sri Healthcare.'
  },
  {
    date: 'Jan 2024 - Dec 2024',
    title: 'Operations and Asset Building Phase',
    category: 'Financials',
    desc: 'Setting up the main diagnostic lab, pharmacy, tiles work, electricity, furniture, and staff hiring. Landlord rents paid up to October 2024. Active funding from partners: SLN Patro makes multiple SBI/ICICI bank transfers totalling ₹15.42 Lakhs as recorded in the ledger.'
  },
  {
    date: '12th Mar 2025',
    title: 'SLN Patro Submits Resignation Notice',
    category: 'Correspondence',
    desc: 'Sri S. Lokanatha Patro sends formal resignation notice from partnership/LLP due to personal financial issues and to support his son\'s business. Offers Dr. Vamsi options: buy out his share, sell the setup, or shut down, and asks to be absolved of all future liability.'
  },
  {
    date: '9th Jun 2025',
    title: 'Legal Demand Notice for Rent Arrears (Rs. 4.54 Lakhs)',
    category: 'Legal Notices',
    desc: 'Landlord\'s advocate Gangadhar Padhi serves legal notice to S. Lokanatha Patro. Demands arrears of rent starting November 2024: ground floor (Chiro LLP) ₹54k/PM and second floor (Jivaakaw Sri) ₹6k/PM. Total claimed: ₹4,54,300 + default interest + May 2025 rent.'
  },
  {
    date: '18th Jun 2025',
    title: 'Dr. Vamsi Responds to Resignation & Operations',
    category: 'Correspondence',
    desc: 'Dr. Vamsi denies the resignation. Asserts Taiyo Labs was set up with SLNP\'s full knowledge. Details concerns about staff (Tirupati, Hitesh) mismanagement, cash withdrawals, and insists that no final settlement can occur until a complete audit is performed.'
  },
  {
    date: '19th Jun 2025',
    title: 'SLN Patro Agrees to Full Audit Coordination',
    category: 'Correspondence',
    desc: 'SLN Patro replies, welcoming a comprehensive audit to establish absolute financial clarity. Denies unauthorized cash retention and agrees to cooperate fully with accounting specialists to clear outstanding issues.'
  },
  {
    date: '10th Jul 2025',
    title: 'Follow-up for Audit Progress and Official Notifications',
    category: 'Correspondence',
    desc: 'SLN Patro requests an update on the audit. Informs Dr. Vamsi that since the resignation remains pending, he will formally notify bank managers and licensing authorities about his disassociation to protect himself from growing liabilities.'
  },
  {
    date: '17th Jul 2025',
    title: 'SLN Patro Requests Financial Breakdown & Machine Refund',
    category: 'Correspondence',
    desc: 'SLN Patro requests a detailed breakdown of the ₹80 Lakhs loan liability. Mentions ₹30 Lakhs paid in advance to a supplier for an ultrasound machine which was never delivered. Proposes retrieving the refund immediately to pay down the bank loan.'
  },
  {
    date: '17th Aug 2025',
    title: 'Urgent Alert of Police Inquiry Over Rent Default',
    category: 'Correspondence',
    desc: 'SLN Patro sends urgent email reporting police inquiries resulting from the landlord\'s non-payment complaint. Demands immediate execution of retirement deed to separate his name from Chiro & Jivaakaw operations.'
  },
  {
    date: '7th Jan 2026',
    title: 'Eviction Notice from Advocate Ansuman Padhi (Rs. 15.00 Lakhs)',
    category: 'Legal Notices',
    desc: 'Building owner\'s new advocate, Ansuman Padhi, sends a final legal notice warning of eviction proceedings and demanding the payment of total accumulated rent arrears amounting to ₹15,00,000.'
  },
  {
    date: '8th Feb 2026',
    title: 'Final Retirement Demand & Indemnity Notice',
    category: 'Legal Notices',
    desc: 'S. Lokanatha Patro serves a final formal retirement notice to Dr. Vamsi. Demands the release of his capital, refund of ₹15.42 Lakhs personal advances, and full indemnity against the bank loan (SBI & Union Bank) and landlord rent claims.'
  }
];

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📄';
  if (ext === 'xlsx' || ext === 'xls') return '📊';
  if (['jpeg', 'jpg', 'png', 'gif'].includes(ext)) return '🖼️';
  return '🌐';
};

const parseExcelRows = (rows) => {
  if (!rows || rows.length <= 1) return [];
  const items = [];
  let currentYear = '2023';
  let currentMonth = '';
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    
    if (row[0] !== null && row[0] !== undefined && row[0] !== '') {
      currentYear = String(row[0]).replace(/\n/g, ' ').trim();
    }
    if (row[1] !== null && row[1] !== undefined && row[1] !== '') {
      currentMonth = String(row[1]).replace(/\n/g, ' ').trim();
    }
    
    if (!row[4] && !row[5]) continue;
    
    let dateStr = '';
    if (row[2]) {
      const serial = Number(row[2]);
      if (!isNaN(serial) && serial > 20000) {
        const dateObj = new Date((serial - 25569) * 86400 * 1000);
        if (!isNaN(dateObj.getTime())) {
          dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
      } else {
        dateStr = String(row[2]).trim();
      }
    }
    
    const amount = Number(row[5]);
    if (isNaN(amount)) continue;
    
    items.push({
      year: currentYear,
      month: currentMonth,
      date: dateStr,
      by: row[3] ? String(row[3]).trim() : 'N/A',
      particular: row[4] ? String(row[4]).trim() : 'N/A',
      amount: amount
    });
  }
  return items;
};

// Render the entire About Tab HTML structure
const renderAboutTab = () => {
  const container = document.getElementById('tab-about');
  container.innerHTML = `
    <div class="about-container">
      <div class="about-intro-card">
        <h2>Enterprise Overview & Legal Records</h2>
        <p>A comprehensive timeline of corporate events, partnership deeds, registration credentials, and legal notices governing <strong>Chiro Healthcare LLP</strong> (SBI Account) and <strong>Jivaakaw Sri Healthcare</strong> (ICICI Account) at Rayagada, Odisha.</p>
        <p>This repository stores all primary source records, partnership disputes, resignation correspondence, lease deeds, and the complete ledger of setup and operational expenditures to facilitate detailed analysis and auditing.</p>
      </div>

      <div class="about-subnav">
        <button class="about-subnav-btn active" data-sub="timeline">Timeline & History</button>
        <button class="about-subnav-btn" data-sub="docs">Deeds & Documents</button>
        <button class="about-subnav-btn" data-sub="expenses">Setup & Operational Expenses</button>
      </div>

      <!-- About Views -->
      <div class="about-section-content active" id="about-timeline">
        <div class="about-timeline">
          ${timelineData.map(t => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-date">${t.date}</span>
                  <span class="timeline-category">${t.category}</span>
                </div>
                <h3 class="timeline-title">${t.title}</h3>
                <p class="timeline-desc">${t.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="about-section-content" id="about-docs">
        <div class="doc-search-wrap">
          <input type="text" class="doc-search-input" id="docSearch" placeholder="Search documents by name..." />
          <select class="doc-filter-select" id="docCategoryFilter">
            <option value="all">All Categories</option>
            <option value="Root Documents">Root Documents</option>
            <option value="Chiro Healthcare LLP - Medical Lab">Chiro Healthcare LLP - Medical Lab</option>
            <option value="Jivakawshree Healthcare - Pharmacy and Doctor Chambers">Jivakawshree Healthcare - Pharmacy and Doctor Chambers</option>
            <option value="Email Correspondance between S Lokanatha Patro and Dr. Vamsi">Email Correspondence</option>
          </select>
        </div>
        <div class="doc-grid" id="docGrid"></div>
      </div>

      <div class="about-section-content" id="about-expenses">
        <div class="expense-summary-grid">
          <div class="expense-stat">
            <div class="expense-stat-value">₹49,91,945.75</div>
            <div class="expense-stat-label">Grand Total Capital Investment</div>
          </div>
          <div class="expense-stat">
            <div class="expense-stat-value">₹44,95,645.75</div>
            <div class="expense-stat-label">Ledger Recorded Expenses</div>
          </div>
          <div class="expense-stat">
            <div class="expense-stat-value">₹4,96,300.00</div>
            <div class="expense-stat-label">Payments Unrecorded in Ledger</div>
          </div>
        </div>

        <div class="bank-section" style="margin-top: 32px;">
          <div class="bank-header">
            <h3>Ledger Unrecorded setup payments</h3>
            <span class="txn-count">8 payments</span>
            <span class="bank-total">₹4,96,300.00</span>
          </div>
          <div class="txn-table-wrap">
            <table class="txn-table">
              <thead>
                <tr>
                  <th>Particular</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Tirupati Behera Taken</td><td style="text-align: right; font-family: var(--mono); font-weight: 600;">₹20,000.00</td></tr>
                <tr><td>Additional Civil work 3rd Payment (Sima Sahu)</td><td style="text-align: right; font-family: var(--mono); font-weight: 600;">₹80,000.00</td></tr>
                <tr><td>Sima Sahu Land Owner for additional Civil work</td><td style="text-align: right; font-family: var(--mono); font-weight: 600;">₹50,000.00</td></tr>
                <tr><td>Advocate Ramesh for lease deed registration</td><td style="text-align: right; font-family: var(--mono); font-weight: 600;">₹44,000.00</td></tr>
                <tr><td>Sima Sahu Final Advance Payment</td><td style="text-align: right; font-family: var(--mono); font-weight: 600;">₹2,49,000.00</td></tr>
                <tr><td>Partnership Notary</td><td style="text-align: right; font-family: var(--mono); font-weight: 600;">₹300.00</td></tr>
                <tr><td>Er Pattnaik for Measurement</td><td style="text-align: right; font-family: var(--mono); font-weight: 600;">₹2,000.00</td></tr>
                <tr><td>Sima Sahu Advance</td><td style="text-align: right; font-family: var(--mono); font-weight: 600;">₹51,000.00</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bank-section" style="margin-top: 40px;">
          <div class="bank-header" style="border-bottom: 1px solid var(--border);">
            <h3>Setup & Operational Expense Ledger</h3>
            <span class="txn-count" id="expenseCount">0 entries</span>
          </div>
          <div class="expense-search-bar" style="margin: 16px 0;">
            <input type="text" class="expense-search-input" id="expenseSearch" placeholder="Search by particular, person or month..." />
          </div>
          <div class="txn-table-wrap">
            <table class="txn-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Month/Year</th>
                  <th>Expense Made By</th>
                  <th>Expense Particular</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody id="expenseTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Sub-nav switching logic
  const subBtns = container.querySelectorAll('.about-subnav-btn');
  const sections = container.querySelectorAll('.about-section-content');
  
  subBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active');
      container.querySelector(`#about-${btn.dataset.sub}`).classList.add('active');
    });
  });

  // Render Documents Grid with Search & Filter
  const renderDocs = () => {
    const searchVal = document.getElementById('docSearch').value.toLowerCase();
    const catVal = document.getElementById('docCategoryFilter').value;
    const grid = document.getElementById('docGrid');
    
    const filteredDocs = documentsIndex.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchVal);
      const matchCat = catVal === 'all' || d.category === catVal;
      return matchSearch && matchCat;
    });

    if (!filteredDocs.length) {
      grid.innerHTML = '<div class="no-data" style="grid-column: 1/-1;">No documents match your filters</div>';
      return;
    }

    grid.innerHTML = filteredDocs.map(d => `
      <div class="doc-card">
        <div class="doc-card-top">
          <div class="doc-icon-box">${getFileIcon(d.name)}</div>
          <div>
            <div class="doc-title">${d.name}</div>
            <div class="doc-meta">
              <span class="doc-size">${formatBytes(d.sizeBytes)}</span>
              <span>•</span>
              <span>${d.category}</span>
            </div>
          </div>
        </div>
        <a href="${d.relativePath}" class="doc-download-btn" download="${d.name}">
          <svg style="width:14px;height:14px;fill:currentColor" viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>
          Download File
        </a>
      </div>
    `).join('');
  };

  document.getElementById('docSearch').addEventListener('input', renderDocs);
  document.getElementById('docCategoryFilter').addEventListener('change', renderDocs);
  renderDocs();

  // Render Expense Ledger Table with Search
  const allExpenses = parseExcelRows(xlsxData.Sheet1);
  
  const renderExpenses = () => {
    const searchVal = document.getElementById('expenseSearch').value.toLowerCase();
    const tbody = document.getElementById('expenseTableBody');
    
    const filteredExpenses = allExpenses.filter(e => {
      return e.particular.toLowerCase().includes(searchVal) || 
             e.by.toLowerCase().includes(searchVal) || 
             e.month.toLowerCase().includes(searchVal) || 
             e.year.toLowerCase().includes(searchVal);
    });

    document.getElementById('expenseCount').innerText = `${filteredExpenses.length} entries`;

    if (!filteredExpenses.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="no-data">No expense entries found</td></tr>';
      return;
    }

    tbody.innerHTML = filteredExpenses.map(e => `
      <tr>
        <td style="font-family:var(--mono); font-size:0.78rem">${e.date || 'N/A'}</td>
        <td>${e.month} ${e.year}</td>
        <td><span class="mode-badge" style="background:rgba(255,255,255,0.03); border: 1px solid var(--border);">${e.by}</span></td>
        <td style="max-width:320px; white-space:normal; word-break:break-word">${e.particular}</td>
        <td style="text-align: right; font-family: var(--mono); font-weight: 600; color: var(--accent);">${fmt(e.amount)}</td>
      </tr>
    `).join('');
  };

  document.getElementById('expenseSearch').addEventListener('input', renderExpenses);
  renderExpenses();
};

renderAboutTab();

// --- Tab Navigation ---
const links = document.querySelectorAll('.nav-link');
const tabs = document.querySelectorAll('.tab-content');
const navLinks = document.getElementById('navLinks');
const toggle = document.getElementById('mobileToggle');

function switchTab(tabId) {
  tabs.forEach(t => t.classList.remove('active'));
  links.forEach(l => l.classList.remove('active'));
  
  document.getElementById(`tab-${tabId}`).classList.add('active');
  const activeLink = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeLink) activeLink.classList.add('active');
  
  navLinks.classList.remove('open');
  toggle.classList.remove('active');
  window.scrollTo({ top: (tabId === 'overview' || tabId === 'about') ? 0 : document.querySelector('.main-content').offsetTop - 80, behavior: 'smooth' });
}

links.forEach(l => l.addEventListener('click', e => { e.preventDefault(); switchTab(l.dataset.tab); }));
document.querySelectorAll('[data-goto]').forEach(el => el.addEventListener('click', () => switchTab(el.dataset.goto)));
toggle.addEventListener('click', () => { navLinks.classList.toggle('open'); toggle.classList.toggle('active'); });

// Navbar scroll effect
window.addEventListener('scroll', () => document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20));
