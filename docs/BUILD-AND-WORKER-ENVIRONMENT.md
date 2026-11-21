# Build and Cloudflare Worker environment

This repository has two separate runtime concerns:

1. Astro generates the public static site into `dist/`.
2. The Cloudflare Worker in `src/worker.ts` handles only `/go/:offerId` redirects and delegates all other requests to the static asset binding.

## Astro build variables

Set these as build-time variables in the environment that runs `npm run build`:

- `PUBLIC_SUPABASE_URL`: the Supabase project URL.
- `PUBLIC_SUPABASE_ANON_KEY`: the Supabase publishable key (or legacy anon key).

These are public client credentials and are protected by Supabase RLS. Never use a service-role key as a `PUBLIC_` variable.

The public content functions return empty content when these values are absent. That fallback keeps the static build possible, but it does not prove that database-backed content has been included in the generated pages. A real content build must have both values configured.

## Cloudflare Worker runtime variables and secrets

The Worker expects:

- `SUPABASE_URL`: same project URL.
- `SUPABASE_ANON_KEY`: publishable/anon key, used only to read active offers and published products through RLS.
- `SUPABASE_SERVICE_ROLE_KEY`: **secret**, used only for best-effort click-event inserts. Do not put this in source control, a public variable, or browser code.
- `AFFILIATE_HOST_ALLOWLIST`: comma-separated exact hostnames for approved affiliate-network redirect domains. Leave empty until each network hostname has been checked.

Set secret values using the Cloudflare Wrangler secret mechanism in the intended account and Worker. Do not add secret values to `wrangler.jsonc`. The service-role key must remain a secret.

## Safe first build

From the repository root:

```sh
npm install --no-audit --no-fund
npm run check
npm run build
```

Confirm that `dist/` contains the public routes and that the generated journal/category pages include only published records. A build without Supabase variables is a static-shell check only.

## Worker validation and deployment

The current repository has a Wrangler configuration but does not yet declare a Wrangler CLI dependency or provide a Worker deployment script. Do not treat `npm run build` as a Worker build or deployment.

Before deploying the Worker:

1. Install and pin Wrangler as a project development dependency.
2. Add a deterministic Worker dry-run/build command to the validation workflow.
3. Configure the Cloudflare account's Worker subdomain or route.
4. Set the runtime values above as Worker variables/secrets.
5. Confirm the exact affiliate-network host allowlist.
6. Build the Astro assets, then deploy the Worker and static assets together.
7. Test invalid IDs, inactive offers, unpublished products, retailer-host mismatch, disallowed affiliate hosts, canonical fallback, and click-event logging.

The Cloudflare account currently has no Worker scripts, so there is no existing live Worker to test or update.

## Click measurement

The Worker returns the retailer redirect even if analytics logging fails. Click events are best-effort outbound-click measurements. They are not purchases, affiliate conversions, or commissions. Affiliate-network reporting remains the source of truth for earnings.

## CI budget

The GitHub Actions validation workflow is manual-only and has an 8-minute job timeout. Keep it that way: no push, pull-request, or scheduled triggers, and no automatic deployment. Run a single validation job deliberately and inspect its result before considering another run.
