import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';

function toBytes(data: BufferSource): Uint8Array {
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
}

export async function sha256Hex(data: BufferSource): Promise<string> {
  const bytes = toBytes(data);
  if (globalThis.crypto?.subtle) {
    try {
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return bytesToHex(new Uint8Array(digest));
    } catch {
      // HTTP LAN origins are not a secure context; SubtleCrypto is missing.
    }
  }
  return bytesToHex(sha256(bytes));
}
