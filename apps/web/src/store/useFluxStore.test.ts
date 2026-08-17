import { describe, expect, it } from 'vitest';
import { useFluxStore } from './useFluxStore';

describe('useFluxStore', () => {
  it('starts idle and updates visual state', () => {
    useFluxStore.setState({ visualState: 'idle' });
    expect(useFluxStore.getState().visualState).toBe('idle');

    useFluxStore.getState().setVisualState('processing');
    expect(useFluxStore.getState().visualState).toBe('processing');

    useFluxStore.getState().setVisualState('success');
    expect(useFluxStore.getState().visualState).toBe('success');
  });

  it('rejects unknown visual states', () => {
    useFluxStore.setState({ visualState: 'idle' });
    expect(() =>
      useFluxStore.getState().setVisualState('uploading' as 'idle'),
    ).toThrow();
    expect(useFluxStore.getState().visualState).toBe('idle');
  });
});
