import type { ItemType } from '@flux/types';

export interface Understanding {
  type: ItemType;
  title: string;
  summary: string;
  entities: Array<{ type: string; name: string }>;
  actions: Array<{ id: string; label: string }>;
}

export interface AIProcessor {
  analyzeText(input: string): Promise<Understanding>;
  analyzeImage(input: { mimeType: string; fileName: string; text?: string }): Promise<Understanding>;
  analyzeDocument(input: { mimeType: string; fileName: string }): Promise<Understanding>;
  analyzeUrl(input: string): Promise<Understanding>;
}
