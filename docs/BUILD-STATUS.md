# Trove & Tier build status

Last checked: 21 November 2026

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
- Article 4 manuscript, approved by the owner, is integrated at `/journal/pantry-organization-system/`, with Kitchen category registration, metadata, byline and corrected Article 1/2 internal links.
- Safe Markdown rendering supports article headings, paragraphs, lists, tables and safe links.
- Supabase migration separates public read policies from the private editor helper. Public roles can read only active/published records; authenticated owner/editor access remains through separate editor policies.
- Preview deployments are configured not to be indexed; the canonical production hostname remains the intended indexable host.

## Verified infrastructure and tests
- GitHub repository: `troveandtier-dotcom/troveandtier.com`.
- Development branch: `feat/phase-1-editorial-site`.
- Pull request #1 remains open as a draft; it has not been merged.
- Cloudflare Pages project: `trove-and-tier`; production branch remains `main`.
- Cloudflare build settings: `npm run build`, output directory `dist`, root directory `/`.
- GitHub source connection and branch preview deployments are working.
- Latest preview deployment: [`a3b60e3b`](https://a3b60e3b.trove-and-tier.pages.dev), commit `18e8192a910273b388fd1acdcd1bcfc203d864bb` (`Keep Pages dashboard as deployment configuration source`). Cloudflare reports queued, initialize, clone, build and deploy stages all successful.
- The build-time Supabase diagnostic passed: URL present and valid; public key present and recognized. No secret key value is logged.
- Latest build generated 24 static pages, including the homepage, Journal, Kitchen category, Article 2, Article 3, Article 4 and Product Studio routes.
- The Pages build now ignores the incomplete Wrangler Pages configuration and uses the dashboard's deployment configuration; the separate redirect Worker config is unchanged.
- Browser smoke test on the successful `a3b60e3b` preview returned HTTP 200 for `/`, `/journal/`, `/journal/pantry-organization-system/`, `/studio/`, `/the-edit/` and `/kitchen/`; page titles and H1s rendered and the browser reported no JavaScript/page errors. This is a route smoke test, not visual/mobile or authenticated workflow acceptance.
- Added and applied `publish_product_with_offer(jsonb,jsonb,jsonb)`, a `SECURITY INVOKER` database function that writes retailer, product and regional offer atomically. A follow-up migration now records owner-submitted listings as `editorial_submission`, leaves `last_verified_at` and offer `verified_at` NULL until a real check occurs, and exposes that distinction on public product cards. The first draft referenced the old `public.is_editor()` helper; a live authenticated transaction test exposed that the deployed RLS helper is `private.is_editor()`. Added and applied corrective migration `202611210002_fix_atomic_publish_auth_helper.sql` to use the actual helper.
- Re-ran an authenticated transaction using the owner UUID: the RPC returned a product ID successfully; the test transaction was rolled back; follow-up queries confirmed zero test product/retailer rows remain. Privilege checks confirm `anon` cannot execute the RPC and `authenticated` can. This validates the authorization helper, core insert path and rollback hygiene at SQL level.
- The Product Desk frontend calls this RPC instead of separate product/offer inserts. The form now warns that publication is not product testing or live-stock verification. Preview `https://9a89502a.trove-and-tier.pages.dev` (commit `cf753a0`) successfully built and passed the six-route browser smoke test. Corrective migration and this test record are now in the branch; a fresh preview build must complete before the new migration is release-ready.
- Latest deployment logs contain no `permission denied for function is_editor` or `Published article snapshot unavailable` messages. The public read-policy issue is therefore cleared at build/smoke-test level; browser behavior still needs validation.
- Cloudflare deployment preview URL: `https://b49e9ccd.trove-and-tier.pages.dev`. Preview alias: `https://feat-phase-1-editorial-site.trove-and-tier.pages.dev`.
- Supabase project ref: `lavvvwhxshfwambxklko`; region `eu-west-1`.
- Supabase owner allowlist has one owner record. With the owner's JWT subject simulated under the authenticated role, `private.is_editor()` returned true and owner access remained intact after the public-policy change.
- Under the anon role, read-policy smoke checks completed without permission errors. Nine active categories were visible; there are currently zero published CMS articles, zero published products and zero active offers in the database.
- Product image bucket and editor storage policies were previously verified; a transaction test inserted temporary commerce records and rolled them back.
- GitHub Actions remain manual-only; no Actions workflow was run for these preview deployments.

## Newly identified release blocker
- The latest Cloudflare dependency installation reported **5 npm audit vulnerabilities: 1 low, 3 high and 1 critical**. The build still completed, but the affected packages and fix paths have not yet been identified. No `package-lock.json` is currently committed, so dependency resolution is not reproducible. Inspect the full audit report, create and commit a reviewed lockfile, and apply compatible, targeted dependency updates before production release. Do not run `npm audit fix --force` blindly.

## Remaining before launch
- Inspect and remediate the npm audit findings; rerun the production build after the dependency changes.
- Browser verification of homepage, Journal, Kitchen category, Article 2, Article 4, SEO title/description/canonical URLs, preview noindex behavior, internal links, table responsiveness and mobile/desktop layouts. Automated web retrieval could not inspect the Cloudflare preview host in this session; human visual confirmation is still required.
- End-to-end owner login and password sign-in from the website. The owner must enter the password privately; it should never be shared in chat.
- End-to-end product image upload, publish, pause/resume, archive/restore and public product display.
- Confirm the category-page nested Supabase relation filter works in the browser.
- Exercise the new atomic publish RPC through the authenticated browser flow, including successful publish, invalid retailer/domain, duplicate retailer, offer constraint failure and image-upload cleanup. Do not publish real catalogue entries until the full workflow passes.
- Complete visual/mobile browser review, metadata/canonical checks, preview noindex behavior, internal links, table responsiveness and the nested Supabase category relation filter.
- Confirm the final production build and deploy to the production branch only after preview acceptance.
- Post-deployment verification on `https://trove-and-tier.pages.dev/`.

## Deliberately deferred
Advanced analytics, click/conversion dashboards, automated publishing, full editorial CMS, affiliate redirect Worker, email capture and paid marketing automation. These are not prerequisites for the first carefully verified launch.

## Release rule
Do not announce the site as live or send promotional traffic to new article routes until the npm audit findings are addressed, the latest preview build and browser checks have been verified, and production deployment is confirmed. Never describe branch-only work as published.
