import { describe, expect, it } from 'vitest';
import { recognizeImageText } from './ocr';

describe('recognizeImageText', () => {
  it('skips tiny images so screenshots stay fast', async () => {
    const text = await recognizeImageText({
      mimeType: 'image/png',
      bytes: new Uint8Array([1, 2, 3, 4]).buffer,
    });
    expect(text).toBeUndefined();
  });
});
