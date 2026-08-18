import { checksumFailedError, type FluxError } from '@flux/types';
import { sha256Hex as hashHex } from '@flux/utils';

export async function sha256Hex(data: ArrayBuffer): Promise<string> {
  return hashHex(data);
}

export async function assertChecksum(bytes: ArrayBuffer, expected: string): Promise<void> {
  const actual = await sha256Hex(bytes);
  if (actual !== expected) {
    const error: FluxError = { ...checksumFailedError };
    throw error;
  }
}
