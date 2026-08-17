export interface FileChunk {
  transferId: string;
  index: number;
  total: number;
  payload: ArrayBuffer;
}
