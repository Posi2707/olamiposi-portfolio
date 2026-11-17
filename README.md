# Olamiposi Badiya — portfolio

A responsive Next.js App Router portfolio, led by FezySlimes and full-stack engineering, with AI evaluation and churn analysis as supporting work. Built with TypeScript, Tailwind CSS 4, Motion and Lucide. Static export: no backend or credentials required.

## Local development

Requires Node.js 20.9 or later. In Windows PowerShell use `npm.cmd` if execution policy blocks `npm.ps1`.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm test
npm run test:browser
```

Open http://localhost:3000. `npm run build` produces `out/`, suitable for static hosting. `npm start` serves that export at the same local URL; stop an existing dev server first, or set a different PORT. Geist fonts are downloaded at build time by next/font, then served locally. A first build needs access to Google Fonts.

## Content and behavior

- `src/data/`: typed project, profile, experience and skill content.
- `src/app/`: homepage, project index and five case studies, About, Experience, AI & ML, Contact, loading/error/404, sitemap and robots.
- `src/components/`: reusable presentation, navigation, project illustrations and interactions.
- Theme is stored in `ob-theme`; sound is off by default and opt-in is stored in `ob-sound`. Only intentional navigation/control clicks synthesize a quiet short tone. No sound autoplays.
- The email form validates in the browser and opens a mailto draft. It does not send messages or claim delivery. Copy-email reports clipboard errors honestly.
- The hero uses SVG/CSS with a static rendered fallback, pointer parallax only for a mouse, and reduced-motion rules. Motion reveals are suppressed when the browser requests reduced motion.
- No fabricated screenshot, ROC plot, customer count, performance claim or testimonial is displayed. Custom project artwork is labeled as illustration. The FezySlimes case study includes an actual live-storefront capture with its capture date; storefront marketing copy is not a portfolio outcome claim.

## Hosting

`.openai/hosting.json` retains the Sites project identity and static `out` directory. The canonical origin is centralized in `src/lib/site.ts`. Update this origin when changing the public domain. Sites starts owner-private; sharing can be changed separately when requested.

For Vercel, import this directory, select Next.js, and run the standard build. `output: 'export'` is configured. No environment variables are needed. The contact fallback works without a mail provider, provided a visitor has an email app configured.

## Verification and outstanding content

See `CONTENT_CHECKLIST.md` for provenance and missing evidence. The supplied brief is the provisional biography source because no CV was present. A resume button is deliberately omitted until a real PDF is supplied. Source inspections are not equivalent to running or auditing the original project applications.

The site can be checked in a locally installed Edge browser with `node scripts/verify-browser.mjs`. This writes screenshots and a report to ignored `.qa/`, uses a temporary browser profile and stops its own browser and static server on exit. No performance score is claimed.

## Expanded audit

`AUDIT.md` records prioritized findings, fixes, actual validation results and remaining content gaps. Original demonstrations on AI evaluation, the expanded churn methodology and four concept-only future directions are deliberately separated from verified implementation evidence.

`npm test` uses the Node 22 experimental TypeScript stripping feature to test mailto validation and encoding without another dependency. Node may print an experimental/module-detection warning; those warnings are not failing tests. `npm run test:browser` requires Windows Edge at the path in `scripts/verify-browser.mjs`; it tests 55 page/viewport combinations, keyboard menu behavior, filtering, workflow, preferences, metadata and form validation. External links can be rechecked with `node scripts/check-external-links.mjs`; a blocked crawler response does not establish that a link is broken.
