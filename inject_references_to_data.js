const fs = require('fs');

// Load SBI matched results
const sbiMatched = require('./sbi_matched_results.json');

// Define ICICI mappings based on browser subagent findings
const iciciMappings = {
  // Category 1
  "30-09-2023_110000": { pageNum: 2, rowNum: 1 },
  "03-10-2023_390000": { pageNum: 3, rowNum: 1 },
  "09-11-2023_440000": { pageNum: 3, rowNum: 14 },
  "16-11-2023_60000":  { pageNum: 3, rowNum: 15 },
  
  // Category 3
  "21-03-2024_300000": { pageNum: 4, rowNum: 9 },
  
  // Category 4
  "05-06-2024_200000": { pageNum: 5, rowNum: 10 },
  
  // Category 5
  "21-09-2024_15000":  { pageNum: 6, rowNum: 7 },
  "16-11-2024_15000":  { pageNum: 7, rowNum: 4 },
  
  // Category 6
  "30-12-2023_96":      { pageNum: 3, rowNum: 23 },
  "21-03-2024_233266_408194912718": { pageNum: 4, rowNum: 11 },
  "21-03-2024_233266_408194940104": { pageNum: 4, rowNum: 13 },
  "29-11-2024_15000":  { pageNum: 7, rowNum: 7 },
};

// Reconstruct frontend/src/data.js into a plain JavaScript object
const dataJs = fs.readFileSync('frontend/src/data.js', 'utf8');
eval(dataJs.replace(/export const /g, 'global.'));

const txns = global.txns;
const categories = global.categories;
const officialTotals = global.officialTotals;

// Process each category
for (const catId of Object.keys(txns)) {
  const catData = txns[catId];
  
  // 1. Process SBI
  if (catData.sbi) {
    catData.sbi = catData.sbi.map(item => {
      const [date, desc, ref, mode, amount] = item;
      // Find matching entry in sbiMatched[catId]
      const matches = sbiMatched[catId] || [];
      const match = matches.find(m => {
        const mTxn = m.txn;
        return mTxn[0] === date && mTxn[1] === desc && mTxn[2] === ref && mTxn[3] === mode && mTxn[4] === amount;
      });
      
      if (match) {
        return [date, desc, ref, mode, amount, `SBI Page ${match.pageNum}, Row ${match.rowNum}`];
      } else {
        console.warn(`Could not find SBI match for:`, item);
        return [date, desc, ref, mode, amount, 'SBI Reference Pending'];
      }
    });
  }
  
  // 2. Process ICICI
  if (catData.icici) {
    catData.icici = catData.icici.map(item => {
      const [date, desc, ref, mode, amount] = item;
      
      // Build unique key
      let key = `${date}_${amount}`;
      if (date === '21-03-2024' && amount === 233266) {
        key = `${date}_${amount}_${ref}`;
      }
      
      const mapping = iciciMappings[key];
      if (mapping) {
        return [date, desc, ref, mode, amount, `ICICI Page ${mapping.pageNum}, Row ${mapping.rowNum}`];
      } else {
        console.warn(`Could not find ICICI match for:`, item);
        return [date, desc, ref, mode, amount, 'ICICI Reference Pending'];
      }
    });
  }
}

// Generate the updated data.js content
let newContent = '';
newContent += `export const categories = ${JSON.stringify(categories, null, 2)};\n\n`;

// Format txns nicely
newContent += `export const txns = {\n`;
for (const [catId, val] of Object.entries(txns)) {
  newContent += `  ${catId}: {\n`;
  
  newContent += `    sbi: [\n`;
  for (const item of val.sbi) {
    newContent += `      ${JSON.stringify(item)},\n`;
  }
  newContent += `    ],\n`;
  
  newContent += `    icici: [\n`;
  for (const item of val.icici) {
    newContent += `      ${JSON.stringify(item)},\n`;
  }
  newContent += `    ],\n`;
  
  newContent += `  },\n`;
}
newContent += `};\n\n`;

newContent += `export const officialTotals = ${JSON.stringify(officialTotals, null, 2)};\n`;

fs.writeFileSync('frontend/src/data.js', newContent);
console.log('Successfully injected statement references into data.js!');
