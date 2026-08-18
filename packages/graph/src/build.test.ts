import { describe, expect, it } from 'vitest';
import { buildItemGraph, relatedItemIds, searchItems } from './build';

const items = [
  {
    id: 'item_1',
    title: 'linear.app',
    type: 'url',
    summary: 'A link to come back to.',
    entities: [{ type: 'site', name: 'linear.app' }],
  },
  {
    id: 'item_2',
    title: '€42.80',
    type: 'receipt',
    summary: 'Looks like a payment.',
    entities: [
      { type: 'amount', name: '€42.80' },
      { type: 'date', name: '10.08.2026' },
    ],
  },
  {
    id: 'item_3',
    title: '189 руб. 63 коп.',
    type: 'receipt',
    summary: 'Looks like a payment.',
    entities: [
      { type: 'amount', name: '189 руб. 63 коп.' },
      { type: 'date', name: '10.08.2026' },
    ],
  },
];

describe('buildItemGraph', () => {
  it('connects items and entities to FLUX', () => {
    const graph = buildItemGraph(items);
    expect(graph.nodes.some((node) => node.kind === 'flux')).toBe(true);
    expect(graph.nodes.some((node) => node.label === 'linear.app')).toBe(true);
    expect(graph.edges.some((edge) => edge.kind === 'site')).toBe(true);
  });

  it('reuses one entity node when two receipts share a date', () => {
    const graph = buildItemGraph(items);
    const dates = graph.nodes.filter((node) => node.label === '10.08.2026');
    expect(dates).toHaveLength(1);
    const dateId = dates[0]?.id ?? '';
    const intoDate = graph.edges.filter((edge) => edge.to === dateId);
    expect(intoDate).toHaveLength(2);
  });
});

describe('searchItems', () => {
  it('filters by title, type, summary, or entity', () => {
    expect(searchItems(items, 'receipt')).toHaveLength(2);
    expect(searchItems(items, 'link')).toHaveLength(1);
    expect(searchItems(items, '10.08.2026')).toHaveLength(2);
    expect(searchItems(items, '189')).toHaveLength(1);
    expect(searchItems(items, '')).toHaveLength(3);
  });
});

describe('relatedItemIds', () => {
  it('returns items attached to an entity', () => {
    const graph = buildItemGraph(items);
    const dateId = graph.nodes.find((node) => node.label === '10.08.2026')?.id ?? '';
    expect(relatedItemIds(graph, dateId).sort()).toEqual(['item_2', 'item_3']);
  });
});
