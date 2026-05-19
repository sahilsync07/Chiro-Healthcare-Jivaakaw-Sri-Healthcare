const fs = require('fs');
const sbiTxns = require('./sbi_parsed_txns.json');

// Reconstruct frontend/src/data.js into a plain JavaScript object we can require
const dataJs = fs.readFileSync('frontend/src/data.js', 'utf8');

// A simple evaluator to get the txns and categories arrays
eval(dataJs.replace(/export const /g, 'global.'));

console.log('Categories:', global.categories.map(c => c.name));

const txns = global.txns;
const matchedSBI = {};

// Helper to normalize amount (remove commas, parse float/int)
function parseAmount(amt) {
  if (typeof amt === 'number') return amt;
  return parseFloat(amt.replace(/,/g, ''));
}

let totalSbiMatched = 0;
let totalSbiTxns = 0;

for (const catId of Object.keys(txns)) {
  matchedSBI[catId] = [];
  const list = txns[catId].sbi || [];
  totalSbiTxns += list.length;
  
  for (const item of list) {
    const [date, desc, ref, mode, amount] = item;
    
    // Find candidate in sbiTxns
    // Candidates must match:
    // 1. Date (postDate or valDate) OR Ref match
    // 2. Amount (amountStr)
    const candidates = sbiTxns.filter(t => {
      const matchAmt = parseAmount(t.amountStr) === amount;
      if (!matchAmt) return false;
      
      const matchDate = (t.postDate === date || t.valDate === date);
      if (matchDate) return true;
      
      // If date doesn't match, check if ref is a unique match
      if (ref && ref !== 'N/A' && ref.length > 5) {
        if (t.fullText.includes(ref)) {
          return true;
        }
      }
      return false;
    });
    
    if (candidates.length === 1) {
      const cand = candidates[0];
      matchedSBI[catId].push({
        txn: item,
        pageNum: cand.pageNum,
        rowNum: cand.rowNum,
        matchedLine: cand.fullText
      });
      totalSbiMatched++;
    } else if (candidates.length > 1) {
      // Multiple matches (e.g. identical amount on same day)
      // Let's try matching with UTR/Ref or description keywords
      let bestMatch = null;
      let maxScore = -1;
      
      for (const cand of candidates) {
        let score = 0;
        // Check if ref is in fullText
        if (ref && ref !== 'N/A' && ref.length > 3) {
          if (cand.fullText.includes(ref)) {
            score += 10;
          }
        }
        // Check if description keywords are in fullText
        const keywords = desc.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        for (const kw of keywords) {
          if (cand.fullText.toLowerCase().includes(kw)) {
            score += 1;
          }
        }
        
        if (score > maxScore) {
          maxScore = score;
          bestMatch = cand;
        }
      }
      
      if (bestMatch && maxScore >= 0) {
        matchedSBI[catId].push({
          txn: item,
          pageNum: bestMatch.pageNum,
          rowNum: bestMatch.rowNum,
          matchedLine: bestMatch.fullText
        });
        totalSbiMatched++;
      } else {
        console.log(`Ambiguous match for SBI ${catId} txn:`, item, `found ${candidates.length} candidates.`);
      }
    } else {
      console.log(`No match for SBI ${catId} txn:`, item);
    }
  }
}

console.log(`Total SBI transactions matched: ${totalSbiMatched} / ${totalSbiTxns}`);

fs.writeFileSync('sbi_matched_results.json', JSON.stringify(matchedSBI, null, 2));
