import { create } from 'zustand';
import type { FluxVisualState } from '@flux/types';
import { FluxVisualStateSchema } from '@flux/validation';

export interface InboxEntry {
  id: string;
  title: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
}

interface FluxStore {
  visualState: FluxVisualState;
  role: 'host' | 'guest' | null;
  sessionId: string | null;
  pairingToken: string | null;
  connected: boolean;
  lastError: string | null;
  inbox: InboxEntry[];
  setVisualState: (state: FluxVisualState) => void;
  setPairing: (input: {
    role: 'host' | 'guest';
    sessionId: string;
    pairingToken?: string;
  }) => void;
  setConnected: (connected: boolean) => void;
  setLastError: (message: string | null) => void;
  addInboxItem: (item: InboxEntry) => void;
  resetPairing: () => void;
}

export const useFluxStore = create<FluxStore>((set) => ({
  visualState: 'idle',
  role: null,
  sessionId: null,
  pairingToken: null,
  connected: false,
  lastError: null,
  inbox: [],
  setVisualState: (visualState) => {
    FluxVisualStateSchema.parse(visualState);
    set({ visualState });
  },
  setPairing: ({ role, sessionId, pairingToken }) =>
    set({
      role,
      sessionId,
      pairingToken: pairingToken ?? null,
      lastError: null,
    }),
  setConnected: (connected) => set({ connected }),
  setLastError: (lastError) => set({ lastError }),
  addInboxItem: (item) => set((state) => ({ inbox: [item, ...state.inbox] })),
  resetPairing: () =>
    set({
      role: null,
      sessionId: null,
      pairingToken: null,
      connected: false,
    }),
}));
