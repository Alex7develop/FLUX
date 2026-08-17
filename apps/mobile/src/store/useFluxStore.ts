import { create } from 'zustand';
import type { FluxVisualState } from '@flux/types';
import { FluxVisualStateSchema } from '@flux/validation';

interface FluxStore {
  visualState: FluxVisualState;
  setVisualState: (state: FluxVisualState) => void;
}

export const useFluxStore = create<FluxStore>((set) => ({
  visualState: 'idle',
  setVisualState: (visualState) => {
    FluxVisualStateSchema.parse(visualState);
    set({ visualState });
  },
}));
