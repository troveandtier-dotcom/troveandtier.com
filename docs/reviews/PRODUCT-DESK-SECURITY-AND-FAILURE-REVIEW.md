# Product Desk security and failure-handling review

**Review date:** 21 November 2026  
**Scope:** Product Desk client workflow, current Supabase row-level security, product publishing RPC, and product-image storage policies.  
**Environment:** Connected Supabase project and development branch `feat/phase-1-editorial-site`.  
**Status:** Database policy review passed for the inspected paths; browser end-to-end workflow remains unverified.

## Findings

### 1. Editor authorization — inspected and passed

- Product, offer, retailer, category, and admin-roster write policies are restricted to the `authenticated` role and call `private.is_editor()`.
- Public product reads are limited by RLS to `status = 'published'`.
- Public offer reads are limited to active offers whose parent product is published.
- Public retailer reads are limited to active retailers referenced by an active offer for a published product.
- The owner-only Product Desk additionally checks the signed-in user's UUID against `admin_users` before showing the editor interface. This client check is a UX gate, not the security boundary; RLS and the RPC remain the enforcement layer.

### 2. Atomic product publishing RPC — inspected and passed

The deployed `public.publish_product_with_offer(jsonb,jsonb,jsonb)` function was inspected directly in PostgreSQL:

- It is **SECURITY INVOKER**, not SECURITY DEFINER.
- It sets an empty search path and uses schema-qualified table/function references.
- It explicitly calls `private.is_editor()`.
- It restricts market values to US, UK, and CA.
- It requires HTTPS retailer, canonical product, and affiliate URLs.
- It checks that the canonical product URL host matches the submitted retailer website host.
- It inserts/updates the retailer, inserts the product, and inserts the offer in one transaction.
- The function is executable by `authenticated`; no public or anon execute grant was found.
- The product is marked as an owner-submitted editorial listing; verification timestamps remain null and the evidence note does not claim independent product testing.

### 3. Product image storage — inspected and passed with an explicit public-read design

- Bucket: `product-images`.
- Public read is enabled so published product images can load on the public website.
- Upload, update, and delete policies are limited to authenticated editors.
- Bucket limit is 5 MiB and allowed MIME types are JPEG, PNG, WebP, and AVIF.
- Public image access is intentional; do not store private, personal, or confidential files in this bucket.
- The form's file type and size checks are client-side convenience checks. They are not proof of image ownership or a cryptographic content inspection. Image rights remain an editorial declaration that must be checked before publishing.

### 4. Product Desk failure handling — one code fix committed

The product-list and product-count queries previously ignored their individual Supabase errors. A temporary permissions, network, or relationship-query failure could therefore leave the desk looking empty without telling the owner why.

Commit `29c917abd59f3d2532a74025286413266f716bc2` changes `src/pages/studio/index.astro` to:

- inspect all three query errors;
- avoid presenting failed counts as genuine zero values;
- show an explicit load-failure message;
- stop the recent-products rendering path when the data query fails.

This is a UI error-reporting improvement; it does not change database permissions or product records.

## Remaining verification gates

The following have **not** been claimed as passed:

1. Browser sign-in using the owner's private password.
2. Real image upload and public image retrieval.
3. Successful product publication from the browser.
4. Pause/resume and archive/restore in the browser.
5. Failed publication after image upload, including orphan-file cleanup.
6. Browser verification of category and The Edit regional filtering after a real product exists.
7. Mobile and desktop visual/accessibility review.

No product was inserted or modified during this review. The SQL inspection was read-only. No browser session or password was used.

## Release recommendation

The inspected database authorization and atomic publishing design are sound for the current single-owner workflow. Keep Product Desk browser testing as a launch blocker. Before public product listings are created, verify image rights and all factual product claims manually. The separate dependency audit and reproducible lockfile remain open release blockers.
