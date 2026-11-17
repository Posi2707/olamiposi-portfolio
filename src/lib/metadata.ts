import type { Metadata } from 'next';
export function pageMetadata(title:string,description:string,path:string):Metadata {
  return {title,description,alternates:{canonical:path},openGraph:{title:`${title} | Olamiposi Badiya`,description,url:path,type:'website',locale:'en_NG',siteName:'Olamiposi Badiya',images:[{url:'/opengraph-image',width:1200,height:630,alt:'Olamiposi Badiya — Software Engineer & Full-Stack Developer'}]},twitter:{card:'summary_large_image',title:`${title} | Olamiposi Badiya`,description,images:['/opengraph-image']}};
}
