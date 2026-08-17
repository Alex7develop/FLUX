import type { SignalMessage } from '@flux/types';

export interface CreatedSession {
  id: string;
  token: string;
  expiresAt: string;
}

export interface SignalingClient {
  createSession(): Promise<CreatedSession>;
  joinSession(token: string): Promise<CreatedSession>;
  sendSignal(message: SignalMessage): Promise<void>;
  onSignal(handler: (message: SignalMessage) => void): () => void;
  close(): void;
}
