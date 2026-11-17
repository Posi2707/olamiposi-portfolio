// Use the stable production origin, rather than a temporary preview deployment.
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = (
  configuredOrigin ||
  (vercelProductionHost ? `https://${vercelProductionHost}` : '') ||
  'https://olamiposi-badiya-portfolio.daringcompass3.chatgpt.site'
).replace(/\/$/, '');
