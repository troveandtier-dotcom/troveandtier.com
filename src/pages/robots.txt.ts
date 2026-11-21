const isProduction = process.env.CF_PAGES_BRANCH === 'main';

export function GET() {
  const body = isProduction
    ? [
        'User-agent: *',
        'Allow: /',
        'Disallow: /studio/',
        'Disallow: /search/',
        'Sitemap: https://troveandtier.com/sitemap.xml',
        '',
      ].join('\n')
    : [
        'User-agent: *',
        'Disallow: /',
        '',
      ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
