import { ImageResponse } from 'next/og';
export const dynamic='force-static';
export const alt='Olamiposi Badiya — Software Engineer & Full-Stack Developer';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function OpenGraphImage(){return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',height:'100%',background:'#0b101b',padding:'64px',color:'#f5f8ff',border:'2px solid #27364b'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:42,fontWeight:700}}>OB.</span><span style={{fontSize:20,color:'#8cb9ff'}}>OLAMIPOSI BADIYA</span></div><div style={{display:'flex',flexDirection:'column'}}><span style={{fontSize:67,fontWeight:700,letterSpacing:'-3px'}}>Software Engineer &</span><span style={{fontSize:67,fontWeight:700,color:'#60a5fa',letterSpacing:'-3px'}}>Full-Stack Developer</span></div><div style={{display:'flex',fontSize:23,color:'#a9b8cc'}}>Full-stack engineering · AI evaluation · Applied machine learning</div></div>,size)}
