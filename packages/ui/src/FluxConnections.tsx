import type { FluxVisualState } from '@flux/types';

export interface ConceptualNode {
  id: string;
  kind: 'device' | 'item' | 'entity' | 'flux';
  label: string;
  angle?: number;
}

export interface ConceptualEdge {
  id: string;
  from: string;
  to: string;
  kind: string;
}

interface FluxConnectionsProps {
  nodes: ConceptualNode[];
  edges: ConceptualEdge[];
  visualState: FluxVisualState;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

export function connectionPoint(node: ConceptualNode, width: number, height: number): Point {
  const cx = width / 2;
  const cy = height / 2;
  if (node.kind === 'flux') {
    return { x: cx, y: cy };
  }

  const angle = node.angle ?? 0;
  const radius =
    node.kind === 'entity' ? Math.min(width, height) * 0.42 : Math.min(width, height) * 0.28;
  return {
    x: cx + Math.cos((angle * Math.PI) / 180) * radius,
    y: cy + Math.sin((angle * Math.PI) / 180) * radius,
  };
}

export function FluxConnections({
  nodes,
  edges,
  visualState,
  width,
  height,
}: FluxConnectionsProps) {
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <svg
      className="flux-connections"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      data-state={visualState}
    >
      {edges.map((edge) => {
        const from = byId.get(edge.from);
        const to = byId.get(edge.to);
        if (!from || !to) {
          return null;
        }
        const start = connectionPoint(from, width, height);
        const end = connectionPoint(to, width, height);
        return (
          <line
            key={edge.id}
            className="flux-connections__line"
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
          />
        );
      })}
    </svg>
  );
}

export function satelliteLayout(
  compact: boolean,
): { nodes: ConceptualNode[]; edges: ConceptualEdge[] } {
  const specs = compact
    ? [
        { angle: -90, label: 'Phone', kind: 'device' as const },
        { angle: 30, label: 'Mac', kind: 'device' as const },
        { angle: 150, label: 'Web', kind: 'device' as const },
      ]
    : [
        { angle: -150, label: 'Phone', kind: 'device' as const },
        { angle: -90, label: 'Mac', kind: 'device' as const },
        { angle: -30, label: 'Web', kind: 'device' as const },
        { angle: 30, label: 'Note', kind: 'item' as const },
        { angle: 90, label: 'Image', kind: 'item' as const },
        { angle: 150, label: 'Link', kind: 'item' as const },
      ];

  const flux: ConceptualNode = { id: 'flux', kind: 'flux', label: 'FLUX' };
  const satellites: ConceptualNode[] = specs.map((spec) => ({
    id: `sat:${spec.angle}`,
    kind: spec.kind,
    label: spec.label,
    angle: spec.angle,
  }));

  return {
    nodes: [flux, ...satellites],
    edges: satellites.map((node) => ({
      id: `edge:${node.id}`,
      from: 'flux',
      to: node.id,
      kind: 'conceptual',
    })),
  };
}
