const fs=require('fs');
const path=require('path');

function parseCsv(text){
  const lines=text.split(/\r?\n/).filter(l=>l.trim().length>0);
  const header=lines[0].split(',');
  const rows=[];
  for(let i=1;i<lines.length;i++){
    const cols=lines[i].split(',');
    const obj={};
    header.forEach((h,idx)=>obj[h]=cols[idx]||'');
    rows.push(obj);
  }
  return rows;
}

(function main(){
  const p=path.join(process.cwd(),'docs','catalog.csv');
  const text=fs.readFileSync(p,'utf8');
  const rows=parseCsv(text);
  const enriched=rows.map(r=>({
    title:r.Title,
    section:r.Section,
    link:r.Link,
    image:r.Image,
    updated:r.Updated||null,
    authors:null,
    year:null,
    tags:[]
  }));
  const out=path.join(process.cwd(),'docs','catalog.json');
  fs.writeFileSync(out,JSON.stringify(enriched,null,2));
  console.log('docs/catalog.json generated');
})();