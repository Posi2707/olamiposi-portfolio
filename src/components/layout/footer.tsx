import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/data/profile';
export function Footer(){return <footer className="container footer"><div><Link href="/" className="brand">OB<span>.</span></Link><p>Thoughtfully built. Always improving.</p></div><span className="footer-note">© {new Date().getFullYear()} Olamiposi Badiya</span><div className="footer-links"><a href={profile.github} aria-label="GitHub"><Github size={18}/></a><a href={profile.linkedin} aria-label="LinkedIn"><Linkedin size={18}/></a><a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={18}/></a><a href="#top" aria-label="Back to top"><ArrowUpRight size={18}/></a></div></footer>}
