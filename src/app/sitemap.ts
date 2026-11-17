import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { navigation } from '@/data/profile';
import { siteUrl } from '@/lib/site';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return [...navigation.map(([,path])=>({url:`${siteUrl}${path}/`.replace(/\/\/$/,'/'),priority:path==='/'?1:.8})),...projects.map(p=>({url:`${siteUrl}/projects/${p.slug}/`,priority:.7}))]}
