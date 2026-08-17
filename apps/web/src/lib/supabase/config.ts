export interface SupabaseBoundary {
  url: string | undefined;
  publishableKey: string | undefined;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseBoundary {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  return {
    url: url || undefined,
    publishableKey: publishableKey || undefined,
    isConfigured: Boolean(url && publishableKey),
  };
}
