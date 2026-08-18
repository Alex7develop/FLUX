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

export function orbitGraph(nodes: GraphNode[]): Array<GraphNode & { angle?: number }> {
  const spread = (list: GraphNode[], start: number) =>
    list.map((node, index) => ({
      ...node,
      angle: start + (list.length === 0 ? 0 : (360 / list.length) * index),
    }));

  return [
    ...nodes.filter((node) => node.kind === 'flux'),
    ...spread(
      nodes.filter((node) => node.kind === 'item'),
      -150,
    ),
    ...spread(
      nodes.filter((node) => node.kind === 'entity'),
      15,
    ),
    ...spread(
      nodes.filter((node) => node.kind === 'device'),
      90,
    ),
  ];
}

export function searchItems<T extends {
  title: string;
  summary?: string;
  type?: string;
  entities?: Array<{ type: string; name: string }>;
}>(items: T[], query: string): T[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return items;
  }
  return items.filter((item) => {
    const fields = [
      item.title,
      item.summary,
      item.type,
      ...(item.entities ?? []).flatMap((entity) => [entity.name, entity.type]),
    ];
    return fields.some((value) => value?.toLowerCase().includes(needle));
  });
}

export function relatedItemIds(
  graph: { nodes: GraphNode[]; edges: GraphEdge[] },
  nodeId: string,
): string[] {
  const itemIds = new Set(graph.nodes.filter((node) => node.kind === 'item').map((node) => node.id));
  if (itemIds.has(nodeId)) {
    return [nodeId];
  }
  return [
    ...new Set(
      graph.edges
        .filter((edge) => edge.from === nodeId || edge.to === nodeId)
        .map((edge) => (edge.from === nodeId ? edge.to : edge.from))
        .filter((id) => itemIds.has(id)),
    ),
  ];
}
