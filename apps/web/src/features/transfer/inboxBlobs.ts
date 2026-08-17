const blobs = new Map<string, Blob>();

export function storeInboxBlob(id: string, blob: Blob): void {
  blobs.set(id, blob);
}

export function getInboxBlob(id: string): Blob | undefined {
  return blobs.get(id);
}
