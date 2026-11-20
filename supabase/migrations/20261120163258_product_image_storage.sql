-- Product image storage for the private Product Desk.
-- Public read is limited to this dedicated bucket; only authenticated editors can mutate objects.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "Editors upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images' and (select private.is_editor()));

create policy "Editors update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images' and (select private.is_editor()))
with check (bucket_id = 'product-images' and (select private.is_editor()));

create policy "Editors delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images' and (select private.is_editor()));
