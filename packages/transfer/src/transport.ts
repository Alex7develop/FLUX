export interface TransferTransport {
  connect(): Promise<void>;
  send(payload: ArrayBuffer | string): Promise<void>;
  onMessage(handler: (payload: ArrayBuffer | string) => void): () => void;
  onClose(handler: () => void): () => void;
  close(): void;
}
