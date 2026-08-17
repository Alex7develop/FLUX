import { checksumFailedError, type FluxError } from '@flux/types';

export async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new Uint8Array(data));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function assertChecksum(bytes: ArrayBuffer, expected: string): Promise<void> {
  const actual = await sha256Hex(bytes);
  if (actual !== expected) {
    const error: FluxError = { ...checksumFailedError };
    throw error;
  }
}
