export type SignalType = 'join' | 'offer' | 'answer' | 'ice' | 'ready' | 'leave';

export interface SignalMessage {
  sessionId: string;
  from: string;
  type: SignalType;
  payload?: unknown;
}
