import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildItemGraph, orbitGraph, relatedItemIds } from '@flux/graph';
import { connectionPoint, FluxConnections } from '@flux/ui';
import { useFluxStore } from '../store/useFluxStore';

const WIDTH = 720;
const HEIGHT = 520;

export function GraphPage() {
  const inbox = useFluxStore((state) => state.inbox);
  const visualState = useFluxStore((state) => state.visualState);
  const [focus, setFocus] = useState<string | null>(null);
  const graph = useMemo(() => buildItemGraph(inbox), [inbox]);
  const laidOut = useMemo(() => orbitGraph(graph.nodes), [graph.nodes]);
  const related = useMemo(() => (focus ? relatedItemIds(graph, focus) : []), [focus, graph]);
  const connectedIds = useMemo(() => {
    if (!focus) {
      return null;
    }
    const ids = new Set<string>([focus, ...related]);
    for (const edge of graph.edges) {
      if (edge.from === focus || edge.to === focus) {
        ids.add(edge.from);
        ids.add(edge.to);
      }
    }
    return ids;
  }, [focus, graph.edges, related]);

  const visibleEdges = connectedIds
    ? graph.edges.filter((edge) => connectedIds.has(edge.from) && connectedIds.has(edge.to))
    : graph.edges;

  const conceptualNodes = laidOut.map((node) => ({
    id: node.id,
    kind: node.kind === 'entity' ? ('entity' as const) : node.kind === 'item' ? ('item' as const) : ('flux' as const),
    label: node.label,
    angle: node.angle,
  }));

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl flex-col px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Connect</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Graph</h1>
      <p className="mt-4 max-w-xl text-mute">
        Amounts and dates from understood items share a node. Tap one to see what it links.
      </p>

      {inbox.length === 0 ? (
        <p className="mt-12 text-mute">Drop something first. The graph is built from Inbox, not decoration.</p>
      ) : (
        <div className="relative mt-8 w-full overflow-hidden rounded-[32px] border border-line bg-surface/40" style={{ height: HEIGHT }}>
          <FluxConnections
            nodes={conceptualNodes}
            edges={visibleEdges}
            visualState={visualState}
            width={WIDTH}
            height={HEIGHT}
          />
          {conceptualNodes.map((node) => {
            const point = connectionPoint(node, WIDTH, HEIGHT);
            const active = !connectedIds || connectedIds.has(node.id);
            return (
              <button
                key={node.id}
                type="button"
                data-testid={`graph-node-${node.kind}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-xs transition-opacity ${
                  node.kind === 'flux'
                    ? 'border-accent text-ink'
                    : node.kind === 'entity'
                      ? 'border-line text-mute'
                      : 'border-line text-ink'
                }`}
                style={{
                  left: `${(point.x / WIDTH) * 100}%`,
                  top: `${(point.y / HEIGHT) * 100}%`,
                  opacity: active ? 1 : 0.28,
                }}
                onClick={() => setFocus((current) => (current === node.id ? null : node.id))}
              >
                {node.label}
              </button>
            );
          })}
        </div>
      )}

      {related.length > 0 ? (
        <ul className="mt-8 grid gap-2">
          {related.map((id) => {
            const item = inbox.find((entry) => entry.id === id);
            if (!item) {
              return null;
            }
            return (
              <li key={id}>
                <Link to="/app/inbox" className="block rounded-[24px] border border-line bg-surface/70 px-5 py-4">
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-8 text-center font-mono text-xs text-mute">
          {graph.edges.length} connections
        </p>
      )}
    </main>
  );
}
