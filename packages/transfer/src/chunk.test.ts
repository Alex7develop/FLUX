import { describe, expect, it } from 'vitest';
import { assembleChunks, splitBytes } from './chunk';
import { createManifest } from './manifest';
import { sha256Hex } from './hash';

describe('splitBytes / assembleChunks', () => {
  it('splits a payload into ordered chunks and reassembles it', () => {
    const bytes = new TextEncoder().encode('FLUX-transfer-bytes').buffer;
    const parts = splitBytes(bytes, 8);

    expect(parts).toHaveLength(3);
    expect(new Uint8Array(assembleChunks(parts))).toEqual(new Uint8Array(bytes));
  });

  it('keeps a single chunk when the file is smaller than the chunk size', () => {
    const bytes = new Uint8Array([1, 2, 3]).buffer;
    const parts = splitBytes(bytes, 64);

    expect(parts).toHaveLength(1);
    expect(new Uint8Array(parts[0] ?? new ArrayBuffer(0))).toEqual(new Uint8Array([1, 2, 3]));
  });
});

describe('createManifest', () => {
  it('describes chunk count and checksum', async () => {
    const bytes = new TextEncoder().encode('hello flux').buffer;
    const manifest = await createManifest({
      bytes,
      fileName: 'note.txt',
      mimeType: 'text/plain',
      sessionId: 'session_1',
      itemId: 'item_1',
      chunkSize: 4,
      now: '2026-08-18T00:00:00.000Z',
    });

    expect(manifest.chunkCount).toBe(3);
    expect(manifest.size).toBe(10);
    expect(manifest.sha256).toBe(await sha256Hex(bytes));
    expect(manifest.fileName).toBe('note.txt');
  });
});
