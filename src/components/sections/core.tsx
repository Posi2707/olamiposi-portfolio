'use client';
import { useRef } from 'react';
import { Code2, BrainCircuit, Layers3, ScanLine } from 'lucide-react';

const points=Array.from({length:84},(_,i)=>{
 const y=1-(i/83)*2;const radius=Math.sqrt(1-y*y),theta=i*2.399963;
 return {x:Math.cos(theta)*radius,y,z:Math.sin(theta)*radius};
});
const edges=points.flatMap((p,i)=>points.slice(i+1).map((q,j)=>({p,q,j:j+i+1})).filter(({q})=>Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z)<.49).map(({q,j})=>({p,q,key:`${i}-${j}`})));
export function ComputationalCore(){
 const ref=useRef<HTMLDivElement>(null);
 return <div ref={ref} className="core-scene" aria-label="Decorative computational network with code and connected nodes" onPointerMove={e=>{if(e.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();ref.current?.style.setProperty('--px',`${(e.clientX-r.left-r.width/2)/45}px`);ref.current?.style.setProperty('--py',`${(e.clientY-r.top-r.height/2)/45}px`);}} onPointerLeave={()=>{ref.current?.style.setProperty('--px','0px');ref.current?.style.setProperty('--py','0px');}}>
 <div className="core-grid"/><div className="core-top-label"><span className="live-dot"/> ENGINEERING × INTELLIGENCE <span>01 / OB</span></div>
 <div className="core-orbit orbit-one"/><div className="core-orbit orbit-two"/>
 <svg className="network" viewBox="0 0 500 470" role="img" aria-label="Luminous geometric sphere"><defs><radialGradient id="halo"><stop stopColor="#1677ff" stopOpacity=".27"/><stop offset="1" stopColor="#1677ff" stopOpacity="0"/></radialGradient><filter id="nodeglow"><feGaussianBlur stdDeviation="3"/></filter></defs><circle cx="250" cy="217" r="190" fill="url(#halo)"/><g className="network-lines">{edges.map(({p,q,key})=><line key={key} x1={250+p.x*145} y1={217+p.y*145} x2={250+q.x*145} y2={217+q.y*145} stroke={p.z>0?'#398dff':'#16457e'} strokeWidth={p.z>0?'.8':'.45'} opacity={p.z>0?'.72':'.35'}/>)}</g><g>{points.map((p,i)=><g key={i}><circle cx={250+p.x*145} cy={217+p.y*145} r={p.z>0?4:1.5} fill="#239bff" filter="url(#nodeglow)"/><circle cx={250+p.x*145} cy={217+p.y*145} r={p.z>0?1.9:1} fill={p.z>.5?'#b4edff':'#358bff'}/></g>)}</g><ellipse cx="250" cy="402" rx="164" ry="24" fill="none" stroke="#2460af" strokeWidth=".6"/><ellipse cx="250" cy="402" rx="115" ry="14" fill="none" stroke="#368cff" strokeWidth="1.2"/><path d="M250 362V401" stroke="#3296ff" strokeDasharray="3 6" opacity=".6"/></svg>
 <div className="floating-label label-one"><Code2 size={17}/><span>Full-stack development</span></div><div className="floating-label label-two"><BrainCircuit size={17}/><span>AI evaluation & QA</span></div><div className="floating-label label-three"><Layers3 size={17}/><span>Automation & agents</span></div>
 <div className="code-window"><div className="code-bar"><i/><i/><i/><span>build_something_useful.ts</span><ScanLine size={12}/></div><code><span className="code-purple">const</span> approach = {'{'}<br/>&nbsp; purpose: <span className="code-green">&apos;solve real problems&apos;</span>,<br/>&nbsp; craft: <span className="code-green">&apos;build with care&apos;</span>,<br/>&nbsp; quality: <span className="code-blue">always</span><br/>{'}'};</code><div className="code-status"><span className="live-dot"/> Ideas → working software <span>TypeScript</span></div></div>
 <div className="core-bottom-label">SYSTEM.CORE <span>DESIGNED TO CONNECT THE DOTS</span></div></div>;
}
