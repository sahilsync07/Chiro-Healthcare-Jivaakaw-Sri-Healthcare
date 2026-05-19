const pdfParse = require('pdf-parse');
const fs = require('fs');

async function run() {
  const fileBuffer = fs.readFileSync('Highlighted Chiro Healthcare Statement.pdf');
  const parser = new pdfParse.PDFParse({ data: fileBuffer });
  const doc = await parser.load();
  
  let globalIndex = 0;
  const sbiTxns = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const text = await parser.getPageText(page, {});
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let currentTxn = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Match starting date format
      const dateMatch = line.match(/^(\d{2}-\d{2}-\d{4})\s+(\d{2}-\d{2}-\d{4})/);
      
      if (dateMatch) {
        // If there was a previous transaction, push it
        if (currentTxn) {
          sbiTxns.push(currentTxn);
        }
        
        globalIndex++;
        currentTxn = {
          pageNum,
          rowNum: globalIndex,
          postDate: dateMatch[1],
          valDate: dateMatch[2],
          lines: [line],
        };
      } else {
        // If it's not a new transaction line, check if it's a page footer or page header we should ignore
        if (line.startsWith('Page no.') || line.startsWith('Post Date Value Date') || line.startsWith('No/Reference Debit Credit Balance') || line.startsWith('BROUGHT FORWARD') || line.startsWith('Account No') || line.startsWith('STATEMENT OF ACCOUNT')) {
          continue;
        }
        // If we are currently parsing a transaction, append the line
        if (currentTxn) {
          currentTxn.lines.push(line);
        }
      }
    }
    
    // Push the last transaction of the page
    if (currentTxn) {
      sbiTxns.push(currentTxn);
    }
  }
  
  // Reconstruct description, debit, credit, balance for each transaction
  for (let txn of sbiTxns) {
    const fullText = txn.lines.join(' ');
    txn.fullText = fullText;
    
    // Let's parse amounts at the end of the text
    // The transaction text usually ends with something like: "amount balanceCR"
    // e.g. "1,50,000.00 1,50,000.00CR"
    // Let's see: the last word is always the balance (e.g. "1,50,000.00CR")
    // The second to last word is the debit or credit amount.
    // Let's split by spaces and analyze the end words.
    const words = fullText.split(/\s+/);
    const len = words.length;
    
    let balanceStr = '';
    let amountStr = '';
    
    if (len >= 3) {
      const lastWord = words[len - 1];
      const secondLastWord = words[len - 2];
      
      if (lastWord.endsWith('CR')) {
        balanceStr = lastWord;
        amountStr = secondLastWord;
      }
    }
    
    txn.amountStr = amountStr;
    txn.balanceStr = balanceStr;
  }
  
  console.log(`Parsed ${sbiTxns.length} transactions from SBI.`);
  fs.writeFileSync('sbi_parsed_txns.json', JSON.stringify(sbiTxns, null, 2));
}

run().catch(console.error);
