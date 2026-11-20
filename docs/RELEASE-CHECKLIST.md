# Trove & Tier release checklist

## Product and editorial
- [ ] Approved logo asset committed and rendered in header/footer.
- [ ] All navigation links resolve.
- [ ] All editorial cards link to real guide pages.
- [ ] No sample product, fake price, fabricated rating or unverified stock claim.
- [ ] Product recommendations pass PRODUCT-RECOMMENDATION-STANDARD.md.
- [ ] Affiliate disclosure visible near monetized content.
- [ ] Privacy and terms reviewed and finalized before enabling data collection.

## Accessibility and UX
- [ ] Keyboard-only navigation and visible focus.
- [ ] Mobile menu works with keyboard and Escape.
- [ ] Country selector has accessible label and understandable persistence.
- [ ] Text and controls meet WCAG 2.2 AA contrast.
- [ ] Responsive checks at 360, 390, 768, 1024 and desktop widths.
- [ ] Reduced-motion preference respected.
- [ ] Images have useful alt text or are decorative.

## Technical
- [ ] npm install and lockfile committed.
- [ ] npm run check passes.
- [ ] npm run build passes.
- [ ] GitHub Actions CI passes.
- [ ] Lighthouse mobile and desktop reports recorded.
- [ ] No secrets in repository or client bundle.
- [ ] 404 and error states checked.
- [ ] Supabase RLS, auth and advisor checks pass before CMS launch.
- [ ] Cloudflare deployment preview reviewed by owner before production.

## Commercial readiness
- [ ] Affiliate programme approvals and payment routes confirmed.
- [ ] Retailer programme terms followed.
- [ ] Country-specific link coverage tested.
- [ ] Click analytics separated from network-reported purchases.
- [ ] Brand partnership contact channel is live and tested before soliciting enquiries.
