import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

export type PublishedArticle = {
  id: string; slug: string; title: string; excerpt: string; body_markdown: string;
  content_type: string; published_at: string | null; seo_title: string | null;
  seo_description: string | null; category: { name: string; slug: string } | null;
};
export type PublishedProduct = {
  id: string; slug: string; name: string; brand: string | null; summary: string;
  description: string; pros: string[]; limitations: string[]; evidence_type: string;
  category: { name: string; slug: string } | null;
  offers: Array<{ id: string; market: 'US'|'UK'|'CA'; currency: string; canonical_url: string;
    affiliate_url: string | null; price_amount: number | null; price_checked_at: string | null;
    retailer: { name: string; website_url: string } | null }>;
};

export async function getPublishedArticles(): Promise<PublishedArticle[]> {
  if (!db) return [];
  const { data, error } = await db.from('articles')
    .select('id,slug,title,excerpt,body_markdown,content_type,published_at,seo_title,seo_description,category:categories(name,slug)')
    .eq('status', 'published').order('published_at', { ascending: false });
  if (error) { console.error('Published article snapshot unavailable:', error.message); return []; }
  return (data || []) as unknown as PublishedArticle[];
}

export async function getPublishedProducts(): Promise<PublishedProduct[]> {
  if (!db) return [];
  const { data, error } = await db.from('products')
    .select('id,slug,name,brand,summary,description,pros,limitations,evidence_type,category:categories(name,slug),offers:product_offers(id,market,currency,canonical_url,affiliate_url,price_amount,price_checked_at,retailer:retailers(name,website_url))')
    .eq('status', 'published');
  if (error) { console.error('Published product snapshot unavailable:', error.message); return []; }
  return (data || []).map((product: any) => ({
    ...product,
    offers: (product.offers || []).filter((offer: any) => offer && offer.retailer)
  })) as PublishedProduct[];
}

export function marketFrom(value: string | undefined): 'US'|'UK'|'CA' {
  return value === 'UK' || value === 'CA' ? value : 'US';
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

// Deliberately small Markdown subset. Raw HTML is escaped; links accept only http(s) or same-site paths.
export function markdownToSafeHtml(markdown: string): string {
  const inline = (raw: string) => {
    let value = escapeHtml(raw);
    value = value.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, target) => {
      const decoded = String(target).replaceAll('&amp;', '&');
      if (!decoded.startsWith('/') && !/^https?:\/\//i.test(decoded)) return label;
      return '<a href="' + escapeHtml(decoded) + '">' + label + '</a>';
    });
    return value;
  };
  const blocks = markdown.replaceAll('\r\n', '\n').split(/\n\s*\n/);
  return blocks.map(block => {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    if (!lines.length) return '';
    if (lines.every(line => /^[-*]\s+/.test(line))) return '<ul>' + lines.map(line => '<li>' + inline(line.replace(/^[-*]\s+/, '')) + '</li>').join('') + '</ul>';
    if (lines.every(line => /^\d+\.\s+/.test(line))) return '<ol>' + lines.map(line => '<li>' + inline(line.replace(/^\d+\.\s+/, '')) + '</li>').join('') + '</ol>';
    if (lines.length === 1 && /^#{1,3}\s+/.test(lines[0])) {
      const level = Math.min(lines[0].match(/^#+/)![0].length + 1, 4);
      return '<h' + level + '>' + inline(lines[0].replace(/^#{1,3}\s+/, '')) + '</h' + level + '>';
    }
    return '<p>' + lines.map(inline).join('<br>') + '</p>';
  }).join('\n');
}
