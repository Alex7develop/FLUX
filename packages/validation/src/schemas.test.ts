import { describe, expect, it } from 'vitest';
import { FluxItemSchema, FluxVisualStateSchema, TransferManifestSchema } from './schemas';

describe('FluxVisualStateSchema', () => {
  it('accepts known visual states', () => {
    expect(FluxVisualStateSchema.parse('idle')).toBe('idle');
    expect(FluxVisualStateSchema.parse('processing')).toBe('processing');
    expect(FluxVisualStateSchema.parse('success')).toBe('success');
  });

  it('rejects unknown states', () => {
    expect(() => FluxVisualStateSchema.parse('uploading')).toThrow();
  });
});

describe('FluxItemSchema', () => {
  it('accepts a valid item', () => {
    const item = FluxItemSchema.parse({
      id: 'item_1',
      ownerId: 'user_1',
      type: 'screenshot',
      storageMode: 'local',
      status: 'received',
      createdAt: '2026-08-18T00:00:00.000Z',
      updatedAt: '2026-08-18T00:00:00.000Z',
    });

    expect(item.type).toBe('screenshot');
  });

  it('rejects an item without an id', () => {
    expect(() =>
      FluxItemSchema.parse({
        ownerId: 'user_1',
        type: 'text',
        storageMode: 'local',
        status: 'ready',
        createdAt: '2026-08-18T00:00:00.000Z',
        updatedAt: '2026-08-18T00:00:00.000Z',
      }),
    ).toThrow();
  });
});

describe('TransferManifestSchema', () => {
  it('rejects a malformed checksum', () => {
    expect(() =>
      TransferManifestSchema.parse({
        id: 'm1',
        sessionId: 's1',
        itemId: 'i1',
        fileName: 'note.txt',
        mimeType: 'text/plain',
        size: 12,
        sha256: 'not-a-hash',
        chunkSize: 1024,
        chunkCount: 1,
        createdAt: '2026-08-18T00:00:00.000Z',
      }),
    ).toThrow();
  });
});
