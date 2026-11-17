import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export function ContactCTA(){return <section className="container"><div className="contact-cta"><div><span className="eyebrow"><span className="live-dot"/> OPEN TO OPPORTUNITIES</span><h2>Have something in mind?<br/><span>Let’s build it well.</span></h2><p>Open to remote software development and AI-related opportunities.</p></div><Link className="button primary" href="/contact">Start a conversation <ArrowUpRight size={18}/></Link></div></section>}
