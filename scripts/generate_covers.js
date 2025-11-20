const fs=require('fs');
const path=require('path');
const {spawnSync}=require('child_process');

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

function isLocalPdf(link){
  return link && !/^https?:\/\//.test(link) && link.toLowerCase().endsWith('.pdf');
}

function outPath(link){
  const p=link.replace(/\.pdf$/i,'').replace(/^\.+\//,'');
  return path.join('images',p+'.png');
}

(function main(){
  const csvPath=path.join(process.cwd(),'catalog.csv');
  const text=fs.readFileSync(csvPath,'utf8');
  const rows=parseCsv(text);
  for(const row of rows){
    const link=row.Link;
    if(!isLocalPdf(link)) continue;
    const pdfPath=path.join(process.cwd(),link);
    if(!fs.existsSync(pdfPath)) continue;
    const out=outPath(link);
    const dir=path.dirname(out);
    fs.mkdirSync(dir,{recursive:true});
    const outNoExt=out.replace(/\.png$/i,'');
    const res=spawnSync('pdftoppng',['-f','1','-singlefile','-png',pdfPath,outNoExt],{stdio:'inherit'});
    if(res.status!==0){
      console.error('Failed cover for',pdfPath);
    }
  }
})();