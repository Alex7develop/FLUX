import type { PairingSession, SignalMessage } from '@flux/types';
import { createId } from '@flux/utils';
import {
  consumePairingSession,
  createPairingSession,
  hashPairingToken,
} from './pairing';
import type { SignalRelay } from './relay';
import type { CreatedSession, SignalingClient } from './types';

const REGISTRY = 'flux-pairing-registry';

type RegistryMessage =
  | { type: 'announce'; session: PairingSession }
  | { type: 'lookup'; tokenHash: string }
  | { type: 'consume'; session: PairingSession };

export function createRelayedSignalingClient(
  relay: SignalRelay,
  peerId = createId('peer'),
  lookupTimeoutMs = 8000,
): SignalingClient {
  const hosted = new Map<string, PairingSession>();
  const known = new Map<string, PairingSession>();
  const lookups = new Map<string, (session: PairingSession) => void>();
  const stops: Array<() => void> = [];
  let activeSessionId: string | undefined;

  stops.push(
    relay.subscribe(REGISTRY, (raw) => {
      const message = raw as RegistryMessage;
      if (message?.type === 'lookup') {
        const session = hosted.get(message.tokenHash);
        if (session) {
          void relay.publish(REGISTRY, { type: 'announce', session } satisfies RegistryMessage);
        }
        return;
      }
      if (message?.type === 'announce' || message?.type === 'consume') {
        known.set(message.session.id, message.session);
        if (message.type === 'announce') {
          lookups.get(message.session.tokenHash)?.(message.session);
        }
      }
    }),
  );

  return {
    async createSession(): Promise<CreatedSession> {
      const created = await createPairingSession();
      hosted.set(created.session.tokenHash, created.session);
      known.set(created.session.id, created.session);
      activeSessionId = created.session.id;
      await relay.publish(REGISTRY, { type: 'announce', session: created.session });
      return { id: created.session.id, token: created.token, expiresAt: created.session.expiresAt };
    },

    async joinSession(token: string): Promise<CreatedSession> {
      const tokenHash = await hashPairingToken(token);
      const found =
        [...known.values()].find((session) => session.tokenHash === tokenHash) ??
        (await new Promise<PairingSession>((resolve, reject) => {
          const timer = setTimeout(() => {
            lookups.delete(tokenHash);
            reject(new Error('This connection code expired. Create a new one.'));
          }, lookupTimeoutMs);
          lookups.set(tokenHash, (session) => {
            clearTimeout(timer);
            lookups.delete(tokenHash);
            resolve(session);
          });
          void relay.publish(REGISTRY, { type: 'lookup', tokenHash });
        }));

      const consumed = consumePairingSession(found);
      hosted.delete(consumed.tokenHash);
      known.set(consumed.id, consumed);
      activeSessionId = consumed.id;
      await relay.publish(REGISTRY, { type: 'consume', session: consumed });
      return { id: consumed.id, token, expiresAt: consumed.expiresAt };
    },

    async sendSignal(message: SignalMessage) {
      const sessionId = message.sessionId || activeSessionId;
      if (!sessionId) {
        throw new Error("We couldn't connect these devices. Try again.");
      }
      await relay.publish(`flux-signal:${sessionId}`, message);
    },

    onSignal(handler) {
      if (!activeSessionId) {
        return () => undefined;
      }
      const stop = relay.subscribe(`flux-signal:${activeSessionId}`, (raw) => {
        const message = raw as SignalMessage;
        if (message?.from && message.from !== peerId) {
          handler(message);
        }
      });
      stops.push(stop);
      return stop;
    },

    close() {
      for (const stop of stops) {
        stop();
      }
    },
  };
}
