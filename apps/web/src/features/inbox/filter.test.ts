import { describe, expect, it } from 'vitest';
import { filterInbox, inboxKind } from './filter';

describe('inboxKind', () => {
  it('groups screenshots with images and urls as links', () => {
    expect(inboxKind({ type: 'screenshot' })).toBe('image');
    expect(inboxKind({ type: 'image' })).toBe('image');
    expect(inboxKind({ type: 'url' })).toBe('link');
    expect(inboxKind({ type: 'pdf' })).toBe('document');
    expect(inboxKind({ type: 'text' })).toBe('note');
  });
});

describe('filterInbox', () => {
  const items = [
    { id: '1', title: 'shot.png', type: 'screenshot' as const },
    { id: '2', title: 'notes', type: 'text' as const },
    { id: '3', title: 'https://flux.app', type: 'url' as const },
  ];

  it('returns everything for all', () => {
    expect(filterInbox(items, 'all').map((item) => item.id)).toEqual(['1', '2', '3']);
  });

  it('keeps only images', () => {
    expect(filterInbox(items, 'image').map((item) => item.id)).toEqual(['1']);
  });
});
