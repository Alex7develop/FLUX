import { describe, expect, it } from 'vitest';
import { getInboxBlob, storeInboxBlob } from '../transfer/inboxBlobs';

describe('inbox blobs', () => {
  it('returns a stored blob by id', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    storeInboxBlob('item_persist', blob);
    const loaded = await getInboxBlob('item_persist');
    expect(loaded).toBeInstanceOf(Blob);
    expect(loaded?.size).toBe(5);
    expect(loaded?.type).toBe('text/plain');
  });
});
