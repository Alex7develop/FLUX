import { useMemo } from 'react';
import { buildItemGraph } from '@flux/graph';
import { useFluxStore } from '../store/useFluxStore';

export function GraphPage() {
  const inbox = useFluxStore((state) => state.inbox);
  const graph = useMemo(() => buildItemGraph(inbox), [inbox]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Connect</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Graph</h1>
      <p className="mt-4 max-w-xl text-mute">
        Built from items FLUX has already understood. This is not a decorative canvas.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {graph.nodes.map((node) => (
          <span
            key={node.id}
            className="rounded-full border border-line px-4 py-2 text-sm"
            data-kind={node.kind}
          >
            {node.label}
          </span>
        ))}
      </div>
      <p className="mt-8 text-center font-mono text-xs text-mute">
        {graph.edges.length} connections
      </p>
    </main>
  );
}
