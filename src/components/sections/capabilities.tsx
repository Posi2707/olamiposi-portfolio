import { Code2, Database, BrainCircuit, ChartNoAxesCombined, Workflow, ShieldCheck } from 'lucide-react';
import { skills } from '@/data/skills';
import { Reveal } from '@/components/ui/reveal';
const icons=[Code2,Database,BrainCircuit,ChartNoAxesCombined,Workflow,ShieldCheck];
export function Capabilities(){return <div className="capability-grid">{skills.map((s,i)=>{const Icon=icons[i];return <Reveal key={s.title} className="capability" delay={i%3*.05}><div className="capability-top"><Icon size={23}/><span>0{i+1}</span></div><h3>{s.title}</h3><p>{s.text}</p><div className="skill-tags">{s.tags.map(t=><span key={t}>{t}</span>)}</div><small>{s.scope}</small></Reveal>})}</div>}
