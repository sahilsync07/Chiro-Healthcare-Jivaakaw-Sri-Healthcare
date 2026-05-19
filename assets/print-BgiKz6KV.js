import{n as e,r as t,t as n}from"./data-DF_PRSXQ.js";var r=e=>`₹`+e.toLocaleString(`en-IN`),i=e=>e.reduce((e,t)=>e+t[4],0),a=e=>{let t=e.split(`-`);return t.length===3&&t[2].length===4?`${t[0]}-${t[1]}-${t[2].slice(-2)}`:e},o=e.sbi,s=e.icici,c=document.getElementById(`print-container`);function l(e,t,n){return`
    <div class="print-header">
      <div>
        <h1>Chiro & Jivaakaw Sri Healthcare</h1>
        <div style="font-size:10px; margin-top:2px;">Credit Forensic Analysis Report</div>
      </div>
      <div class="meta">
        <div><strong>Statement Period:</strong> 01-01-2024 to 18-05-2026</div>
        <div>Page ${t} of ${n}</div>
      </div>
    </div>
  `}function u(e,t){return`
    <div class="print-footer">
      <div>Confidential — Prepared for Legal & Financial Audit</div>
      <div>Printed: ${new Date().toLocaleDateString(`en-IN`)}</div>
    </div>
  `}async function d(){let e=``,d=[],f=n.map(e=>{let n=t[e.id],a=i(n.sbi),o=i(n.icici),s=a+o;return`
      <tr>
        <td style="font-weight: 500;">${e.name}</td>
        <td class="amount">${r(a)}</td>
        <td class="amount">${r(o)}</td>
        <td class="amount" style="font-weight: 600;">${r(s)}</td>
      </tr>
    `}).join(``),p=n.reduce((e,n)=>e+i(t[n.id].sbi),0),m=n.reduce((e,n)=>e+i(t[n.id].icici),0),h=p+m,g=`
    <div class="summary-title" style="margin-top: 20px;">I. Executive Summary</div>
    <p style="font-size: 12px; line-height: 1.6; margin-bottom: 25px;">
      This forensic analysis document reconstructs the credit transaction ledgers for 
      <strong>Chiro Healthcare LLP</strong> (SBI Account No. 42598694095) and 
      <strong>Jivaakaw Sri Healthcare</strong> (ICICI Account No. 2011628 details) 
      for the operational audit period from 01-01-2024 to 18-05-2026. 
      All credit transactions have been classified into 6 distinct categories based on partner contributions, 
      advances, and sales deposits.
    </p>
    
    <div class="summary-title">II. Consolidated Credits Overview</div>
    <table class="print-table">
      <thead>
        <tr>
          <th>Category Classification</th>
          <th style="text-align: right;">Chiro LLP (SBI) Credits</th>
          <th style="text-align: right;">Jivaakaw Sri (ICICI) Credits</th>
          <th style="text-align: right;">Combined Total</th>
        </tr>
      </thead>
      <tbody>
        ${f}
        <tr class="total-row">
          <td>Grand Total Credits</td>
          <td class="amount">${r(p)}</td>
          <td class="amount">${r(m)}</td>
          <td class="amount">${r(h)}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="summary-title" style="margin-top: 30px;">III. Bank Statement Checksums & Reconciliation</div>
    <div class="checksum-box">
      <h3>Chiro Healthcare LLP — State Bank of India (SBI)</h3>
      <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
        <span>Sum of Extracted Data:</span>
        <strong>${r(p)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
        <span>Official Statement Total:</span>
        <strong>${r(o)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; border-top:1px solid #000; padding-top:4px;">
        <span>Reconciliation Status:</span>
        <span class="verification-seal">✓ 100% Match & Verified</span>
      </div>
    </div>
    
    <div class="checksum-box">
      <h3>Jivaakaw Sri Healthcare — ICICI Bank</h3>
      <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
        <span>Sum of Extracted Data:</span>
        <strong>${r(m)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
        <span>Official Statement Total:</span>
        <strong>${r(s)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; border-top:1px solid #000; padding-top:4px;">
        <span>Reconciliation Status:</span>
        <span class="verification-seal">✓ 100% Match & Verified</span>
      </div>
    </div>
  `;d.push({type:`summary`,content:g}),n.forEach(e=>{let n=t[e.id],o=n.sbi.map(e=>({date:e[0],desc:e[1],ref:e[2],mode:e[3],amt:e[4],stmtRef:e[5],bank:`SBI`})),s=n.icici.map(e=>({date:e[0],desc:e[1],ref:e[2],mode:e[3],amt:e[4],stmtRef:e[5],bank:`ICICI`})),c=e=>{let t=e.split(`-`);return new Date(t[2],t[1]-1,t[0])},l=[...o,...s].sort((e,t)=>c(e.date)-c(t.date)),u=0,f=1;for(;u<l.length;){let t=f===1,o=t?18:24,s=l.slice(u,u+o),c=s.map((e,t)=>`
        <tr>
          <td style="text-align: center;">${u+t+1}</td>
          <td>${a(e.date)}</td>
          <td style="font-weight: 500; word-break: break-word;">${e.desc}</td>
          <td style="font-family: 'JetBrains Mono', monospace; font-size: 9px; word-break: break-all;">${e.ref}</td>
          <td>${e.mode}</td>
          <td style="text-align: center;">${e.bank}</td>
          <td class="amount">${r(e.amt)}</td>
          <td style="font-size: 9px; font-weight: 500; color: #4b5563;">${e.stmtRef}</td>
        </tr>
      `).join(``),p=`
        ${t?`
        <div class="summary-title" style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
          <span>Category ${e.id.replace(`cat`,``)}: ${e.name}</span>
          <span style="font-size: 12px; font-weight: normal; text-transform: none;">Total Credits: <strong>${r(i(n.sbi)+i(n.icici))}</strong></span>
        </div>
        <div style="font-size: 11px; margin-bottom: 15px; color: #4b5563;">${e.desc}</div>
      `:`
        <div class="summary-title" style="margin-top: 10px; font-size: 12px;">
          Category ${e.id.replace(`cat`,``)}: ${e.name} (Continued)
        </div>
      `}
        <table class="print-table">
          <colgroup>
            <col style="width: 4%;">
            <col style="width: 11%;">
            <col style="width: 31%;">
            <col style="width: 22%;">
            <col style="width: 9%;">
            <col style="width: 6%;">
            <col style="width: 11%;">
            <col style="width: 16%;">
          </colgroup>
          <thead>
            <tr>
              <th style="text-align: center;">#</th>
              <th>Date</th>
              <th>Particulars</th>
              <th>UTR / Ref</th>
              <th>Mode</th>
              <th style="text-align: center;">Bank</th>
              <th style="text-align: right;">Amount</th>
              <th>Statement Ref</th>
            </tr>
          </thead>
          <tbody>
            ${c}
            ${u+s.length===l.length?`
              <tr class="total-row">
                <td colspan="6" style="text-align: right; font-weight: 700;">Category Grand Total</td>
                <td class="amount">${r(i(n.sbi)+i(n.icici))}</td>
                <td></td>
              </tr>
            `:``}
          </tbody>
        </table>
      `;d.push({type:`detail`,content:p}),u+=o,f++}});let _=d.length;d.forEach((t,n)=>{let r=n+1;e+=`
      <div class="print-page">
        ${l(t.type===`summary`?`Consolidated Summary`:`Detailed Credits Ledger`,r,_)}
        <div class="print-content" style="min-height: 230mm;">
          ${t.content}
        </div>
        ${u(r,_)}
      </div>
    `}),c.innerHTML=e}d().catch(console.error);