import { create } from 'zustand';
import type { FluxVisualState, ItemType } from '@flux/types';
import { FluxVisualStateSchema } from '@flux/validation';

export interface InboxEntry {
  id: string;
  title: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
  type?: ItemType;
  summary?: string;
  entities?: Array<{ type: string; name: string }>;
  actions?: Array<{ id: string; label: string }>;
}

const INBOX_KEY = 'flux.inbox';

function readInbox(): InboxEntry[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(INBOX_KEY);
    return raw ? (JSON.parse(raw) as InboxEntry[]) : [];
  } catch {
    return [];
  }
}

function writeInbox(inbox: InboxEntry[]) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(INBOX_KEY, JSON.stringify(inbox));
}

interface FluxStore {
  visualState: FluxVisualState;
  role: 'host' | 'guest' | null;
  sessionId: string | null;
  pairingToken: string | null;
  connected: boolean;
  lastError: string | null;
  inbox: InboxEntry[];
  userEmail: string | null;
  setVisualState: (state: FluxVisualState) => void;
  setPairing: (input: {
    role: 'host' | 'guest';
    sessionId: string;
    pairingToken?: string;
  }) => void;
  setConnected: (connected: boolean) => void;
  setLastError: (message: string | null) => void;
  addInboxItem: (item: InboxEntry) => void;
  updateInboxItem: (id: string, patch: Partial<InboxEntry>) => void;
  setUserEmail: (email: string | null) => void;
  resetPairing: () => void;
}

export const useFluxStore = create<FluxStore>((set) => ({
  visualState: 'idle',
  role: null,
  sessionId: null,
  pairingToken: null,
  connected: false,
  lastError: null,
  inbox: readInbox(),
  userEmail: null,
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
  addInboxItem: (item) =>
    set((state) => {
      const inbox = [item, ...state.inbox.filter((entry) => entry.id !== item.id)];
      writeInbox(inbox);
      return { inbox };
    }),
  updateInboxItem: (id, patch) =>
    set((state) => {
      const inbox = state.inbox.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry));
      writeInbox(inbox);
      return { inbox };
    }),
  setUserEmail: (userEmail) => set({ userEmail }),
  resetPairing: () =>
    set({
      role: null,
      sessionId: null,
      pairingToken: null,
      connected: false,
    }),
}));
