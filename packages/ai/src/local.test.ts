import { describe, expect, it } from 'vitest';
import { LocalAIProcessor, understandFile } from './local';

const processor = new LocalAIProcessor();

describe('LocalAIProcessor', () => {
  it('reads a contact from text', async () => {
    const result = await processor.analyzeText('Ada Lovelace ada@flux.dev +1 202 555 0147');
    expect(result.type).toBe('contact');
    expect(result.entities.some((entity) => entity.type === 'email')).toBe(true);
  });

  it('reads a receipt amount', async () => {
    const result = await processor.analyzeText('Roaster Coffee €42.80');
    expect(result.type).toBe('receipt');
    expect(result.actions[0]?.id).toBe('save-expense');
  });

  it('reads a URL', async () => {
    const result = await processor.analyzeUrl('https://www.linear.app/changelog');
    expect(result.type).toBe('url');
    expect(result.title).toBe('linear.app');
  });
});

describe('understandFile', () => {
  it('routes images and pasted URLs', async () => {
    const image = await understandFile(processor, {
      fileName: 'Screenshot 2026-08-18.png',
      mimeType: 'image/png',
    });
    expect(image.type).toBe('screenshot');

    const link = await understandFile(processor, {
      fileName: 'pasted.txt',
      mimeType: 'text/plain',
      text: 'https://flux.dev',
    });
    expect(link.type).toBe('url');
  });
});
