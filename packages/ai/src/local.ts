import type { Understanding } from './understanding';
import type { AIProcessor } from './understanding';

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE = /\+?\d[\d\s().-]{7,}\d/;
const MONEY = /(?:€|\$|£)\s?\d+(?:[.,]\d{2})?|\d+(?:[.,]\d{2})?\s?(?:eur|usd|gbp)/i;
const URL_PATTERN = /^https?:\/\/\S+$/i;

export class LocalAIProcessor implements AIProcessor {
  async analyzeText(input: string): Promise<Understanding> {
    const text = input.trim();
    if (URL_PATTERN.test(text)) {
      return this.analyzeUrl(text);
    }

    const email = text.match(EMAIL)?.[0];
    const phone = text.match(PHONE)?.[0];
    if (email || phone) {
      return {
        type: 'contact',
        title: email ?? phone ?? 'Contact',
        summary: 'A person you can reach.',
        entities: [
          ...(email ? [{ type: 'email', name: email }] : []),
          ...(phone ? [{ type: 'phone', name: phone }] : []),
        ],
        actions: [{ id: 'create-contact', label: 'Create contact' }],
      };
    }

    if (MONEY.test(text)) {
      const amount = text.match(MONEY)?.[0] ?? 'amount';
      return {
        type: 'receipt',
        title: amount,
        summary: 'Looks like a payment.',
        entities: [{ type: 'amount', name: amount }],
        actions: [{ id: 'save-expense', label: 'Save expense' }],
      };
    }

    return {
      type: 'text',
      title: text.slice(0, 48) || 'Note',
      summary: 'Saved as a note.',
      entities: [],
      actions: [{ id: 'save', label: 'Save' }],
    };
  }

  async analyzeImage(input: { mimeType: string; fileName: string }): Promise<Understanding> {
    const screenshot = /screenshot|screen shot/i.test(input.fileName);
    return {
      type: screenshot ? 'screenshot' : 'image',
      title: input.fileName,
      summary: screenshot ? 'A captured screen.' : 'An image.',
      entities: [],
      actions: [{ id: 'save', label: 'Save' }],
    };
  }

  async analyzeDocument(input: { mimeType: string; fileName: string }): Promise<Understanding> {
    const pdf = input.mimeType.includes('pdf') || input.fileName.toLowerCase().endsWith('.pdf');
    return {
      type: pdf ? 'pdf' : 'document',
      title: input.fileName,
      summary: pdf ? 'A PDF document.' : 'A document.',
      entities: [],
      actions: [{ id: 'save', label: 'Save' }],
    };
  }

  async analyzeUrl(input: string): Promise<Understanding> {
    let host = input;
    try {
      host = new URL(input).hostname.replace(/^www\./, '');
    } catch {
      host = input;
    }
    return {
      type: 'url',
      title: host,
      summary: 'A link to come back to.',
      entities: [{ type: 'site', name: host }],
      actions: [{ id: 'save', label: 'Save' }],
    };
  }
}

export async function understandFile(
  processor: AIProcessor,
  input: { fileName: string; mimeType: string; text?: string },
): Promise<Understanding> {
  if (input.text && /^https?:\/\//i.test(input.text.trim())) {
    return processor.analyzeUrl(input.text.trim());
  }
  if (input.mimeType.startsWith('image/')) {
    return processor.analyzeImage(input);
  }
  if (input.mimeType.includes('pdf') || input.mimeType.includes('word')) {
    return processor.analyzeDocument(input);
  }
  if (input.text) {
    return processor.analyzeText(input.text);
  }
  return processor.analyzeDocument(input);
}
