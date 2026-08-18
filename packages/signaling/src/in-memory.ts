import type { PairingSession, SignalMessage } from '@flux/types';
import {
  consumePairingSession,
  createPairingSession,
  hashPairingToken,
} from './pairing';
import type { SignalingClient } from './types';

interface HubSession {
  session: PairingSession;
  token: string;
}

export function createInMemorySignalingHub() {
  const sessions = new Map<string, HubSession>();
  const listeners = new Set<(message: SignalMessage) => void>();

  const createClient = (peerId: string): SignalingClient => {
    const localListeners = new Set<(message: SignalMessage) => void>();

    const client: SignalingClient = {
      async createSession() {
        const created = await createPairingSession();
        sessions.set(created.session.id, created);
        return { id: created.session.id, token: created.token, expiresAt: created.session.expiresAt };
      },
      async joinSession(token: string) {
        const tokenHash = await hashPairingToken(token);
        const match = [...sessions.values()].find((entry) => entry.session.tokenHash === tokenHash);
        if (!match) {
          throw new Error('This connection code expired. Create a new one.');
        }
        match.session = consumePairingSession(match.session);
        return { id: match.session.id, token, expiresAt: match.session.expiresAt };
      },
      async sendSignal(message: SignalMessage) {
        for (const listener of listeners) {
          listener(message);
        }
      },
      async onSignal(handler) {
        const wrapped = (message: SignalMessage) => {
          if (message.from !== peerId) {
            handler(message);
          }
        };
        listeners.add(wrapped);
        localListeners.add(wrapped);
        return () => {
          listeners.delete(wrapped);
          localListeners.delete(wrapped);
        };
      },
      close() {
        for (const listener of localListeners) {
          listeners.delete(listener);
        }
        localListeners.clear();
      },
    };

    return client;
  };

  return { createClient };
}
