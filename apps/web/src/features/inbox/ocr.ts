const MIN_OCR_BYTES = 20_000;

export async function recognizeImageText(input: { mimeType: string; bytes: ArrayBuffer }): Promise<string | undefined> {
  if (!input.mimeType.startsWith('image/') || input.bytes.byteLength < MIN_OCR_BYTES) {
    return undefined;
  }

  try {
    const { recognize } = await import('tesseract.js');
    const blob = new Blob([input.bytes], { type: input.mimeType });
    const { data } = await recognize(blob, 'eng');
    const text = data.text?.replace(/\s+/g, ' ').trim();
    return text || undefined;
  } catch {
    return undefined;
  }
}
