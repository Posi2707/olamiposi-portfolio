import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { ProjectArt } from './project-art';
export function ProjectCard({project,featured=false}:{project:Project;featured?:boolean}){return <Link href={`/projects/${project.slug}`} className={`project-card ${featured?'featured-project':''}`}><ProjectArt slug={project.slug}/><div className="project-info"><div className="project-meta"><span>{project.category}</span><span>{project.year||'Portfolio project'}</span></div><div className="project-title"><h3>{project.title}</h3><span className="project-arrow"><ArrowUpRight size={19}/></span></div><p>{project.summary}</p><div className="tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></Link>}
