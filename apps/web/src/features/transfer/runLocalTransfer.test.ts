import { describe, expect, it } from 'vitest';
import { runLocalTransfer } from './runLocalTransfer';

describe('runLocalTransfer', () => {
  it('moves real bytes through the chunk protocol', async () => {
    const bytes = new TextEncoder().encode('not a demo timer').buffer;
    const result = await runLocalTransfer({
      bytes,
      fileName: 'hello.txt',
      mimeType: 'text/plain',
      sessionId: 'local',
      itemId: 'item_local',
    });

    expect(new TextDecoder().decode(result.bytes)).toBe('not a demo timer');
    expect(result.manifest.fileName).toBe('hello.txt');
    expect(result.manifest.size).toBe(16);
  });
});
