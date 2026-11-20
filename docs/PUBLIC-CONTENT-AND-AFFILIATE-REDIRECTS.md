# Public content and affiliate redirect configuration

## Static publishing model

The public Astro pages read only published records during the build using the Supabase publishable/anon key and the existing public-read RLS policies. The resulting HTML is static: visitors do not need a live Supabase request to read an article or browse a category.

Configure these build-time variables in the Cloudflare Worker build environment:

- `PUBLIC_SUPABASE_URL`: project API URL
- `PUBLIC_SUPABASE_ANON_KEY`: publishable key (legacy anon key is supported)

If these values are absent, the build intentionally falls back to the authored starter guides and does not expose draft records. A new build is required after an editor publishes or changes content. The GitHub Actions workflow remains manual-only to protect the monthly minutes allowance.

## Affiliate redirect Worker

The Worker handles `/go/{offer-uuid}`. It looks up the offer and requires all of the following:

- the offer is active;
- the related product is published;
- the related retailer is active;
- the canonical destination is HTTPS and its hostname matches the retailer's registered website hostname;
- an affiliate URL is used only when its hostname is explicitly listed in `AFFILIATE_HOST_ALLOWLIST`. Otherwise the redirect falls back to the verified canonical retailer URL.

The Worker returns a non-cacheable 404 for invalid or unavailable offer IDs. It never accepts a destination URL from the visitor.

Configure Worker environment variables:

- `SUPABASE_URL`: project API URL
- `SUPABASE_ANON_KEY`: publishable key for public offer lookup
- `AFFILIATE_HOST_ALLOWLIST`: comma-separated exact hostnames approved by the owner (for example, affiliate-network.example); do not include URL paths or wildcards
- `SUPABASE_SERVICE_ROLE_KEY`: optional Worker secret used only for best-effort click-event inserts. Add it as a Cloudflare secret, never as a plain variable and never as a `PUBLIC_` build variable.

If the service-role secret is absent, redirects still work but click events are not recorded. Logging is best-effort and does not delay the redirect. Never put this secret in GitHub, the browser, or the static build.

## Revenue and attribution

The studio reports article records, published articles, active offers and recorded outbound clicks. It explicitly labels affiliate conversions and commissions as not connected. Clicks are not purchases. Connect affiliate-network reporting only after the relevant programmes are approved and their reporting/payout terms are confirmed.

## Before enabling a live affiliate programme

1. Verify the retailer's canonical product URL and its website hostname.
2. Verify that the affiliate URL belongs to the approved network and exact tracking destination.
3. Add only the affiliate URL hostname to the Worker allowlist.
4. Mark the offer active only after the product and offer evidence have been reviewed.
5. Test valid, paused, unpublished, unknown-ID, wrong-market and non-allowlisted affiliate destinations.
6. Confirm the click event appears in the database when the Worker secret is configured.

## Current release status

This code is committed to the development branch only. It has not been deployed or browser-tested. No Cloudflare secrets have been created and no affiliate hostname has been approved here.
