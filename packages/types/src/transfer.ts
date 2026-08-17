export interface TransferManifest {
  id: string;
  sessionId: string;
  itemId: string;
  fileName: string;
  mimeType: string;
  size: number;
  sha256: string;
  chunkSize: number;
  chunkCount: number;
  createdAt: string;
}
