// Quick verification of 5 errors found by cross-checking SBI PDF
// Error 1: Taiyo 19-12-2024 UTR 435415149630 → PDF=9,379 not 19,520
// Error 2: Taiyo 14-02-2025 UTR 504521125222 → PDF=41,000 not 91,000
// Error 3: Taiyo 14-01-2026 UTR 601414982667 → PDF=10,000 not 50,000
// Error 4: Cash  08-10-2024 → PDF=10,000 not 1,20,000
// Error 5: Visit Health 29-11-2025 UTR AXISP00745456446 → PDF=2,790 not 3,176
const fs = require('fs');
const txt = fs.readFileSync('./chiro_sbi_extracted.txt','utf8');

// Verify each against PDF text
const checks = [
  ['435415149630', '9,379'],   // Taiyo 19-12
  ['504521125222', '41,000'],  // Taiyo 14-02
  ['601414982667', '10,000'],  // Taiyo 14-01-2026
  ['CASH DEPOSIT SELF.*08-10-2024', null], // need balance check
  ['AXISP007454.*56446.*VISIT HEALTH', '2,790'],
];

for (const [pattern, expected] of checks) {
  const idx = txt.indexOf(pattern.replace('.*',''));
  if (idx > -1) {
    const context = txt.substring(Math.max(0,idx-80), idx+120);
    console.log(`✓ Found ${pattern}:`);
    console.log(`  ...${context.replace(/\n/g,' ')}...\n`);
  } else console.log(`✗ Pattern ${pattern} not found directly\n`);
}

// Final corrected totals
const cat1=500000, cat2=1699841, cat3=772000;
const cat4=2393468-10141-50000-40000; // 2293327
const cat5=376083-110000; // 266083
const cat6=367683-386; // 367297
const sum=cat1+cat2+cat3+cat4+cat5+cat6;
console.log('=== CORRECTED SBI ===');
console.log(`Cat1: ${cat1} | Cat2: ${cat2} | Cat3: ${cat3}`);
console.log(`Cat4: ${cat4} | Cat5: ${cat5} | Cat6: ${cat6}`);
console.log(`Sum: ${sum} | Official: 5898548 | Match: ${sum===5898548}`);
