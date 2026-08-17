import { describe, expect, it } from 'vitest';
import {
  PAIRING_TTL_MS,
  consumePairingSession,
  createPairingSession,
  generatePairingToken,
  hashPairingToken,
} from './pairing';

describe('generatePairingToken', () => {
  it('creates a 6-character unambiguous code', () => {
    const token = generatePairingToken(() => 0.5);
    expect(token).toHaveLength(6);
    expect(token).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/);
  });
});

describe('createPairingSession', () => {
  it('returns a session that stores only the token hash', async () => {
    const { session, token } = await createPairingSession(1_700_000_000_000);
    expect(token).toHaveLength(6);
    expect(session.tokenHash).toBe(await hashPairingToken(token));
    expect(session.tokenHash).not.toBe(token);
    expect(Date.parse(session.expiresAt) - Date.parse(session.createdAt)).toBe(
      PAIRING_TTL_MS,
    );
  });
});

describe('consumePairingSession', () => {
  it('marks a valid session as consumed', async () => {
    const { session } = await createPairingSession(1_700_000_000_000);
    const consumed = consumePairingSession(session, 1_700_000_000_000 + 1_000);
    expect(consumed.consumedAt).toBeDefined();
  });

  it('rejects an expired session', async () => {
    const { session } = await createPairingSession(1_700_000_000_000);
    expect(() =>
      consumePairingSession(session, 1_700_000_000_000 + PAIRING_TTL_MS + 1),
    ).toThrow(/expired/i);
  });

  it('rejects a session that was already used', async () => {
    const { session } = await createPairingSession(1_700_000_000_000);
    const consumed = consumePairingSession(session, 1_700_000_000_000 + 1);
    expect(() => consumePairingSession(consumed, 1_700_000_000_000 + 2)).toThrow(
      /used/i,
    );
  });
});
