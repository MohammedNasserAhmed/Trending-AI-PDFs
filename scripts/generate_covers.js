const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0].split(',');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const obj = {};
    header.forEach((h, idx) => (obj[h] = cols[idx] || ''));
    rows.push(obj);
  }
  return rows;
}

function isLocalPdf(link) {
  return link && !/^https?:\/\//.test(link) && link.toLowerCase().endsWith('.pdf');
}

function outPath(link) {
  const p = link.replace(/\.pdf$/i, '').replace(/^\.+\//, '');
  return path.join('images', p + '.png');
}


(async function main() {
  const jsonPath = path.join(process.cwd(), 'docs', 'catalog.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.warn('catalog.json missing, skipping cover generation');
    return;
  }

  const text = fs.readFileSync(jsonPath, 'utf8');
  let items = [];
  try {
    items = JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse catalog.json', e);
    return;
  }

  for (const item of items) {
    const link = item.link;
    if (!isLocalPdf(link)) continue;
    
    // Handle link starting with / or ./
    const normalizedLink = link.replace(/^\.?\//, '');
    const pdfPath = path.join(process.cwd(), normalizedLink);
    
    if (!fs.existsSync(pdfPath)) continue;
    
    const out = outPath(normalizedLink);
    const dir = path.dirname(out);
    fs.mkdirSync(dir, { recursive: true });
    
    // Check if cover already exists (optional optimization, but good for CI speed)
    if (fs.existsSync(out)) continue;

    const outNoExt = out.replace(/\.png$/i, '');
    console.log(`Generating cover for ${normalizedLink}...`);
    
    const res = spawnSync('pdftoppng', ['-f', '1', '-singlefile', '-png', pdfPath, outNoExt], {
      stdio: 'inherit'
    });
    
    if (res.status !== 0) {
      console.error('Failed cover for', pdfPath);
    }
  }
})();
