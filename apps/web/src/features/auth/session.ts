import { getSupabaseClient } from '../../lib/supabase/client';
import { getSupabaseConfig } from '../../lib/supabase/config';
import { useFluxStore } from '../../store/useFluxStore';

export function authConfigured(): boolean {
  return getSupabaseConfig().isConfigured;
}

export async function signIn(email: string, password: string): Promise<void> {
  const client = await getSupabaseClient();
  if (!client) {
    throw new Error('Accounts are not connected yet.');
  }
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error('We could not sign you in. Try again.');
  }
  useFluxStore.getState().setUserEmail(email);
}

export async function signUp(email: string, password: string): Promise<void> {
  const client = await getSupabaseClient();
  if (!client) {
    throw new Error('Accounts are not connected yet.');
  }
  const { error } = await client.auth.signUp({ email, password });
  if (error) {
    throw new Error('We could not create this account. Try again.');
  }
  useFluxStore.getState().setUserEmail(email);
}

export async function signOut(): Promise<void> {
  const client = await getSupabaseClient();
  await client?.auth.signOut();
  useFluxStore.getState().setUserEmail(null);
}
