interface Env {
  ASSETS: Fetcher;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  AFFILIATE_HOST_ALLOWLIST?: string;
}
type Offer = {
  id: string; product_id: string; market: 'US'|'UK'|'CA';
  canonical_url: string; affiliate_url: string | null; status: string;
  product: { status: string } | null;
  retailer: { is_active: boolean; website_url: string } | null;
};
const jsonHeaders = (key: string) => ({
  apikey: key,
  Authorization: 'Bearer ' + key,
  'Content-Type': 'application/json'
});
function safeHttps(value: string | null | undefined): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (url.hostname === 'localhost' || url.hostname.endsWith('.local')) return null;
    return url;
  } catch { return null; }
}
function notFound() {
  return new Response('This retailer link is unavailable.', {
    status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
async function redirectOffer(request: Request, env: Env, ctx: ExecutionContext, id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return notFound();
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return notFound();

  const endpoint = new URL('/rest/v1/product_offers', env.SUPABASE_URL);
  endpoint.search = new URLSearchParams({
    select: 'id,product_id,market,canonical_url,affiliate_url,status,product:products!inner(status),retailer:retailers!inner(is_active,website_url)',
    id: 'eq.' + id, status: 'eq.active', 'product.status': 'eq.published',
    'retailer.is_active': 'eq.true', limit: '1'
  }).toString();
  let rows: Offer[];
  try {
    const response = await fetch(endpoint, { headers: jsonHeaders(env.SUPABASE_ANON_KEY) });
    if (!response.ok) return notFound();
    rows = await response.json() as Offer[];
  } catch { return notFound(); }
  const offer = rows[0];
  if (!offer || offer.status !== 'active' || offer.product?.status !== 'published' || !offer.retailer?.is_active) return notFound();

  const canonical = safeHttps(offer.canonical_url);
  const retailerHome = safeHttps(offer.retailer.website_url);
  if (!canonical || !retailerHome || canonical.hostname !== retailerHome.hostname) return notFound();

  const allowedHosts = new Set((env.AFFILIATE_HOST_ALLOWLIST || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean));
  const affiliate = safeHttps(offer.affiliate_url);
  // Affiliate network hosts must be explicitly allowlisted in the Worker environment.
  const destination = affiliate && allowedHosts.has(affiliate.hostname.toLowerCase()) ? affiliate : canonical;

  if (env.SUPABASE_SERVICE_ROLE_KEY) {
    const incoming = new URL(request.url);
    const rawSource = incoming.searchParams.get('from') || '';
    const sourcePath = rawSource.startsWith('/') && !rawSource.startsWith('//') ? rawSource.slice(0, 300) : null;
    const logUrl = new URL('/rest/v1/affiliate_click_events', env.SUPABASE_URL);
    ctx.waitUntil(fetch(logUrl, {
      method: 'POST',
      headers: { ...jsonHeaders(env.SUPABASE_SERVICE_ROLE_KEY), Prefer: 'return=minimal' },
      body: JSON.stringify({
        offer_id: offer.id, product_id: offer.product_id, market: offer.market, source_path: sourcePath
      })
    }).then(() => undefined).catch(() => undefined));
  }
  return Response.redirect(destination.toString(), 302);
}
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/go\/([^/]+)\/?$/);
    if (match && request.method === 'GET') return redirectOffer(request, env, ctx, match[1]);
    if (url.pathname.startsWith('/go/')) return notFound();
    return env.ASSETS.fetch(request);
  }
};
