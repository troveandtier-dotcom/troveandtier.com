-- Atomic product + retailer + regional offer publishing.
-- All writes run in one Postgres transaction; an error rolls back the entire publish.
create or replace function public.publish_product_with_offer(
  p_retailer jsonb,
  p_product jsonb,
  p_offer jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_retailer_id uuid;
  v_product_id uuid;
  v_market text := p_offer->>'market';
  v_retailer_url text := p_retailer->>'website_url';
  v_canonical_url text := p_offer->>'canonical_url';
begin
  if not public.is_editor() then
    raise exception 'Not authorised to publish products';
  end if;

  if coalesce(p_retailer->>'name','') = ''
     or v_market not in ('US','UK','CA')
     or coalesce(v_retailer_url,'') !~* '^https://'
     or coalesce(v_canonical_url,'') !~* '^https://'
     or coalesce(p_offer->>'affiliate_url','') !~* '^https://' then
    raise exception 'Retailer, market and secure product/affiliate URLs are required';
  end if;

  if lower(substring(v_retailer_url from '^https://([^/]+)'))
     <> lower(substring(v_canonical_url from '^https://([^/]+)')) then
    raise exception 'The canonical product URL must belong to the named retailer website';
  end if;

  insert into public.retailers (name, market, website_url, is_active)
  values (p_retailer->>'name', v_market, v_retailer_url, true)
  on conflict (name, market) do update
    set is_active = true
    where lower(substring(public.retailers.website_url from '^https://([^/]+)'))
       = lower(substring(excluded.website_url from '^https://([^/]+)'))
  returning id into v_retailer_id;

  if v_retailer_id is null then
    raise exception 'A retailer with this name already exists for this market but has a different website';
  end if;

  insert into public.products (
    name, slug, brand, category_id, summary, description,
    image_url, image_credit, image_rights_status,
    evidence_type, evidence_notes, pros, limitations,
    status, published_at, last_verified_at
  ) values (
    p_product->>'name',
    p_product->>'slug',
    nullif(p_product->>'brand',''),
    nullif(p_product->>'category_id','')::uuid,
    coalesce(p_product->>'summary',''),
    coalesce(p_product->>'description',''),
    nullif(p_product->>'image_url',''),
    nullif(p_product->>'image_credit',''),
    coalesce(p_product->>'image_rights_status','unverified'),
    'editorial_research',
    'Product listing supplied by the Trove & Tier editor.',
    array(select jsonb_array_elements_text(coalesce(p_product->'pros','[]'::jsonb))),
    array(select jsonb_array_elements_text(coalesce(p_product->'limitations','[]'::jsonb))),
    'published',
    now(),
    now()
  ) returning id into v_product_id;

  insert into public.product_offers (
    product_id, retailer_id, market, currency,
    canonical_url, affiliate_url, status, verified_at
  ) values (
    v_product_id,
    v_retailer_id,
    v_market,
    case v_market when 'UK' then 'GBP' when 'CA' then 'CAD' else 'USD' end,
    v_canonical_url,
    p_offer->>'affiliate_url',
    'active',
    now()
  );

  return v_product_id;
end;
$$;

revoke execute on function public.publish_product_with_offer(jsonb,jsonb,jsonb) from public, anon;
grant execute on function public.publish_product_with_offer(jsonb,jsonb,jsonb) to authenticated;
