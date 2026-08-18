import type { Understanding } from './understanding';
import type { AIProcessor } from './understanding';

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE = /\+?\d[\d\s().-]{7,}\d/g;
const DATE_IN_VALUE = /\d{1,2}\.\d{2}\.\d{4}/;
const PAYMENT =
  /сч[её]т|оплат|квитанц|приходн|накладн|invoice|receipt|руб|₽|\bкоп\b/i;
const URL_PATTERN = /^https?:\/\/\S+$/i;
const MONEY =
  /(?:€|\$|£|₽)\s?\d+(?:[.,]\d{2})?|\d+(?:[.,]\d{2})?\s?(?:eur|usd|gbp)|(\d+)\s*руб\.?(?:\s*(\d+)\s*коп)?/i;
const WRITTEN_DATE =
  /\b(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+(\d{4})/i;
const DOTTED_DATE = /(?<!\d)(0?[1-9]|[12]\d|3[01])\.(0?[1-9]|1[0-2])\.((?:19|20)\d{2})(?!\d)/;
const RU_MONTHS: Record<string, string> = {
  января: '01',
  февраля: '02',
  марта: '03',
  апреля: '04',
  мая: '05',
  июня: '06',
  июля: '07',
  августа: '08',
  сентября: '09',
  октября: '10',
  ноября: '11',
  декабря: '12',
};

function extractEmail(text: string): string | undefined {
  return text.match(EMAIL)?.[0];
}

function extractPhone(text: string): string | undefined {
  const candidates = text.match(PHONE) ?? [];
  return candidates.find((value) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 && !DATE_IN_VALUE.test(value);
  });
}

function extractDate(text: string): string | undefined {
  const written = text.match(WRITTEN_DATE);
  if (written?.[1] && written[2] && written[3]) {
    const month = RU_MONTHS[written[2].toLowerCase()];
    if (month) {
      return `${written[1].padStart(2, '0')}.${month}.${written[3]}`;
    }
  }
  const dotted = text.match(DOTTED_DATE);
  if (!dotted?.[1] || !dotted[2] || !dotted[3]) {
    return undefined;
  }
  return `${dotted[1].padStart(2, '0')}.${dotted[2].padStart(2, '0')}.${dotted[3]}`;
}

function extractAmount(text: string): string | undefined {
  const match = text.match(MONEY);
  if (!match) {
    return undefined;
  }
  if (match[1]) {
    return match[2] ? `${match[1]} руб. ${match[2]} коп.` : `${match[1]} руб.`;
  }
  return match[0];
}

function ocrLooksUseful(text: string): boolean {
  if (PAYMENT.test(text) || EMAIL.test(text) || extractAmount(text) || extractDate(text)) {
    return true;
  }
  const words = text.match(/[A-Za-zА-Яа-яЁё]{4,}/g) ?? [];
  const cyrillicWords = words.filter((word) => /[А-Яа-яЁё]/.test(word));
  if (cyrillicWords.length >= 3) {
    return true;
  }
  return words.length >= 6 && !/[~|]/.test(text);
}

function receiptUnderstanding(input: { amount?: string; date?: string }): Understanding {
  const amount = input.amount ?? 'Payment';
  return {
    type: 'receipt',
    title: amount,
    summary: 'Looks like a payment.',
    entities: [
      ...(input.amount ? [{ type: 'amount', name: input.amount }] : []),
      ...(input.date ? [{ type: 'date', name: input.date }] : []),
    ],
    actions: [{ id: 'save-expense', label: 'Save expense' }],
  };
}

export class LocalAIProcessor implements AIProcessor {
  async analyzeText(input: string): Promise<Understanding> {
    const text = input.trim();
    if (URL_PATTERN.test(text)) {
      return this.analyzeUrl(text);
    }

    const amount = extractAmount(text);
    const date = extractDate(text);
    if (PAYMENT.test(text) || amount) {
      return receiptUnderstanding({ amount, date });
    }

    const email = extractEmail(text);
    const phone = extractPhone(text);
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

    return {
      type: 'text',
      title: text.slice(0, 48) || 'Note',
      summary: 'Saved as a note.',
      entities: date ? [{ type: 'date', name: date }] : [],
      actions: [{ id: 'save', label: 'Save' }],
    };
  }

  async analyzeImage(input: { mimeType: string; fileName: string; text?: string }): Promise<Understanding> {
    const ocr = input.text?.trim();
    const usable = ocr && ocrLooksUseful(ocr) ? ocr : undefined;
    if (usable) {
      const fromText = await this.analyzeText(usable);
      if (fromText.type !== 'text') {
        return {
          ...fromText,
          summary: `${fromText.summary} Read from the image.`,
        };
      }
    }

    const screenshot = /screenshot|screen shot/i.test(input.fileName);
    return {
      type: screenshot ? 'screenshot' : 'image',
      title: input.fileName,
      summary: usable?.slice(0, 140) || (screenshot ? 'A captured screen.' : 'An image.'),
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
