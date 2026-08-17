import { describe, expect, it } from 'vitest';
import { createMemoryRelay } from './relay';
import { createRelayedSignalingClient } from './relayed';

describe('relayed signaling', () => {
  it('pairs two clients over a shared relay', async () => {
    const relay = createMemoryRelay();
    const host = createRelayedSignalingClient(relay, 'host');
    const guest = createRelayedSignalingClient(relay, 'guest');

    const created = await host.createSession();
    const joined = await guest.joinSession(created.token);
    expect(joined.id).toBe(created.id);

    const received: string[] = [];
    guest.onSignal((message) => {
      if (message.type === 'offer') {
        received.push(String(message.payload));
      }
    });

    await host.sendSignal({
      sessionId: created.id,
      from: 'host',
      type: 'offer',
      payload: 'sdp',
    });

    expect(received).toEqual(['sdp']);
  });
});
