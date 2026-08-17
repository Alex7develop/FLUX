import type { TransferTransport } from './transport';

class LoopbackTransport implements TransferTransport {
  private handlers = new Set<(payload: ArrayBuffer | string) => void>();
  private closers = new Set<() => void>();
  peer: LoopbackTransport | undefined;

  async connect(): Promise<void> {
    return undefined;
  }

  async send(payload: ArrayBuffer | string): Promise<void> {
    this.peer?.handlers.forEach((handler) => handler(payload));
  }

  onMessage(handler: (payload: ArrayBuffer | string) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  onClose(handler: () => void): () => void {
    this.closers.add(handler);
    return () => {
      this.closers.delete(handler);
    };
  }

  close(): void {
    this.handlers.clear();
    for (const closer of this.closers) {
      closer();
    }
    this.closers.clear();
  }
}

export function createLoopbackPair(): { a: TransferTransport; b: TransferTransport } {
  const a = new LoopbackTransport();
  const b = new LoopbackTransport();
  a.peer = b;
  b.peer = a;
  return { a, b };
}
