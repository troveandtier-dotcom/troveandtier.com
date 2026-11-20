# Trove & Tier build status

## Current phase
Phase 1 — public website foundation.

## Verified account state (20 November 2026)
- Cloudflare account authenticated as the Trove & Tier account. No Workers scripts and no zones were returned by the read-only account check.
- Supabase project `lavvvwhxshfwambxklko`, region `eu-west-1`, status `ACTIVE_HEALTHY`. Public schema has no tables and there are no recorded migrations. Security and performance advisors returned no lints.
- GitHub repository: `troveandtier-dotcom/troveandtier.com`, public, empty at initial inspection, default branch `main`. Work is isolated on `feat/phase-1-editorial-site`.
- Netlify account is authenticated and currently has no sites.
- No cloud resources, database objects, DNS records, or deployments were created during reconnaissance.

## Implemented in this phase
- Astro + TypeScript project foundation.
- Design tokens and editorial homepage structure.
- Responsive navigation, local region preference, room discovery, editorial sections and footer.
- No live product claims, prices, affiliate URLs, newsletter capture or fabricated testimonials.

## Not yet verified
- npm installation, Astro type check, production build, browser QA, Lighthouse, accessibility automation, mobile device testing, deployment.
- Supabase studio, schema, auth, affiliate redirect service, analytics, search backend and real editorial content.
- Logo asset is supplied by the owner but has not yet been committed as a binary repository asset.

## KPIs to instrument and review
### Acquisition
- Qualified sessions by country and channel.
- Pinterest saves and outbound clicks; Facebook and Instagram reach and site clicks.
### Engagement
- Engaged sessions, article reads, category discovery, search use, returning visitors.
### Commercial intent
- Product-card interactions, retailer outbound clicks by product / market / source article.
- Affiliate conversions and commissions imported from network reports (outbound clicks are not purchases).
### Business development
- Brand partnership enquiries, qualified enquiries, response rate and secured collaboration revenue.
### Editorial quality
- Published guides, source coverage, product-link verification age, correction rate and pages meeting accessibility/performance checks.

Set numeric targets only after a baseline exists. Review weekly and at 30/60/90 days.
