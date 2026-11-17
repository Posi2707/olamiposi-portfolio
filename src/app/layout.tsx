import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { siteUrl } from '@/lib/site';
import './globals.css';
const sans=Geist({subsets:['latin'],variable:'--font-geist'});
const mono=Geist_Mono({subsets:['latin'],variable:'--font-mono'});
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Olamiposi Badiya — Software Engineer & Full-Stack Developer',template:'%s | Olamiposi Badiya'},description:'Full-stack engineering with a thoughtful approach to AI evaluation, automation and applied machine learning. Explore projects by Olamiposi Badiya.',openGraph:{type:'website',locale:'en_NG',siteName:'Olamiposi Badiya',title:'Olamiposi Badiya — Software Engineer',description:'Useful software. Thoughtful engineering. Explore full-stack projects, AI tooling and analytical work.'},twitter:{card:'summary_large_image'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`try{document.documentElement.dataset.theme=localStorage.getItem('ob-theme')||'dark'}catch(e){}`}}/><noscript><style>{`main [style*="opacity"]{opacity:1!important;transform:none!important}`}</style></noscript><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Person',name:'Olamiposi Badiya',url:siteUrl,sameAs:['https://github.com/Posi2707','https://www.linkedin.com/in/olamiposi-badiya-9a573b379/']})}}/></head><body id="top" className={`${sans.variable} ${mono.variable}`}><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>}
