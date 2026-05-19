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
    const lines = text.split('\n');
    
    for (let line of lines) {
      line = line.trim();
      // Regex to match a line that starts with two dates, e.g. 11-01-2024   11-01-2024
      const match = line.match(/^(\d{2}-\d{2}-\d{4})\s+(\d{2}-\d{2}-\d{4})\s+(.*)$/);
      if (match) {
        globalIndex++;
        const postDate = match[1];
        const valDate = match[2];
        const rest = match[3].trim();
        
        // Let's parse the rest to find amount and type (credit/debit)
        // Usually, the line ends with something like: "1,50,000.00   1,50,000.00CR" or "66,080.00   83,920.00CR"
        // Let's print some matched lines to see their exact format.
        sbiTxns.push({
          pageNum,
          rowNum: globalIndex,
          line: line
        });
      }
    }
  }
  
  console.log(`Extracted ${sbiTxns.length} transactions from SBI PDF.`);
  fs.writeFileSync('sbi_extracted_rows.json', JSON.stringify(sbiTxns, null, 2));
}

run().catch(console.error);
