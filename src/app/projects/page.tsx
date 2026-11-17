import { pageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { PageHeading } from '@/components/ui/page-heading';
import { ProjectExplorer } from '@/components/projects/project-explorer';
import { ContactCTA } from '@/components/sections/contact-cta';
export const metadata:Metadata=pageMetadata('Projects','Explore full-stack client projects, university systems, AI tooling and analytical work.','/projects/');
export default function Projects(){return <><section className="container inner-page"><PageHeading eyebrow="THE WORK / PROJECTS" title="Ideas, put into practice." description="A selection of client work, university projects and independent explorations. Start with the problem, look through the code, see what I learned."/><ProjectExplorer/></section><ContactCTA/></>}
