import { describe, expect, it } from 'vitest';
import { buildItemGraph, searchItems } from './build';

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
  },
];

describe('buildItemGraph', () => {
  it('connects items and entities to FLUX', () => {
    const graph = buildItemGraph(items);
    expect(graph.nodes.some((node) => node.kind === 'flux')).toBe(true);
    expect(graph.nodes.some((node) => node.label === 'linear.app')).toBe(true);
    expect(graph.edges.some((edge) => edge.kind === 'site')).toBe(true);
  });
});

describe('searchItems', () => {
  it('filters by title, type, or summary', () => {
    expect(searchItems(items, 'receipt')).toHaveLength(1);
    expect(searchItems(items, 'link')).toHaveLength(1);
    expect(searchItems(items, '')).toHaveLength(2);
  });
});
