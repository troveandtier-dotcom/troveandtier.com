-- Trove & Tier editorial commerce foundation.
-- Additive first migration. No existing public tables or migrations were present at inspection.
create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner','editor')),
  created_at timestamptz not null default now()
);

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.retailers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  market text not null check (market in ('US','UK','CA')),
  website_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, market)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text,
  category_id uuid references public.categories(id) on delete set null,
  summary text not null default '',
  description text not null default '',
  dimensions jsonb not null default '{}'::jsonb,
  materials text,
  care_instructions text,
  pros text[] not null default '{}',
  limitations text[] not null default '{}',
  evidence_type text not null default 'editorial_research'
    check (evidence_type in ('manufacturer_specification','editorial_research','hands_on_test','independent_review')),
  evidence_notes text not null default '',
  image_url text,
  image_credit text,
  image_rights_status text not null default 'unverified'
    check (image_rights_status in ('unverified','licensed','manufacturer_permission','owned','public_domain')),
  status text not null default 'draft' check (status in ('draft','in_review','approved','published','archived')),
  published_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  retailer_id uuid not null references public.retailers(id) on delete restrict,
  market text not null check (market in ('US','UK','CA')),
  currency text not null check (currency in ('USD','GBP','CAD')),
  canonical_url text not null,
  affiliate_url text,
  affiliate_program text,
  price_amount numeric(12,2),
  price_checked_at timestamptz,
  availability text not null default 'unknown'
    check (availability in ('in_stock','out_of_stock','unknown','discontinued')),
  availability_checked_at timestamptz,
  status text not null default 'draft' check (status in ('draft','active','paused','archived')),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, retailer_id, market),
  check ((market <> 'US' or currency = 'USD') and (market <> 'UK' or currency = 'GBP') and (market <> 'CA' or currency = 'CAD'))
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body_markdown text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  cover_image_url text,
  cover_image_alt text,
  cover_image_credit text,
  seo_title text,
  seo_description text,
  content_type text not null default 'guide' check (content_type in ('guide','editorial','roundup','news')),
  status text not null default 'draft' check (status in ('draft','in_review','approved','published','archived')),
  published_at timestamptz,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.article_products (
  article_id uuid not null references public.articles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  display_order integer not null default 0,
  editorial_note text not null default '',
  primary key (article_id, product_id)
);

create table public.editorial_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text not null,
  publisher text,
  accessed_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.product_sources (
  product_id uuid not null references public.products(id) on delete cascade,
  source_id uuid not null references public.editorial_sources(id) on delete cascade,
  claim_supported text not null default '',
  primary key (product_id, source_id, claim_supported)
);

create table public.affiliate_click_events (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.product_offers(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  article_id uuid references public.articles(id) on delete set null,
  market text check (market in ('US','UK','CA')),
  source_path text,
  created_at timestamptz not null default now()
);

create index products_status_category_idx on public.products(status, category_id);
create index product_offers_product_market_idx on public.product_offers(product_id, market, status);
create index articles_status_published_idx on public.articles(status, published_at desc);
create index affiliate_click_events_created_idx on public.affiliate_click_events(created_at desc);
create index affiliate_click_events_market_idx on public.affiliate_click_events(market, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array['categories','retailers','products','product_offers','articles'] loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end;
$$;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.retailers enable row level security;
alter table public.products enable row level security;
alter table public.product_offers enable row level security;
alter table public.articles enable row level security;
alter table public.article_products enable row level security;
alter table public.editorial_sources enable row level security;
alter table public.product_sources enable row level security;
alter table public.affiliate_click_events enable row level security;

create policy "admins manage admin roster" on public.admin_users
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "public read active categories" on public.categories
  for select to anon, authenticated using (is_active or public.is_editor());
create policy "admins manage categories" on public.categories
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "public read active retailers for published offers" on public.retailers
  for select to anon, authenticated using (
    (is_active and exists (
      select 1 from public.product_offers o join public.products p on p.id=o.product_id
      where o.retailer_id=retailers.id and o.status='active' and p.status='published'
    )) or public.is_editor()
  );
create policy "admins manage retailers" on public.retailers
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "public read published products" on public.products
  for select to anon, authenticated using (status='published' or public.is_editor());
create policy "admins manage products" on public.products
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "public read active offers for published products" on public.product_offers
  for select to anon, authenticated using (
    (status='active' and exists (select 1 from public.products p where p.id=product_offers.product_id and p.status='published'))
    or public.is_editor()
  );
create policy "admins manage offers" on public.product_offers
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "public read published articles" on public.articles
  for select to anon, authenticated using (status='published' or public.is_editor());
create policy "admins manage articles" on public.articles
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "public read published article product links" on public.article_products
  for select to anon, authenticated using (
    exists (select 1 from public.articles a where a.id=article_products.article_id and a.status='published')
    or public.is_editor()
  );
create policy "admins manage article product links" on public.article_products
  for all to authenticated using (public.is_editor()) with check (public.is_editor());

create policy "admins manage editorial sources" on public.editorial_sources
  for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "admins manage product sources" on public.product_sources
  for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "admins read click events" on public.affiliate_click_events
  for select to authenticated using (public.is_editor());

grant select on public.categories, public.products, public.articles, public.article_products, public.product_offers, public.retailers to anon, authenticated;
grant all on public.admin_users, public.categories, public.retailers, public.products, public.product_offers, public.articles, public.article_products, public.editorial_sources, public.product_sources, public.affiliate_click_events to authenticated;
grant select on public.affiliate_click_events to authenticated;

comment on table public.affiliate_click_events is 'Server-written click events only. Do not grant public insert; the redirect worker will use a restricted server credential.';
comment on table public.admin_users is 'Explicit allowlist of authenticated editorial staff. Owner must add the first user after confirming their Auth user UUID.';
