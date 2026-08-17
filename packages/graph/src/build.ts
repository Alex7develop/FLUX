import type { GraphEdge, GraphNode } from './types';

export interface GraphItem {
  id: string;
  title: string;
  type?: string;
  entities?: Array<{ type: string; name: string }>;
}

export function buildItemGraph(items: GraphItem[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [{ id: 'flux', kind: 'flux', label: 'FLUX' }];
  const edges: GraphEdge[] = [];

  for (const item of items) {
    nodes.push({ id: item.id, kind: 'item', label: item.title });
    edges.push({ id: `flux-${item.id}`, from: 'flux', to: item.id, kind: 'received' });

    for (const entity of item.entities ?? []) {
      const entityId = `ent:${entity.type}:${entity.name.toLowerCase()}`;
      if (!nodes.some((node) => node.id === entityId)) {
        nodes.push({ id: entityId, kind: 'entity', label: entity.name });
      }
      edges.push({
        id: `${item.id}-${entityId}`,
        from: item.id,
        to: entityId,
        kind: entity.type,
      });
    }
  }

  return { nodes, edges };
}

export function searchItems<T extends { title: string; summary?: string; type?: string }>(
  items: T[],
  query: string,
): T[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return items;
  }
  return items.filter((item) =>
    [item.title, item.summary, item.type].some((value) => value?.toLowerCase().includes(needle)),
  );
}
