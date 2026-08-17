export interface PairingSession {
  id: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
  consumedAt?: string;
}

export interface PairingSessionView {
  id: string;
  expiresAt: string;
}
