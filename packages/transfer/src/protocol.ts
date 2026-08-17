import type { TransferManifest } from '@flux/types';
import { TransferManifestSchema } from '@flux/validation';

export type ControlMessage =
  | { type: 'manifest'; manifest: TransferManifest }
  | { type: 'chunk'; transferId: string; index: number; total: number }
  | { type: 'complete'; transferId: string }
  | { type: 'ack'; transferId: string; index: number }
  | { type: 'ack-complete'; transferId: string };

export function encodeControl(message: ControlMessage): string {
  return JSON.stringify(message);
}

export function decodeControl(raw: string): ControlMessage {
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || !('type' in parsed)) {
    throw new Error("The transfer didn't finish. Try again.");
  }

  const message = parsed as ControlMessage;
  if (message.type === 'manifest') {
    return { type: 'manifest', manifest: TransferManifestSchema.parse(message.manifest) };
  }
  return message;
}
