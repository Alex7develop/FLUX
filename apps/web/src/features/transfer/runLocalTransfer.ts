import { createLoopbackPair, receiveTransfer, sendTransfer } from '@flux/transfer';
import type { ReceivedTransfer } from '@flux/transfer';

interface LocalTransferInput {
  bytes: ArrayBuffer;
  fileName: string;
  mimeType: string;
  sessionId: string;
  itemId: string;
}

export async function runLocalTransfer(input: LocalTransferInput): Promise<ReceivedTransfer> {
  const { a, b } = createLoopbackPair();
  const incoming = receiveTransfer(b);
  await sendTransfer(a, input);
  return incoming;
}
