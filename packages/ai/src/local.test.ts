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

  it('does not treat a dotted date as a phone number', async () => {
    const result = await processor.analyzeImage({
      mimeType: 'image/png',
      fileName: 'IMG_1042.PNG',
      text: [
        'Счет на оплату',
        'ПРИХОДНЫЙ КАССОВЫЙ ОРДЕР',
        'КВИТАНЦИЯ',
        '110.08.2026',
        '10.08.2026',
        '10 августа 2026 г.',
        'Кириллов Александр Борисович',
        '189 руб. 63 коп.',
      ].join('\n'),
    });
    expect(result.type).toBe('receipt');
    expect(result.title).toMatch(/189/);
    expect(result.entities.some((entity) => entity.type === 'date' && entity.name === '10.08.2026')).toBe(
      true,
    );
    expect(result.entities.some((entity) => entity.type === 'phone')).toBe(false);
  });

  it('turns OCR text on an image into a contact', async () => {
    const result = await processor.analyzeImage({
      mimeType: 'image/png',
      fileName: 'IMG_1042.PNG',
      text: 'Ada Lovelace ada@flux.dev',
    });
    expect(result.type).toBe('contact');
    expect(result.entities.some((entity) => entity.type === 'email')).toBe(true);
  });

  it('does not show garbage OCR as the image summary', async () => {
    const result = await processor.analyzeImage({
      mimeType: 'image/png',
      fileName: 'IMG_0581.png',
      text: '. E~J 14:05 MERC 83 | | Vrsepwana nocrasoanenson Fockowrars Poa ar 18.0858 Na 8 KBUTAHUMSA',
    });
    expect(result.type).toBe('image');
    expect(result.title).toBe('IMG_0581.png');
    expect(result.summary).toBe('An image.');
    expect(result.summary).not.toMatch(/Vrsepwana|KBUTAHUMSA/);
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
