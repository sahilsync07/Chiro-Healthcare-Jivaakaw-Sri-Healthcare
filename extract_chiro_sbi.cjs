// Extract text from Highlighted Chiro Healthcare Statement (SBI)
const fs = require('fs');

async function extractPDF(filePath) {
  // Dynamic import for ESM module
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
  console.log('=== Extracting Chiro Healthcare (SBI) Statement ===');
  const sbiText = await extractPDF('./Highlighted Chiro Healthcare Statement.pdf');
  fs.writeFileSync('./chiro_sbi_extracted.txt', sbiText);
  console.log('SBI text length:', sbiText.length);
  console.log(sbiText.substring(0, 5000));
}

main().catch(console.error);
