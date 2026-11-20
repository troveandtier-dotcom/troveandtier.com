# Trove & Tier build status

## Current phase
Phase 1 — simple affiliate product catalogue and publishing desk.

## Implemented
- Astro public website with home, room/category, The Trove Edit, journal, about, policy and contact pages.
- Private owner/editor sign-in at `/studio`, restricted by the Supabase `admin_users` allowlist.
- One-step product publishing form: product name, brand, category, description, optional image, image-use rights, retailer, market, canonical product URL and affiliate URL.
- Optional image upload to the dedicated Supabase Storage bucket (`product-images`), limited to JPEG, PNG, WebP or AVIF up to 5 MB.
- Published products load on matching category pages and The Trove Edit without rebuilding the site.
- Affiliate links are direct tracked destinations with `rel="sponsored noopener noreferrer"`; affiliate disclosure is visible near product listings.
- US, UK and Canada offers are stored separately with their corresponding currency.
- Product and offer writes are restricted to authenticated users in the editor allowlist.

## Supabase state verified on 20 November 2026
- Project ref: `lavvvwhxshfwambxklko`; region: `eu-west-1`; project healthy at last check.
- Nine active categories exist.
- Editorial commerce tables exist and have RLS enabled.
- Owner allowlist row exists for the owner-provided Auth UUID.
- `product-images` bucket exists, public-read only for image delivery, 5 MB limit, supported image MIME types restricted; insert/update/delete policies require an authenticated editor.
- A transaction using the owner identity successfully inserted a temporary retailer, product and regional offer, then rolled back. No test product was retained.
- Security advisor currently reports one warning: leaked-password protection is disabled. No other security finding was returned in that check.

## Not yet verified / remaining before launch
- Fresh `npm run check` and `npm run build` on the current branch. The previous supplied Actions log used an older commit and is not evidence that this branch builds.
- Browser test of the owner login, image upload, product publishing and public product display.
- Logo image is not yet committed to the GitHub repository; the current header still uses a text mark.
- Production hosting project and deployment have not been created. No public website URL is live.
- The owner's Auth sign-in has not been tested from the website.

## Deliberately deferred
Advanced analytics, click/conversion dashboards, automated publishing, article CMS, affiliate redirect Worker, email capture and paid marketing automation. None is required to begin the first affiliate promotions once the public site and product flow are tested.

## Release rule
Do not announce the site as live or start sending promotional traffic until a production deployment and the basic product-publishing journey have been verified.
