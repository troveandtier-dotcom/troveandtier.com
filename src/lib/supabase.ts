import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const publishableKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && publishableKey);

export const supabase = supabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
