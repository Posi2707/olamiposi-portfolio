'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore, useState, useRef, useEffect } from 'react';
import { Menu, X, Sun, Moon, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { navigation } from '@/data/profile';

const subscribe = (callback: () => void) => { window.addEventListener('storage',callback); return () => window.removeEventListener('storage',callback); };
const memoryPreferences = new Map<string,string>();
function usePreference(key:string, fallback:string) {
  const value = useSyncExternalStore(subscribe, () => {try{return localStorage.getItem(key) || memoryPreferences.get(key) || fallback;}catch{return memoryPreferences.get(key) || fallback;}}, () => fallback);
  const set = (next:string) => {memoryPreferences.set(key,next);try{localStorage.setItem(key,next);}catch{} window.dispatchEvent(new Event('storage'));};
  return [value,set] as const;
}
export function Header() {
  const pathname = usePathname();
  const [open,setOpen] = useState(false);
  const [theme,setTheme] = usePreference('ob-theme','dark');
  const [sound,setSound] = usePreference('ob-sound','off');
  const audio = useRef<AudioContext | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(()=>{if(open) nav.current?.querySelector<HTMLAnchorElement>('a')?.focus();},[open]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;},[theme]);
  function tick(enabled = sound === 'on') {
    if(!enabled) return;
    try {
      const context = audio.current ?? new AudioContext(); audio.current = context;
      void context.resume().catch(()=>{});
      const oscillator=context.createOscillator(), gain=context.createGain();
      oscillator.type='sine'; oscillator.frequency.setValueAtTime(640,context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(320,context.currentTime+.06);
      gain.gain.setValueAtTime(.018,context.currentTime); gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.065);
      oscillator.connect(gain);gain.connect(context.destination);oscillator.start();oscillator.stop(context.currentTime+.07);
    }catch{}
  }
  const toggleTheme=()=>{const next=theme==='dark'?'light':'dark';setTheme(next);document.documentElement.dataset.theme=next; tick();};
  return <header className="site-header" onKeyDown={e=>{if(e.key==='Escape'&&open){setOpen(false);menuButton.current?.focus();}}}><div className="container nav-inner">
    <Link href="/" className="brand" aria-label="Olamiposi Badiya home">OB<span>.</span></Link>
    <div className="brand-name">Olamiposi Badiya<span>Software engineer</span></div>
    <nav ref={nav} id="main-navigation" className={open?'navigation is-open':'navigation'} aria-label="Main navigation">{navigation.map(([label,href])=><Link key={href} href={href} aria-current={pathname===href?'page':undefined} onClick={()=>{setOpen(false);tick();}}>{label}</Link>)}</nav>
    <div className="nav-tools"><Link href="/contact" className="nav-contact">Let’s talk <ArrowUpRight size={14}/></Link><span className="tool-divider"/><button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme==='dark'?'light':'dark'} theme`}>{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button><button className="icon-button sound-button" aria-label={sound==='on'?'Mute interface sound':'Enable interface sound'} aria-pressed={sound==='on'} onClick={()=>{const next=sound==='off'?'on':'off';setSound(next);tick(next==='on');}}>{sound==='on'?<Volume2 size={17}/>:<VolumeX size={17}/>}</button><button ref={menuButton} aria-controls="main-navigation" className="icon-button mobile-menu" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
  </div></header>;
}
