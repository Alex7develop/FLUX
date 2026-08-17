import { getSupabaseConfig } from './config';

type BrowserSupabase = import('@supabase/supabase-js').SupabaseClient;

let client: BrowserSupabase | null | undefined;

export async function getSupabaseClient(): Promise<BrowserSupabase | null> {
  if (client !== undefined) {
    return client;
  }

  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.publishableKey) {
    client = null;
    return null;
  }

  const { createClient } = await import('@supabase/supabase-js');
  client = createClient(config.url, config.publishableKey);
  return client;
}
