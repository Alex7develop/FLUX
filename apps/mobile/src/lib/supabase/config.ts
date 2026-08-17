export interface SupabaseBoundary {
  url: string | undefined;
  publishableKey: string | undefined;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseBoundary {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return {
    url: url || undefined,
    publishableKey: publishableKey || undefined,
    isConfigured: Boolean(url && publishableKey),
  };
}
