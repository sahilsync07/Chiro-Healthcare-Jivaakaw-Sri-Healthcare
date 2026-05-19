// Extract text from Jivaakaw Sri Healthcare ICICI Bank Statement
const fs = require('fs');

async function extractPDF(filePath) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  
  let fullText = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += `\n--- PAGE ${i} ---\n${pageText}\n`;
  }
  return fullText;
}

async function main() {
  console.log('=== Extracting Jivaakaw Sri Healthcare (ICICI) Statement ===');
  const text = await extractPDF('./Jivaakaw Sri Healthcare ICICI Bank Account Details.pdf');
  fs.writeFileSync('./jivaakaw_icici_extracted.txt', text);
  console.log('Text length:', text.length);
  console.log(text);
}

main().catch(console.error);
