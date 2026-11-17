'use client';
import { useState } from 'react';
import { projects } from '@/data/projects';
import { ProjectCard } from './project-card';
export function ProjectExplorer(){const [filter,setFilter]=useState('All work');return <><div className="filter-bar" aria-label="Filter projects">{['All work','Full-stack','AI & ML','Frontend'].map(label=><button key={label} aria-pressed={filter===label} onClick={()=>setFilter(label)}>{label}</button>)}</div><div className="project-index-grid">{projects.filter(p=>filter==='All work'||p.category===filter).map(p=><ProjectCard key={p.slug} project={p}/>)}</div></>}
