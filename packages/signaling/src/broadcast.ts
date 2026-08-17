import type { PairingSession, SignalMessage } from '@flux/types';
import { createId } from '@flux/utils';
import {
  consumePairingSession,
  createPairingSession,
  hashPairingToken,
} from './pairing';
import type { CreatedSession, SignalingClient } from './types';

const REGISTRY = 'flux-pairing-registry';

type RegistryMessage =
  | { type: 'announce'; session: PairingSession }
  | { type: 'lookup'; tokenHash: string }
  | { type: 'consume'; session: PairingSession };

function openChannel(name: string): BroadcastChannel {
  return new BroadcastChannel(name);
}

export function createBroadcastSignalingClient(peerId = createId('peer')): SignalingClient {
  const registry = openChannel(REGISTRY);
  const hosted = new Map<string, PairingSession>();
  const known = new Map<string, PairingSession>();
  const lookups = new Map<string, (session: PairingSession) => void>();
  const signalStops: Array<() => void> = [];
  let activeSessionId: string | undefined;
  let signalChannel: BroadcastChannel | undefined;

  registry.onmessage = (event: MessageEvent<RegistryMessage>) => {
    const message = event.data;
    if (message?.type === 'lookup') {
      const session = hosted.get(message.tokenHash);
      if (session) {
        registry.postMessage({ type: 'announce', session } satisfies RegistryMessage);
      }
      return;
    }
    if (message?.type === 'announce' || message?.type === 'consume') {
      known.set(message.session.id, message.session);
      if (message.type === 'announce') {
        lookups.get(message.session.tokenHash)?.(message.session);
      }
    }
  };

  const listen = (sessionId: string, handler: (message: SignalMessage) => void) => {
    const current = openChannel(`flux-signal:${sessionId}`);
    const onMessage = (event: MessageEvent<SignalMessage>) => {
      const payload = event.data;
      if (payload?.from && payload.from !== peerId) {
        handler(payload);
      }
    };
    current.addEventListener('message', onMessage);
    signalStops.push(() => {
      current.removeEventListener('message', onMessage);
      current.close();
    });
    return current;
  };

  return {
    async createSession(): Promise<CreatedSession> {
      const created = await createPairingSession();
      hosted.set(created.session.tokenHash, created.session);
      known.set(created.session.id, created.session);
      activeSessionId = created.session.id;
      registry.postMessage({ type: 'announce', session: created.session } satisfies RegistryMessage);
      return { id: created.session.id, token: created.token, expiresAt: created.session.expiresAt };
    },

    async joinSession(token: string): Promise<CreatedSession> {
      const tokenHash = await hashPairingToken(token);
      const found =
        [...known.values()].find((session) => session.tokenHash === tokenHash) ??
        (await new Promise<PairingSession>((resolve, reject) => {
          const timer = window.setTimeout(() => {
            lookups.delete(tokenHash);
            reject(new Error('This connection code expired. Create a new one.'));
          }, 2000);
          lookups.set(tokenHash, (session) => {
            window.clearTimeout(timer);
            lookups.delete(tokenHash);
            resolve(session);
          });
          registry.postMessage({ type: 'lookup', tokenHash } satisfies RegistryMessage);
        }));

      const consumed = consumePairingSession(found);
      hosted.delete(consumed.tokenHash);
      known.set(consumed.id, consumed);
      activeSessionId = consumed.id;
      registry.postMessage({ type: 'consume', session: consumed } satisfies RegistryMessage);
      return { id: consumed.id, token, expiresAt: consumed.expiresAt };
    },

    async sendSignal(message: SignalMessage) {
      const sessionId = message.sessionId || activeSessionId;
      if (!sessionId) {
        throw new Error("We couldn't connect these devices. Try again.");
      }
      const outbound = signalChannel ?? openChannel(`flux-signal:${sessionId}`);
      outbound.postMessage(message);
      if (!signalChannel) {
        outbound.close();
      }
    },

    onSignal(handler) {
      if (!activeSessionId) {
        return () => undefined;
      }
      signalChannel = listen(activeSessionId, handler);
      return () => {
        signalChannel = undefined;
      };
    },

    close() {
      registry.close();
      signalChannel?.close();
      for (const stop of signalStops) {
        stop();
      }
    },
  };
}
