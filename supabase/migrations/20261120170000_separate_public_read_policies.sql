-- Keep public SELECT policies independent of the private editor helper.
-- The editor helper remains restricted to authenticated users; admin ALL policies
-- continue to grant editors access through their separate authenticated policies.
drop policy if exists "public read active categories" on public.categories;
create policy "public read active categories"
  on public.categories for select to anon, authenticated
  using (is_active);

drop policy if exists "public read active retailers for published offers" on public.retailers;
create policy "public read active retailers for published offers"
  on public.retailers for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1
      from public.product_offers o
      join public.products p on p.id = o.product_id
      where o.retailer_id = retailers.id
        and o.status = 'active'
        and p.status = 'published'
    )
  );

drop policy if exists "public read published products" on public.products;
create policy "public read published products"
  on public.products for select to anon, authenticated
  using (status = 'published');

drop policy if exists "public read active offers for published products" on public.product_offers;
create policy "public read active offers for published products"
  on public.product_offers for select to anon, authenticated
  using (
    status = 'active'
    and exists (
      select 1
      from public.products p
      where p.id = product_offers.product_id
        and p.status = 'published'
    )
  );

drop policy if exists "public read published articles" on public.articles;
create policy "public read published articles"
  on public.articles for select to anon, authenticated
  using (status = 'published');

drop policy if exists "public read published article product links" on public.article_products;
create policy "public read published article product links"
  on public.article_products for select to anon, authenticated
  using (
    exists (
      select 1
      from public.articles a
      where a.id = article_products.article_id
        and a.status = 'published'
    )
  );
