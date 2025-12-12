import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';



function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const lib = url.startsWith('https') ? https : http;
      const req = lib.request(url, { method: 'HEAD' }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.end();
    } catch {
      resolve(false);
    }
  });
}


(async function main() {
  const p = path.join(process.cwd(), 'docs', 'catalog.json');
  if (!fs.existsSync(p)) {
    console.error('catalog.json missing');
    process.exit(1);
  }
  
  let items = [];
  try {
    items = JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error('Invalid JSON');
    process.exit(1);
  }

  const errs = [];
  const warns = [];
  
  items.forEach((entry, i) => {
    if (!entry.title) errs.push(`Item ${i}: Missing title`);
    if (!entry.link) errs.push(`Item ${i}: Missing link`);
    
    const link = entry.link;
    if (link && !/^https?:\/\//.test(link)) {
       const normalizedLink = link.replace(/^\.?\//, '');
       const lp = path.join(process.cwd(), normalizedLink);
       if (!fs.existsSync(lp)) warns.push(`Item ${i} missing file ${link}`);
    }
    
    // Image check
    const img = entry.image;
    if (img && !/^https?:\/\//.test(img)) {
       const normalizedImg = img.replace(/^\.?\//, '');
       const ip = path.join(process.cwd(), normalizedImg);
       if (!fs.existsSync(ip)) warns.push(`Item ${i} missing image ${img}`);
    }
  });

  warns.forEach((w) => console.warn(w));
  if (errs.length) {
    errs.forEach((e) => console.error(e));
    process.exit(1);
  }
  console.log('catalog.json validation passed with', warns.length, 'warnings');
})();
