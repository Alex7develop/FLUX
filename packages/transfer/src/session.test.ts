import { describe, expect, it } from 'vitest';
import { checksumFailedError } from '@flux/types';
import { createLoopbackPair } from './loopback';
import { assertChecksum } from './hash';
import { receiveTransfer, sendTransfer } from './session';

describe('transfer session', () => {
  it('moves bytes from sender to receiver and verifies the checksum', async () => {
    const { a, b } = createLoopbackPair();
    const payload = new TextEncoder().encode('pairing-to-datachannel').buffer;

    const received = receiveTransfer(b);
    const manifest = await sendTransfer(a, {
      bytes: payload,
      fileName: 'card.txt',
      mimeType: 'text/plain',
      sessionId: 'session_1',
      itemId: 'item_1',
      chunkSize: 6,
    });
    const result = await received;

    expect(result.manifest.sha256).toBe(manifest.sha256);
    expect(result.manifest.fileName).toBe('card.txt');
    expect(new TextDecoder().decode(result.bytes)).toBe('pairing-to-datachannel');
  });
});

describe('assertChecksum', () => {
  it('rejects bytes that do not match the manifest hash', async () => {
    await expect(
      assertChecksum(new TextEncoder().encode('tampered').buffer, 'a'.repeat(64)),
    ).rejects.toMatchObject({ code: checksumFailedError.code });
  });
});
