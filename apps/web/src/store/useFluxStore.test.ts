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
    expect(() => useFluxStore.getState().setVisualState('uploading' as 'idle')).toThrow();
    expect(useFluxStore.getState().visualState).toBe('idle');
  });

  it('records pairing and inbox metadata without file bytes', () => {
    useFluxStore.getState().setPairing({
      role: 'host',
      sessionId: 'pair_1',
      pairingToken: 'ABC234',
    });
    useFluxStore.getState().addInboxItem({
      id: 'item_1',
      title: 'note.txt',
      sizeBytes: 12,
      mimeType: 'text/plain',
      createdAt: '2026-08-18T00:00:00.000Z',
    });

    const state = useFluxStore.getState();
    expect(state.role).toBe('host');
    expect(state.pairingToken).toBe('ABC234');
    expect(state.inbox[0]?.title).toBe('note.txt');
  });
});
