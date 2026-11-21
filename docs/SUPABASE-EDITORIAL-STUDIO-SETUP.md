# Supabase editorial studio setup

The initial editorial-commerce schema is deployed to the existing Supabase project. The studio is a browser client using only the project's public URL and publishable/anon key. It never uses the service-role key.

## Required one-time owner setup
1. In Supabase Authentication, create the owner's user account (do not enable public sign-ups).
2. Confirm the user's UUID in Authentication > Users.
3. In SQL Editor, run the following, replacing the UUID with the exact owner UUID:
   `insert into public.admin_users (user_id, role) values ('YOUR-AUTH-USER-UUID', 'owner');`
4. Add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` to the local environment and the eventual hosting build environment.
5. Never expose a service-role key or put it in any `PUBLIC_*` variable.

## Current studio scope
- Password sign-in only; no public registration.
- RLS-backed editor allowlist check.
- Create product records as drafts.
- List up to 50 most recently updated products.
- No publish action yet; approval and publication remain owner-controlled.
- No affiliate URL or retailer record is created automatically.

## Deployment
Do not deploy until owner reviews the preview and hosting environment variables are set. Do not add Supabase service-role credentials to the browser. Any server-side redirect or privileged action will need a separate, narrowly scoped server implementation.
