import { describe, expect, it } from 'vitest';
import { createInMemorySignalingHub } from './in-memory';

describe('in-memory signaling', () => {
  it('lets a guest join a host session and exchange signals', async () => {
    const hub = createInMemorySignalingHub();
    const host = hub.createClient('host');
    const guest = hub.createClient('guest');

    const created = await host.createSession();
    const joined = await guest.joinSession(created.token);

    expect(joined.id).toBe(created.id);

    const received: string[] = [];
    const stop = await guest.onSignal((message) => {
      if (message.type === 'offer') {
        received.push(String(message.payload));
      }
    });

    await host.sendSignal({
      sessionId: created.id,
      from: 'host',
      type: 'offer',
      payload: 'sdp-offer',
    });

    expect(received).toEqual(['sdp-offer']);
    stop();
  });

  it('does not allow a second join after the session is consumed', async () => {
    const hub = createInMemorySignalingHub();
    const host = hub.createClient('host');
    const guest = hub.createClient('guest');
    const extra = hub.createClient('extra');

    const created = await host.createSession();
    await guest.joinSession(created.token);

    await expect(extra.joinSession(created.token)).rejects.toThrow(/used/i);
  });
});
