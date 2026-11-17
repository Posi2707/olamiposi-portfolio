import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const root=process.cwd(),output=path.join(root,'out'),qa=path.join(root,'.qa');
await mkdir(qa,{recursive:true});
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.xml':'application/xml'};
const server=createServer(async(req,res)=>{try{let file=path.resolve(output,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==output&&!file.startsWith(output+path.sep))throw new Error('Invalid path');if(!path.extname(file))file=path.join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
const browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9224',`--user-data-dir=${path.join(qa,'browser-profile')}`,'about:blank'],{stdio:'ignore',windowsHide:true});
let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{
 let targets;
 for(let i=0;i<60;i++){try{targets=await fetch('http://127.0.0.1:9224/json').then(r=>r.json());if(targets.some(t=>t.type==='page'))break;}catch{}await sleep(250);}
 assert(targets,'Browser debugging endpoint did not start');
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let id=0;const pending=new Map(),errors=[];
 ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);if(m.error){p.reject(m.error);}else{p.resolve(m.result);}}}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await send('Page.enable');await send('Runtime.enable');
 const visit=async route=>{await send('Page.navigate',{url:`http://127.0.0.1:4173${route}`});for(let i=0;i<40;i++){await sleep(100);if(await evaluate(`document.readyState==='complete' && !!document.querySelector('h1')`))break;}await sleep(700);};
 const report=[];
 for(const width of [320,375,768,1024,1440]){
   await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<700});
   await visit('/');
   const state=await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.textContent,links:[...document.querySelectorAll('a')].filter(a=>!a.getAttribute('href')).length})`);
   if(state.scroll>width+1) console.log(await evaluate(`JSON.stringify([...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>${width}).map(e=>({tag:e.tagName,cls:typeof e.className==='string'?e.className:'',right:e.getBoundingClientRect().right})))`)); assert(state.scroll<=width+1,`Horizontal overflow at ${width}: ${state.scroll}`);assert.equal(state.links,0);report.push({viewport:width,...state});
   if(width===1440||width===375){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(qa,`home-${width}.png`),Buffer.from(shot.data,'base64'));}
 }
 await send('Emulation.setDeviceMetricsOverride',{width:375,height:900,deviceScaleFactor:1,mobile:true});
 await evaluate(`document.querySelector('[aria-label="Open menu"]').click()`);await sleep(100);assert(await evaluate(`document.querySelector('nav').classList.contains('is-open')`));
 await evaluate(`document.querySelector('[aria-label="Close menu"]').click()`);
 for(const route of ['/projects/','/projects/fezyslimes/','/projects/hostel-management/','/projects/customer-churn/','/projects/taskpilot/','/projects/interior-landing/','/about/','/experience/','/ai-ml/','/contact/']){
   await visit(route);const state=await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.textContent})`);assert(state.h1,`Missing heading: ${route}`);assert(state.scroll<=state.width+1,`Horizontal overflow on ${route}: ${state.scroll}`);report.push({route,...state});
 }
 assert.equal(await evaluate(`document.querySelector('form').checkValidity()`),false);
 await evaluate(`document.querySelector('[name=name]').value='Test visitor';document.querySelector('[name=email]').value='visitor@example.com';document.querySelector('[name=message]').value='Hello, this is a verification of form validation.'`);
 assert.equal(await evaluate(`document.querySelector('form').checkValidity()`),true);
 await visit('/projects/');await evaluate(`[...document.querySelectorAll('.filter-bar button')].find(b=>b.textContent==='AI & ML').click()`);await sleep(150);assert.equal(await evaluate(`document.querySelectorAll('.project-card').length`),2);
 await visit('/ai-ml/');await evaluate(`[...document.querySelectorAll('.workflow-step')][4].click()`);await sleep(150);assert.equal(await evaluate(`document.querySelector('.workflow-detail h3').textContent`),'Build observable workflows.');
 await evaluate(`document.querySelector('[aria-label="Switch to light theme"]').click()`);await sleep(100);assert.equal(await evaluate(`document.documentElement.dataset.theme`),'light');
 await visit('/');assert.equal(await evaluate(`document.documentElement.dataset.theme`),'light');
 await evaluate(`document.querySelector('[aria-label="Switch to dark theme"]').click()`);
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await evaluate(`getComputedStyle(document.querySelector('.network-lines')).animationName`),'none');
 assert.equal(errors.length,0,`Browser runtime errors: ${errors.join(', ')}`);
 await writeFile(path.join(qa,'report.json'),JSON.stringify({report,checks:['home overflow at five widths','all content routes at 375px','mobile menu','project filter','workflow selection','required form fields','theme persistence','reduced motion','no runtime exceptions'],errors},null,2));
 console.log('Browser checks passed. Screenshots and report: .qa/');
 await send('Browser.close');
}finally{ws?.close();browser.kill();await new Promise(resolve=>server.close(resolve));}
