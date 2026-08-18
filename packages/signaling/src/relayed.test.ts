import { describe, expect, it } from 'vitest';
import { createMemoryRelay, type SignalRelay } from './relay';
import { createRelayedSignalingClient } from './relayed';

function delayRelay(inner: SignalRelay, ms: number): SignalRelay {
  return {
    publish: (topic, message) => inner.publish(topic, message),
    async subscribe(topic, handler) {
      await new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
      return inner.subscribe(topic, handler);
    },
  };
}

describe('relayed signaling', () => {
  it('pairs two clients over a shared relay', async () => {
    const relay = createMemoryRelay();
    const host = createRelayedSignalingClient(relay, 'host');
    const guest = createRelayedSignalingClient(relay, 'guest');

    const created = await host.createSession();
    const joined = await guest.joinSession(created.token);
    expect(joined.id).toBe(created.id);

    const received: string[] = [];
    await guest.onSignal((message) => {
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

  it('does not drop an offer sent after onSignal resolves on a slow relay', async () => {
    const relay = delayRelay(createMemoryRelay(), 40);
    const host = createRelayedSignalingClient(relay, 'host');
    const guest = createRelayedSignalingClient(relay, 'guest');

    const created = await host.createSession();
    await guest.joinSession(created.token);

    const received: string[] = [];
    await guest.onSignal((message) => {
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
