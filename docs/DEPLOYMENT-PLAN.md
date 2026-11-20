# Hosting plan

## Proposed production host
Cloudflare Workers Static Assets, with the Astro site built as static output.

## Current state
- Cloudflare account was inspected read-only.
- No Workers scripts or zones were returned.
- No DNS zone/domain has been created or connected.
- No Worker has been deployed.
- The Cloudflare account plan and workers.dev subdomain setup were not confirmed.

## Release gate
Do not deploy until:
1. Local and CI checks pass.
2. Homepage, mobile navigation, categories, journal, search and legal pages are reviewed.
3. The owner approves the visual design and the logo placement.
4. The owner confirms the GitHub repository visibility decision.
5. Cloudflare free-plan limits and account settings are checked.
6. Environment secrets and future Supabase permissions are reviewed.

## Deploy later
Use Wrangler with the committed `wrangler.jsonc` configuration after the release gate. Do not add a domain or DNS record without explicit approval.

Netlify remains an optional fallback, not a second production target.
