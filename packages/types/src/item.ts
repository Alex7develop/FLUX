export type ItemType =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'document'
  | 'text'
  | 'url'
  | 'contact'
  | 'screenshot'
  | 'receipt'
  | 'unknown';

export type ItemStatus = 'received' | 'processing' | 'ready' | 'failed' | 'archived';

export type StorageMode = 'local' | 'cloud' | 'p2p';

export interface FluxItem {
  id: string;
  ownerId: string;
  type: ItemType;
  title?: string;
  originalName?: string;
  mimeType?: string;
  sizeBytes?: number;
  sourceDeviceId?: string;
  storageMode: StorageMode;
  storagePath?: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}
