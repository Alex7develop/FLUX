export type GraphNodeKind = 'device' | 'item' | 'entity' | 'flux';

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  kind: string;
}

export interface Entity {
  id: string;
  type: string;
  name: string;
  properties: Record<string, unknown>;
}

export interface Relationship {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: string;
}
