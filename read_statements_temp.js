const pdfParse = require('pdf-parse');
const fs = require('fs');

async function run() {
  const fileBuffer = fs.readFileSync('Jivaakaw Sri Healthcare ICICI Bank Account Details.pdf');
  const parser = new pdfParse.PDFParse({ data: fileBuffer });
  const doc = await parser.load();
  console.log('Loaded doc. Num pages:', doc.numPages);
  
  try {
    const tableData = await parser.getTable({});
    console.log('Table extraction pages:', tableData.pages.length);
    for (let page of tableData.pages) {
      console.log(`Page ${page.num} has ${page.tables.length} tables.`);
    }
  } catch (e) {
    console.error('Table extraction failed:', e);
  }
}

run().catch(console.error);
