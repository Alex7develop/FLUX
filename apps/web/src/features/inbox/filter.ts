import type { ItemType } from '@flux/types';

export type InboxKind = 'image' | 'document' | 'link' | 'note';
export type InboxFilter = 'all' | InboxKind;

export function inboxKind(item: { type?: ItemType; mimeType?: string }): InboxKind {
  if (item.type === 'url') {
    return 'link';
  }
  if (item.type === 'image' || item.type === 'screenshot' || item.mimeType?.startsWith('image/')) {
    return 'image';
  }
  if (item.type === 'pdf' || item.type === 'document' || item.mimeType?.includes('pdf')) {
    return 'document';
  }
  return 'note';
}

export function filterInbox<T extends { type?: ItemType; mimeType?: string }>(
  items: T[],
  filter: InboxFilter,
): T[] {
  if (filter === 'all') {
    return items;
  }
  return items.filter((item) => inboxKind(item) === filter);
}
