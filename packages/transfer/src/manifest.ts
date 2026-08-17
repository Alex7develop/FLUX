import type { TransferManifest } from '@flux/types';
import { createId } from '@flux/utils';
import { sha256Hex } from './hash';

export const DEFAULT_CHUNK_SIZE = 64 * 1024;

interface CreateManifestInput {
  bytes: ArrayBuffer;
  fileName: string;
  mimeType: string;
  sessionId: string;
  itemId: string;
  chunkSize?: number;
  now?: string;
}

export async function createManifest(input: CreateManifestInput): Promise<TransferManifest> {
  const chunkSize = input.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const size = input.bytes.byteLength;
  const chunkCount = Math.max(1, Math.ceil(size / chunkSize));

  return {
    id: createId('xfer'),
    sessionId: input.sessionId,
    itemId: input.itemId,
    fileName: input.fileName,
    mimeType: input.mimeType,
    size,
    sha256: await sha256Hex(input.bytes),
    chunkSize,
    chunkCount,
    createdAt: input.now ?? new Date().toISOString(),
  };
}
