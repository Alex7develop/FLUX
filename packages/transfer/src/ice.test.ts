import { describe, expect, it } from 'vitest';
import { resolveIceServers } from './ice';

describe('resolveIceServers', () => {
  it('always includes a STUN server', () => {
    expect(resolveIceServers()[0]?.urls).toBe('stun:stun.l.google.com:19302');
  });

  it('adds TURN only when credentials are present', () => {
    expect(resolveIceServers({ turnUrl: 'turn:relay.example' })).toHaveLength(1);

    const servers = resolveIceServers({
      turnUrl: 'turn:relay.example',
      turnUsername: 'flux',
      turnCredential: 'secret',
    });

    expect(servers).toHaveLength(2);
    expect(servers[1]).toMatchObject({
      urls: 'turn:relay.example',
      username: 'flux',
    });
  });
});
