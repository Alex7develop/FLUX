import type { PairingSession } from '@flux/types';
import { pairingExpiredError } from '@flux/types';
import { createId } from '@flux/utils';

export const PAIRING_TTL_MS = 5 * 60 * 1000;
export const TOKEN_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const TOKEN_LENGTH = 6;

export function generatePairingToken(random: () => number = Math.random): string {
  let token = '';
  for (let i = 0; i < TOKEN_LENGTH; i += 1) {
    const index = Math.floor(random() * TOKEN_ALPHABET.length);
    token += TOKEN_ALPHABET[index] ?? 'A';
  }
  return token;
}

export async function hashPairingToken(token: string): Promise<string> {
  const encoded = new TextEncoder().encode(token.trim().toUpperCase());
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createPairingSession(
  now = Date.now(),
  random?: () => number,
): Promise<{ session: PairingSession; token: string }> {
  const token = generatePairingToken(random);
  const createdAt = new Date(now).toISOString();
  return {
    token,
    session: {
      id: createId('pair'),
      tokenHash: await hashPairingToken(token),
      createdAt,
      expiresAt: new Date(now + PAIRING_TTL_MS).toISOString(),
    },
  };
}

export function consumePairingSession(session: PairingSession, now = Date.now()): PairingSession {
  if (session.consumedAt) {
    throw new Error('This connection code was already used.');
  }
  if (Date.parse(session.expiresAt) <= now) {
    throw new Error(pairingExpiredError.message);
  }
  return {
    ...session,
    consumedAt: new Date(now).toISOString(),
  };
}
