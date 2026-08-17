import { describe, expect, it, vi } from 'vitest';
import type { FluxVisualState } from '@flux/types';
import { runDropDemo } from './runDropDemo';

describe('runDropDemo', () => {
  it('moves through processing and success, then returns to idle', async () => {
    const states: FluxVisualState[] = [];
    const setVisualState = (state: FluxVisualState) => {
      states.push(state);
    };

    await runDropDemo(setVisualState, { processing: 0, success: 0 });

    expect(states).toEqual(['processing', 'success', 'idle']);
  });

  it('waits between transitions', async () => {
    vi.useFakeTimers();
    const states: FluxVisualState[] = [];

    const pending = runDropDemo((state) => states.push(state), {
      processing: 100,
      success: 50,
    });

    expect(states).toEqual(['processing']);
    await vi.advanceTimersByTimeAsync(100);
    expect(states).toEqual(['processing', 'success']);
    await vi.advanceTimersByTimeAsync(50);
    await pending;
    expect(states).toEqual(['processing', 'success', 'idle']);
    vi.useRealTimers();
  });
});
