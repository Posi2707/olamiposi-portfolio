import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

export function Introduction() {
  return <section className="container section-space professional-intro">
    <Reveal><span className="eyebrow">A LITTLE CONTEXT / THE WAY I WORK</span><h2>Software built with care.<br/><span className="gradient-text">Progress built on curiosity.</span></h2></Reveal>
    <Reveal className="intro-body"><p>I’m Olamiposi Badiya, a Computer Science graduate from Dominion University, Ibadan. I develop web applications that connect thoughtful interfaces with practical data and application workflows. Collaborative client work on FezySlimes and my university hostel management project anchor my full-stack direction.</p><p>I also explore AI model evaluation, applied machine learning and automation. My approach is to investigate the problem, check the evidence and make the next step understandable — whether that means debugging an interface, reviewing an answer or questioning a model’s validation design.</p><p>I value diligence, accountability and attention to detail. In a team, that means communicating what I know, asking when something is unclear, documenting decisions and taking feedback seriously. My ambition is to become a highly capable software engineer contributing to useful digital products, dependable AI systems and intelligent automation.</p><div className="intro-actions"><Link className="text-link" href="/projects">View projects <ArrowUpRight size={16}/></Link><Link className="text-link" href="/about">About me <ArrowUpRight size={16}/></Link><Link className="text-link" href="/contact">Get in touch <ArrowUpRight size={16}/></Link></div></Reveal>
  </section>;
}
