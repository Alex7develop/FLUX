import { createId } from '@flux/utils';
import { createBroadcastRelay } from './relay';
import { createRelayedSignalingClient } from './relayed';
import type { SignalingClient } from './types';

export function createBroadcastSignalingClient(peerId = createId('peer')): SignalingClient {
  return createRelayedSignalingClient(createBroadcastRelay(), peerId, 2000);
}
