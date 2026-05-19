// Verify all category totals from the ledger data
function parseAmount(str) {
  return parseFloat(str.replace(/,/g, ''));
}

// ===== CHIRO HEALTHCARE LLP (SBI) =====

// Category 1: Dr. KC Patro (SBI)
const cat1_sbi = [500, 499500];
console.log('Cat1 SBI:', cat1_sbi.reduce((a,b)=>a+b,0)); // 500000

// Category 2: SLN Patro (SBI)
const cat2_sbi = [150000, 100000, 50000, 50000, 50000, 100000, 74841, 20000, 100000, 50000, 90000, 150000, 30000, 45000, 20000, 250000, 50000, 60000, 260000];
console.log('Cat2 SBI:', cat2_sbi.reduce((a,b)=>a+b,0)); // should be 1649841

// Category 3: Dr. Vamsi (SBI)
const cat3_sbi = [100000, 100000, 50000, 167000, 160000, 5000, 25000, 25000, 25000, 30000, 5000, 15000, 50000, 15000];
console.log('Cat3 SBI:', cat3_sbi.reduce((a,b)=>a+b,0)); // should be 772000

// Category 4: Taiyo Labs (SBI)
const cat4_sbi = [15000, 23543, 11827, 4250, 29706, 12194, 26930, 10484, 21119, 20919, 6650, 12300, 14827, 27843, 23428, 12228, 19520, 58330, 7276, 9994, 20000, 80000, 91000, 50000, 51000, 80000, 5000, 40000, 127000, 165000, 161000, 75000, 35000, 12000, 60000, 102000, 50000, 50000, 50000, 50000, 180000, 170000, 75000, 75000, 10000, 161100];
console.log('Cat4 SBI:', cat4_sbi.reduce((a,b)=>a+b,0));

// Category 5: Cash Self Deposit (SBI)
const cat5_sbi = [10000, 10000, 10000, 15000, 15000, 10000, 120000, 16000, 25000, 850, 2688, 5449, 3600, 1600, 1800, 500, 4230, 2330, 370, 1030, 1150, 2320, 3350, 1850, 1849, 1500, 1850, 1830, 4750, 650, 1149, 2974, 3967, 3000, 1930, 4270, 2358, 3300, 3980, 5280, 2250, 3400, 2579, 1650, 450, 2000, 10000, 7000, 13000, 8000, 17000];
console.log('Cat5 SBI:', cat5_sbi.reduce((a,b)=>a+b,0));

// Category 6: Miscellaneous (SBI)
const cat6_sbi = [1, 1, 15000, 110880, 20000, 60000, 1471, 1, 5000, 512, 2304, 3176, 630, 4860, 2931, 2528, 114948, 4464, 2835, 3699, 630, 2056, 3690, 1080, 796, 4190];
console.log('Cat6 SBI:', cat6_sbi.reduce((a,b)=>a+b,0));

const sbiTotal = [cat1_sbi, cat2_sbi, cat3_sbi, cat4_sbi, cat5_sbi, cat6_sbi].map(a => a.reduce((x,y)=>x+y,0));
const sbiSum = sbiTotal.reduce((a,b)=>a+b,0);
console.log('\n=== SBI SUMMARY ===');
sbiTotal.forEach((v,i) => console.log(`  Cat${i+1}: ${v.toLocaleString('en-IN')}`));
console.log(`  SUM: ${sbiSum.toLocaleString('en-IN')}`);
console.log(`  Official: 58,98,548`);
console.log(`  Variance: ${(sbiSum - 5898548).toLocaleString('en-IN')}`);

// ===== JIVAAKAW SRI HEALTHCARE (ICICI) =====
const cat1_icici = [110000, 390000, 440000, 60000];
const cat2_icici = [];
const cat3_icici = [300000];
const cat4_icici = [200000];
const cat5_icici = [15000, 15000];
const cat6_icici = [96, 233266, 233266, 15000];

const iciciTotal = [cat1_icici, cat2_icici, cat3_icici, cat4_icici, cat5_icici, cat6_icici].map(a => a.reduce((x,y)=>x+y,0));
const iciciSum = iciciTotal.reduce((a,b)=>a+b,0);
console.log('\n=== ICICI SUMMARY ===');
iciciTotal.forEach((v,i) => console.log(`  Cat${i+1}: ${v.toLocaleString('en-IN')}`));
console.log(`  SUM: ${iciciSum.toLocaleString('en-IN')}`);
console.log(`  Official: 20,11,628`);
console.log(`  Variance: ${(iciciSum - 2011628).toLocaleString('en-IN')}`);
