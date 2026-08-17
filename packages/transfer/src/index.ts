export interface TransferTransport {
  connect(): Promise<void>;
  send(): Promise<void>;
  close(): void;
}
