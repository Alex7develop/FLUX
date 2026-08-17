import {
  createBroadcastSignalingClient,
  createRelayedSignalingClient,
  type SignalingClient,
} from '@flux/signaling';
import { getSupabaseClient } from '../../lib/supabase/client';
import { createSupabaseRelay } from '../../lib/supabase/relay';

export async function createAppSignalingClient(peerId: string): Promise<SignalingClient> {
  const supabase = await getSupabaseClient();
  if (supabase) {
    return createRelayedSignalingClient(createSupabaseRelay(supabase), peerId);
  }
  return createBroadcastSignalingClient(peerId);
}

export function signalingMode(): 'supabase' | 'local' {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ? 'supabase'
    : 'local';
}
