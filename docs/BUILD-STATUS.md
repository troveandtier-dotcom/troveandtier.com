# Trove & Tier build status

Last checked: 20 November 2026

## Current phase
Phase 1 — public editorial site, simple affiliate product catalogue and owner publishing desk.

## Implemented in `feat/phase-1-editorial-site` (not yet production)
- Astro public website with homepage, room/category pages, The Trove Edit, Journal, about, policy and contact pages.
- Private owner/editor sign-in at `/studio`, restricted by the Supabase `admin_users` allowlist.
- Product form for name, brand, category, description, optional image, image-use rights, retailer, market, canonical product URL and affiliate URL.
- Product controls to pause/resume regional retailer links and archive/restore products.
- Optional image upload to the dedicated Supabase Storage bucket (`product-images`), limited to JPEG, PNG, WebP or AVIF up to 5 MB.
- Public category pages and The Trove Edit load published products from Supabase.
- Affiliate links are direct tracked destinations with `rel="sponsored noopener noreferrer"`; affiliate disclosure is visible near product listings.
- Logo mark is now the supplied, unaltered brand mark, optimized for the site header; favicon and Apple touch icon reference the same mark.
- Story-first homepage introduction and category descriptions follow the approved Trove & Tier editorial standard.
- Journal listing combines static editorial entries with published CMS articles.
- Full Article 2 manuscript is integrated at the existing canonical route `/journal/under-sink-storage/`.
- Article 4 manuscript, approved by the owner, is integrated at `/journal/pantry-organization-system/`, with Kitchen category registration, metadata, byline and existing Article 1/2 internal links.
- Safe Markdown rendering supports article headings, paragraphs, lists, tables and safe links.

## Verified infrastructure
- GitHub repository: `troveandtier-dotcom/troveandtier.com`.
- Development branch: `feat/phase-1-editorial-site`.
- Pull request #1 is open as a draft; it has not been merged.
- Cloudflare Pages project: `trove-and-tier`; production branch remains `main`.
- Cloudflare build settings: Astro-compatible `npm run build`, output directory `dist`, root directory `/`.
- Cloudflare Git source is connected to the GitHub repository. Preview deployments are enabled; production deployments are configured for `main`.
- Preview and production build environments contain the public Supabase URL and publishable/anonymous key.
- Supabase project ref: `lavvvwhxshfwambxklko`; region `eu-west-1`.
- Supabase owner allowlist and product image bucket were previously verified; a transaction test inserted temporary commerce records and rolled them back.

## Not yet verified / remaining before launch
- A fresh build of the current feature branch. The prior local build attempt could not fetch GitHub because of network/DNS failure; an older Actions run is not evidence for this branch.
- Preview deployment of the current feature branch and its build logs.
- Browser checks for Article 2 and Article 4, Journal and Kitchen listings, metadata/canonical URLs, internal links, responsive tables and mobile/desktop layouts.
- End-to-end owner login, product image upload, publish, pause/resume, archive/restore and public product display.
- Confirm password sign-in from the actual website.
- Production deployment and post-deployment verification.

## Deliberately deferred
Advanced analytics, click/conversion dashboards, automated publishing, full editorial CMS, affiliate redirect Worker, email capture and paid marketing automation. These are not prerequisites for the first carefully verified launch.

## Release rule
Do not announce the site as live or send promotional traffic to new article routes until the preview build, key page checks and production deployment have been verified. Never describe branch-only work as published.
