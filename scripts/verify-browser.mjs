import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const root=process.cwd(),output=path.join(root,'out'),qa=path.join(root,'.qa');
await mkdir(qa,{recursive:true});
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.xml':'application/xml'};
const server=createServer(async(req,res)=>{try{let file=path.resolve(output,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==output&&!file.startsWith(output+path.sep))throw new Error('Invalid path');if((await stat(file)).isDirectory())file=path.join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
const browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9224',`--user-data-dir=${path.join(qa,'browser-profile')}`,'about:blank'],{stdio:'ignore',windowsHide:true});
let ws;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{
 let targets;
 for(let i=0;i<30;i++){try{targets=await fetch('http://127.0.0.1:9224/json',{signal:AbortSignal.timeout(1000)}).then(r=>r.json());if(targets.some(t=>t.type==='page'))break;}catch{}await sleep(250);}
 assert(targets,'Browser debugging endpoint did not start');
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let id=0;const pending=new Map(),errors=[];
 ws.onmessage=({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);if(m.error){p.reject(m.error);}else{p.resolve(m.result);}}}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await send('Page.enable');await send('Runtime.enable');
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__audioStarts=0;const OriginalAudioContext=window.AudioContext;if(OriginalAudioContext){window.AudioContext=class extends OriginalAudioContext{constructor(...args){super(...args);window.__audioStarts++;}}}`});
 const visit=async route=>{await send('Page.navigate',{url:`http://127.0.0.1:4173${route}`});for(let i=0;i<40;i++){await sleep(100);if(await evaluate(`document.readyState==='complete' && !!document.querySelector('h1')`))break;}await sleep(700);};
 if(!process.argv.includes('--capture-only')){
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
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
 assert.equal(await evaluate(`document.querySelector('.mobile-menu').getAttribute('aria-expanded')`),'false');
 assert(await evaluate(`document.activeElement===document.querySelector('.mobile-menu')`));
 const routes=['/projects/','/projects/fezyslimes/','/projects/hostel-management/','/projects/customer-churn/','/projects/taskpilot/','/projects/interior-landing/','/about/','/experience/','/ai-ml/','/contact/'];
 const externalLinks=new Set();
 for(const width of [320,375,768,1024,1440]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
  for(const route of routes){
   await visit(route);const state=await evaluate(`({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.textContent,title:document.title,canonical:document.querySelector('link[rel=canonical]')?.href,og:document.querySelector('meta[property="og:image"]')?.content,missingImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length})`);assert(state.h1,`Missing heading: ${route}`);assert(state.scroll<=width+1,`Horizontal overflow on ${route} at ${width}: ${state.scroll}`);assert(state.canonical?.endsWith(route),`Invalid canonical on ${route}`);assert(state.og,`Missing OG image on ${route}`);assert.equal(state.missingImages,0);report.push({route,viewport:width,...state});
   if(width===375){
    const links=await evaluate(`[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))`);
    for(const link of links){if(link.startsWith('https://'))externalLinks.add(link);if(link.startsWith('/')){const response=await fetch(`http://127.0.0.1:4173${link}`,{signal:AbortSignal.timeout(5000)});assert.equal(response.status,200,`Broken internal link ${link}`);}}
   }
  }
 }
 assert.equal(await evaluate(`document.querySelector('form').checkValidity()`),false);
 await evaluate(`document.querySelector('[name=name]').value='Test visitor';document.querySelector('[name=email]').value='visitor@example.com';document.querySelector('[name=message]').value='Hello, this is a verification of form validation.'`);
 assert.equal(await evaluate(`document.querySelector('form').checkValidity()`),true);
 await evaluate(`document.querySelector('[name=message]').value='            ';document.querySelector('form').requestSubmit()`);await sleep(100);
 assert((await evaluate(`document.querySelector('.form-status').textContent`)).includes('10–3,000'));
 await visit('/projects/');await evaluate(`[...document.querySelectorAll('.filter-bar button')].find(b=>b.textContent==='AI & ML').click()`);await sleep(150);assert.equal(await evaluate(`document.querySelectorAll('.project-card').length`),2);
 await visit('/ai-ml/');await evaluate(`[...document.querySelectorAll('.workflow-step')][4].click()`);await sleep(150);assert.equal(await evaluate(`document.querySelector('.workflow-detail h3').textContent`),'Build observable workflows.');
 await evaluate(`document.querySelector('[aria-label="Switch to light theme"]').click()`);await sleep(100);assert.equal(await evaluate(`document.documentElement.dataset.theme`),'light');
 await visit('/');assert.equal(await evaluate(`document.documentElement.dataset.theme`),'light');
 await evaluate(`document.querySelector('[aria-label="Switch to dark theme"]').click()`);
 await evaluate(`localStorage.removeItem('ob-sound')`);await visit('/');
 assert.equal(await evaluate(`document.querySelector('.sound-button').getAttribute('aria-pressed')`),'false');
 assert.equal(await evaluate('window.__audioStarts'),0);
 await evaluate(`document.querySelector('.sound-button').click()`);await sleep(100);
 assert.equal(await evaluate(`document.querySelector('.sound-button').getAttribute('aria-label')`),'Mute interface sound');
 assert.equal(await evaluate(`localStorage.getItem('ob-sound')`),'on');assert.equal(await evaluate('window.__audioStarts'),1);
 await visit('/');assert.equal(await evaluate(`document.querySelector('.sound-button').getAttribute('aria-pressed')`),'true');assert.equal(await evaluate('window.__audioStarts'),0);
 await evaluate(`document.querySelector('.sound-button').click()`);
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 assert.equal(await evaluate(`getComputedStyle(document.querySelector('.network-lines')).animationName`),'none');
 assert.equal(errors.length,0,`Browser runtime errors: ${errors.join(', ')}`);
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await visit('/');
 await evaluate(`(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,70));}window.scrollTo(0,0)})()`);await sleep(700);
 const layout=await send('Page.getLayoutMetrics');const full=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:1440,height:layout.cssContentSize.height,scale:1}});await writeFile(path.join(qa,'home-full-1440.png'),Buffer.from(full.data,'base64'));
 await writeFile(path.join(qa,'report.json'),JSON.stringify({report,externalLinks:[...externalLinks],checks:['home and every content route at five widths','mobile menu Escape and focus return','internal links','project filter','workflow selection','form required and whitespace validation','theme persistence','sound opt-in, mute, persistence and no autoplay','canonical and OG metadata','no broken images','reduced motion','no runtime exceptions'],errors},null,2));
 console.log('Browser checks passed. Screenshots and report: .qa/');
 }
 if(process.argv.includes('--capture-fezyslimes')){
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:'https://fezyslimesshop.com'});await sleep(7000);
  await evaluate(`[...document.querySelectorAll('button')].filter(b=>b.querySelector('svg.lucide-x')&&b.getBoundingClientRect().width>0).forEach(b=>b.click())`);await sleep(1800);
  const site=await evaluate(`({url:location.href,title:document.title,text:document.body.innerText.slice(0,500)})`);
  if(site.title.includes('FezySlimes')&&site.url.includes('fezyslimesshop.com')){const screenshot=await send('Page.captureScreenshot',{format:'png'});await writeFile(path.join(qa,'fezyslimes-live.png'),Buffer.from(screenshot.data,'base64'));console.log('Captured live FezySlimes homepage:',JSON.stringify(site));}else console.log('Live screenshot not captured:',JSON.stringify(site));
 }
 await send('Browser.close');
}finally{ws?.close();browser.kill();await new Promise(resolve=>server.close(resolve));}
