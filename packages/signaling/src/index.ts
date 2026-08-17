export interface SignalingClient {
  createSession(): Promise<void>;
  joinSession(): Promise<void>;
  sendSignal(): Promise<void>;
}
