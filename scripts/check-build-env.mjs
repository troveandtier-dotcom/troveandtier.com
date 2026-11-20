const url = process.env.PUBLIC_SUPABASE_URL?.trim() ?? '';
const key = process.env.PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

let validUrl = false;
try {
  const parsed = new URL(url);
  validUrl = parsed.protocol === 'https:' && parsed.hostname.endsWith('.supabase.co');
} catch {
  validUrl = false;
}

const validKey = key.startsWith('sb_publishable_') || key.startsWith('eyJ');

console.log('[build-config] Supabase URL present:', Boolean(url));
console.log('[build-config] Supabase URL shape valid:', validUrl);
console.log('[build-config] Supabase public key present:', Boolean(key));
console.log('[build-config] Supabase public key format recognised:', validKey);

if (!validUrl || !validKey) {
  console.error('[build-config] Required public Supabase build variables are missing or malformed. Refusing to publish a Product Desk build that cannot connect.');
  process.exit(1);
}
