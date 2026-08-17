import type { FluxError, TransferManifest } from '@flux/types';
import { checksumFailedError, transferFailedError } from '@flux/types';
import { assembleChunks, splitBytes } from './chunk';
import { assertChecksum } from './hash';
import { createManifest } from './manifest';
import { decodeControl, encodeControl } from './protocol';
import type { TransferTransport } from './transport';

interface SendTransferInput {
  bytes: ArrayBuffer;
  fileName: string;
  mimeType: string;
  sessionId: string;
  itemId: string;
  chunkSize?: number;
}

export interface ReceivedTransfer {
  manifest: TransferManifest;
  bytes: ArrayBuffer;
}

export async function sendTransfer(
  transport: TransferTransport,
  input: SendTransferInput,
): Promise<TransferManifest> {
  const manifest = await createManifest(input);
  const chunks = splitBytes(input.bytes, manifest.chunkSize);
  const acks = new Map<number, () => void>();
  let complete: (() => void) | undefined;

  const stop = transport.onMessage((payload) => {
    if (typeof payload !== 'string') {
      return;
    }
    const message = decodeControl(payload);
    if (message.type === 'ack') {
      acks.get(message.index)?.();
    }
    if (message.type === 'ack-complete') {
      complete?.();
    }
  });

  try {
    await transport.send(encodeControl({ type: 'manifest', manifest }));

    for (const [index, chunk] of chunks.entries()) {
      const ack = new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject({ ...transferFailedError }), 10_000);
        acks.set(index, () => {
          clearTimeout(timer);
          resolve();
        });
      });
      await transport.send(
        encodeControl({
          type: 'chunk',
          transferId: manifest.id,
          index,
          total: chunks.length,
        }),
      );
      await transport.send(chunk);
      await ack;
    }

    const done = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject({ ...transferFailedError }), 10_000);
      complete = () => {
        clearTimeout(timer);
        resolve();
      };
    });
    await transport.send(encodeControl({ type: 'complete', transferId: manifest.id }));
    await done;
    return manifest;
  } finally {
    stop();
  }
}

export function receiveTransfer(
  transport: TransferTransport,
  hooks?: { onStart?: () => void },
): Promise<ReceivedTransfer> {
  return new Promise((resolve, reject) => {
    let manifest: TransferManifest | undefined;
    let pendingIndex: number | undefined;
    const parts = new Map<number, ArrayBuffer>();

    const fail = (error: FluxError) => {
      stop();
      stopClose();
      reject(error);
    };

    const stopClose = transport.onClose(() => {
      fail({ ...transferFailedError });
    });

    const stop = transport.onMessage((payload) => {
      void (async () => {
        try {
          if (typeof payload !== 'string') {
            if (pendingIndex === undefined) {
              return;
            }
            parts.set(pendingIndex, payload);
            await transport.send(
              encodeControl({
                type: 'ack',
                transferId: manifest?.id ?? '',
                index: pendingIndex,
              }),
            );
            pendingIndex = undefined;
            return;
          }

          const message = decodeControl(payload);
          if (message.type === 'manifest') {
            manifest = message.manifest;
            hooks?.onStart?.();
            return;
          }
          if (message.type === 'chunk') {
            pendingIndex = message.index;
            return;
          }
          if (message.type === 'complete') {
            if (!manifest) {
              fail({ ...transferFailedError });
              return;
            }
            const bytes = assembleChunks(
              Array.from({ length: manifest.chunkCount }, (_, index) => {
                const part = parts.get(index);
                if (!part) {
                  throw { ...transferFailedError };
                }
                return part;
              }),
            );
            await assertChecksum(bytes, manifest.sha256);
            await transport.send(encodeControl({ type: 'ack-complete', transferId: manifest.id }));
            stop();
            stopClose();
            resolve({ manifest, bytes });
          }
        } catch (error) {
          const fluxError =
            error && typeof error === 'object' && 'code' in error
              ? (error as FluxError)
              : checksumFailedError;
          fail(fluxError);
        }
      })();
    });
  });
}
