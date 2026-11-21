# Phase 1 test plan

## Automated checks
Run once after the current code batch:
1. `npm install --no-audit --no-fund`
2. `npm run check`
3. `npm run build`

The GitHub Actions workflow is manual-only with one Ubuntu job and an 8-minute timeout to protect the owner's monthly Actions budget. Do not add push, pull-request or scheduled triggers.

## Product publishing acceptance test
1. Sign in at `/studio` with the owner Auth account.
2. Confirm the category list loads.
3. Add a product with a unique name, description and category.
4. Add a permitted product image (either upload a supported image under 5 MB or use a permitted HTTPS image URL).
5. Add retailer name, market, canonical retailer product URL and approved affiliate URL.
6. Publish and confirm the success message and new product count.
7. Open the matching room page and confirm the product card, image and retailer link appear.
8. Open `/the-edit` and confirm the product appears there too.
9. Click the retailer link and confirm it opens the exact affiliate URL in a new tab.
10. Confirm the affiliate disclosure is visible near the product list.
11. In the Product Desk, pause the regional retailer link and confirm it disappears from public listings; resume it and confirm it returns.
12. Archive the product and confirm it disappears from public listings; restore it and confirm it returns.

## Security checks
- Anonymous visitors cannot access `/studio` product data or draft records.
- Authenticated non-editors cannot create products or upload product images.
- Public visitors can read only published products and active offers.
- Product image upload accepts only JPEG, PNG, WebP or AVIF up to 5 MB.
- No service-role key is included in public environment variables or browser code.
- Product and affiliate URLs require HTTPS.
- Affiliate links are labelled with sponsored link attributes.

## Manual browser checks
- Homepage and all room/category routes.
- The Trove Edit and journal routes.
- About, how-we-choose, affiliate disclosure, contact, privacy and terms.
- Desktop and mobile navigation, keyboard focus, form labels and error messages.
- 360px, 390px, 768px, 1024px and desktop widths.
- Broken images, invalid URLs, duplicate product names and a failed affiliate offer save.

## Current verification record
- Supabase owner-context transaction test: retailer + product + regional offer inserted successfully and transaction rolled back; no test records retained.
- Product image bucket and editor-only Storage policies: created and confirmed.
- Current branch Astro check: passed (0 errors, 0 warnings, 0 hints).
- Current branch production build: passed; 23 static pages generated successfully.
- Browser test of login, image upload, publishing and pause/archive controls: not yet run.
- Live deployment: not yet run.
