import { pageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { Mail, Github, Linkedin, ArrowUpRight, MapPin } from 'lucide-react';
import { PageHeading } from '@/components/ui/page-heading';
import { ContactForm, CopyEmail } from '@/components/sections/contact-form';
import { profile } from '@/data/profile';
export const metadata:Metadata=pageMetadata('Contact','Contact Olamiposi Badiya about remote software development and AI-related opportunities.','/contact/');
export default function Contact(){return <section className="container inner-page"><PageHeading eyebrow="LET’S CONNECT / CONTACT" title="Good things start with a conversation." description="Have a software opportunity, a project to build, or an interesting problem? I’d like to hear about it."/><div className="contact-grid"><div className="contact-details"><div className="availability"><span className="live-dot"/> Open to suitable opportunities</div><h2>Let’s make<br/>something useful.</h2><p>I’m open to remote software development and AI-related opportunities where careful thinking and practical engineering matter.</p><a href={`mailto:${profile.email}`} className="email-link"><Mail size={20}/>{profile.email}<ArrowUpRight size={18}/></a><CopyEmail/><div className="contact-social-links"><a href={profile.github}><Github size={19}/> GitHub <ArrowUpRight size={16}/></a><a href={profile.linkedin}><Linkedin size={19}/> LinkedIn <ArrowUpRight size={16}/></a></div><p className="location-note"><MapPin size={16}/> Nigeria · Remote friendly</p></div><ContactForm/></div></section>}
