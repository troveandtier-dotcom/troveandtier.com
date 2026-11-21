import { categories, articles } from '../data/site';
import { getPublishedArticles } from '../lib/public-content';

const origin = 'https://troveandtier.com';
const fixedPaths = [
  '/',
  '/categories/',
  '/journal/',
  '/about/',
  '/how-we-choose/',
  '/affiliate-disclosure/',
  '/contact/',
  '/privacy/',
  '/terms/',
];

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export async function GET() {
  const published = await getPublishedArticles();
  const articleSlugs = [...new Set([
    ...articles.map(article => article.slug),
    ...published.map(article => article.slug),
  ])];
  const categorySlugs = categories
    .filter(category =>
      articles.some(article => article.category === category.title) ||
      published.some(article => article.category?.slug === category.slug)
    )
    .map(category => category.slug);
  const paths = [...fixedPaths, ...categorySlugs.map(slug => `/${slug}/`), ...articleSlugs.map(slug => `/journal/${slug}/`)];
  const urls = paths.map(path => `  <url><loc>${escapeXml(new URL(path, origin).toString())}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
