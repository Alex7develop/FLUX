import type { FluxVisualState } from '@flux/types';
import { visualStatusCopy, visualStatusLabel } from './copy';

interface FluxStatusProps {
  visualState: FluxVisualState;
}

export function FluxStatus({ visualState }: FluxStatusProps) {
  return (
    <p className="flux-status" data-state={visualState} aria-live="polite">
      <span className="flux-status__label">{visualStatusLabel[visualState]}</span>
      <span className="flux-status__copy">{visualStatusCopy[visualState]}</span>
    </p>
  );
}
