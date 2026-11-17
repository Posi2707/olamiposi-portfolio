'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="container error-page"><span className="eyebrow">SOMETHING WENT WRONG</span><h1>A small interruption.</h1><p>Please try loading this page again.</p><button className="button primary" onClick={reset}>Try again</button></section>}
