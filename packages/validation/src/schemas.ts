import { z } from 'zod';

export const ItemTypeSchema = z.enum([
  'image',
  'video',
  'audio',
  'pdf',
  'document',
  'text',
  'url',
  'contact',
  'screenshot',
  'receipt',
  'unknown',
]);

export const ItemStatusSchema = z.enum([
  'received',
  'processing',
  'ready',
  'failed',
  'archived',
]);

export const StorageModeSchema = z.enum(['local', 'cloud', 'p2p']);

export const FluxVisualStateSchema = z.enum([
  'idle',
  'pairing',
  'connected',
  'receiving',
  'processing',
  'understood',
  'linked',
  'success',
  'error',
]);

export const DevicePlatformSchema = z.enum([
  'ios',
  'android',
  'macos',
  'windows',
  'web',
  'linux',
]);

export const FluxItemSchema = z.object({
  id: z.string().min(1),
  ownerId: z.string().min(1),
  type: ItemTypeSchema,
  title: z.string().min(1).optional(),
  originalName: z.string().min(1).optional(),
  mimeType: z.string().min(1).optional(),
  sizeBytes: z.number().nonnegative().optional(),
  sourceDeviceId: z.string().min(1).optional(),
  storageMode: StorageModeSchema,
  storagePath: z.string().min(1).optional(),
  status: ItemStatusSchema,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export const DeviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  platform: DevicePlatformSchema,
  createdAt: z.string().datetime({ offset: true }),
  lastSeenAt: z.string().datetime({ offset: true }).optional(),
});

export const TransferManifestSchema = z.object({
  id: z.string().min(1),
  sessionId: z.string().min(1),
  itemId: z.string().min(1),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
  size: z.number().nonnegative(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  chunkSize: z.number().positive(),
  chunkCount: z.number().int().positive(),
  createdAt: z.string().datetime({ offset: true }),
});

export const FluxErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  retryable: z.boolean(),
  context: z.record(z.unknown()).optional(),
});
