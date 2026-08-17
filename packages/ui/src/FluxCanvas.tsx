import { useMemo, type CSSProperties } from 'react';
import type { FluxVisualState } from '@flux/types';
import { FluxConnections, satelliteLayout } from './FluxConnections';
import { FluxNode } from './FluxNode';
import { FluxParticles } from './FluxParticles';

interface FluxCanvasProps {
  visualState: FluxVisualState;
  compact?: boolean;
}

export function FluxCanvas({ visualState, compact = false }: FluxCanvasProps) {
  const graph = useMemo(() => satelliteLayout(compact), [compact]);
  const width = 720;
  const height = 520;

  return (
    <div className="flux-canvas" data-state={visualState} data-compact={compact}>
      <FluxParticles visualState={visualState} density={compact ? 'low' : 'full'} />
      <FluxConnections
        nodes={graph.nodes}
        edges={graph.edges}
        visualState={visualState}
        width={width}
        height={height}
      />
      <div className="flux-canvas__nodes">
        {graph.nodes
          .filter((node) => node.kind !== 'flux')
          .map((node) => (
            <span
              key={node.id}
              className="flux-satellite"
              style={
                {
                  '--sat-angle': `${node.angle ?? 0}deg`,
                } as CSSProperties
              }
            >
              <span className="flux-satellite__dot" />
              <span className="flux-satellite__label">{node.label}</span>
            </span>
          ))}
        <FluxNode visualState={visualState} />
      </div>
    </div>
  );
}
