const fs=require('fs');
const path=require('path');
const https=require('https');
const http=require('http');

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
  return {header,rows};
}

function checkUrl(url){
  return new Promise((resolve)=>{
    try{
      const lib=url.startsWith('https')?https:http;
      const req=lib.request(url,{method:'HEAD'},res=>{
        resolve(res.statusCode>=200 && res.statusCode<400);
      });
      req.on('error',()=>resolve(false));
      req.end();
    }catch(e){resolve(false)}
  });
}

(async function main(){
  const p=path.join(process.cwd(),'docs','catalog.csv');
  if(!fs.existsSync(p)){
    console.error('catalog.csv missing');
    process.exit(1);
  }
  const text=fs.readFileSync(p,'utf8');
  const {header,rows}=parseCsv(text);
  const required=['Title','Section','Link','Image'];
  for(const r of required){
    if(!header.includes(r)){
      console.error('Missing column',r);
      process.exit(1);
    }
  }
  const errs=[];
  for(let i=0;i<rows.length;i++){
    const row=rows[i];
    for(const k of required){
      if(!row[k]||row[k].trim()==='') errs.push(`Row ${i+2} empty ${k}`);
    }
    const link=row.Link;
    if(/^https?:\/\//.test(link)){
      const ok=await checkUrl(link);
      if(!ok) errs.push(`Row ${i+2} bad link ${link}`);
    }else{
      const lp=path.join(process.cwd(),link);
      if(!fs.existsSync(lp)) errs.push(`Row ${i+2} missing file ${link}`);
    }
    const img=row.Image;
    if(img){
      if(/^https?:\/\//.test(img)){
        const ok=await checkUrl(img);
        if(!ok) errs.push(`Row ${i+2} bad image ${img}`);
      }else{
        const ip=path.join(process.cwd(),img);
        if(!fs.existsSync(ip)) errs.push(`Row ${i+2} missing image ${img}`);
      }
    }
  }
  if(errs.length){
    errs.forEach(e=>console.error(e));
    process.exit(1);
  }
  console.log('catalog.csv validation passed');
})();