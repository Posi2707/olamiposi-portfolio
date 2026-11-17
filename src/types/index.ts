export type Project = {
  slug: string; title: string; category: 'Full-stack' | 'AI & ML' | 'Frontend'; number: string;
  summary: string; tags: string[]; repo?: string; live?: string; year?: string;
  context: string; role: string; architecture: string[]; features: string[];
  decisions: string; lessons: string; evidence: {label: string; href: string}[]; limitation?: string;
};
