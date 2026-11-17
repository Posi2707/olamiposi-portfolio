import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('out'),port=Number(process.env.PORT||3000);
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.png':'image/png','.txt':'text/plain','.xml':'application/xml'};
const server=createServer(async(req,res)=>{
 try{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(file!==root&&!file.startsWith(root+path.sep))throw new Error('Invalid path');if((await stat(file)).isDirectory())file=path.join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||(path.basename(file)==='opengraph-image'?'image/png':'application/octet-stream')});res.end(data);}
 catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});try{res.end(await readFile(path.join(root,'404.html')));}catch{res.end('Page not found. Run npm run build before starting this preview.');}}
});
server.listen(port,'127.0.0.1',()=>console.log(`Portfolio: http://127.0.0.1:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
