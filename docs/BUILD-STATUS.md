# Trove & Tier build status

Last checked: 20 November 2026

## Current phase
Phase 1 — public editorial site, simple affiliate product catalogue and owner publishing desk.

## Implemented in `feat/phase-1-editorial-site`
- Astro public website with homepage, room/category pages, The Trove Edit, Journal, about, policy and contact pages.
- Private owner/editor sign-in at `/studio`, restricted by the Supabase `admin_users` allowlist.
- Product form for name, brand, category, description, optional image, image-use rights, retailer, market, canonical product URL and affiliate URL.
- Product controls to pause/resume regional retailer links and archive/restore products.
- Optional image upload to the dedicated Supabase Storage bucket (`product-images`), limited to JPEG, PNG, WebP or AVIF up to 5 MB.
- Public category pages and The Trove Edit load published products from Supabase.
- Affiliate links are direct tracked destinations with `rel="sponsored noopener noreferrer"`; affiliate disclosure is visible near product listings.
- Logo mark is the supplied, unaltered brand mark, optimized for the site header; favicon and Apple touch icon reference the same mark.
- Story-first homepage introduction and category descriptions follow the approved Trove & Tier editorial standard.
- Journal listing combines static editorial entries with published CMS articles.
- Full Article 2 manuscript is integrated at the existing canonical route `/journal/under-sink-storage/`.
- Article 4 manuscript, approved by the owner, is integrated at `/journal/pantry-organization-system/`, with Kitchen category registration, metadata, byline and existing Article 1/2 internal links.
- Safe Markdown rendering supports article headings, paragraphs, lists, tables and safe links.
- New Supabase migration separates public read policies from the private editor helper. Public roles can read only active/published records; authenticated owner/editor access remains through separate editor policies.

## Verified infrastructure and tests
- GitHub repository: `troveandtier-dotcom/troveandtier.com`.
- Development branch: `feat/phase-1-editorial-site`.
- Pull request #1 remains open as a draft; it has not been merged.
- Cloudflare Pages project: `trove-and-tier`; production branch remains `main`.
- Cloudflare build settings: `npm run build`, output directory `dist`, root directory `/`.
- GitHub source connection and branch preview deployments are working.
- Cloudflare successfully built and deployed the feature branch preview at commit `f8f775cab74df9a11335db8ddefc585ab546b4bd`; Astro generated 24 static pages. That preview predates the latest Supabase policy migration and must be rebuilt before acceptance.
- Supabase project ref: `lavvvwhxshfwambxklko`; region `eu-west-1`.
- Supabase owner allowlist has one owner record. With the owner's JWT subject simulated under the authenticated role, `private.is_editor()` returned true and owner access remained intact after the public-policy change.
- Under the anon role, read-policy smoke checks completed without permission errors. Nine active categories were visible; there are currently zero published CMS articles, zero published products and zero active offers in the database.
- Product image bucket and editor storage policies were previously verified; a transaction test inserted temporary commerce records and rolled them back.

## Remaining before launch
- Rebuild the feature branch after the latest RLS migration and verify the Cloudflare preview logs no longer show `permission denied for function is_editor`.
- Browser verification of homepage, Journal, Kitchen category, Article 2, Article 4, SEO title/description/canonical URLs, internal links, table responsiveness and mobile/desktop layouts. Automated web retrieval could not inspect the Cloudflare preview host in this session; human visual confirmation is still required.
- End-to-end owner login and password sign-in from the website.
- End-to-end product image upload, publish, pause/resume, archive/restore and public product display.
- Confirm the final production build and deploy to the production branch only after preview acceptance.
- Post-deployment verification on `https://trove-and-tier.pages.dev/`.

## Deliberately deferred
Advanced analytics, click/conversion dashboards, automated publishing, full editorial CMS, affiliate redirect Worker, email capture and paid marketing automation. These are not prerequisites for the first carefully verified launch.

## Release rule
Do not announce the site as live or send promotional traffic to new article routes until the latest preview build, browser checks and production deployment have been verified. Never describe branch-only work as published.
