export interface FluxError {
  code: string;
  message: string;
  retryable: boolean;
  context?: Record<string, unknown>;
}

export const connectionFailedError: FluxError = {
  code: 'DEVICE_CONNECTION_FAILED',
  message: "We couldn't connect these devices. Try again.",
  retryable: true,
};

export const pairingExpiredError: FluxError = {
  code: 'PAIRING_EXPIRED',
  message: 'This connection code expired. Create a new one.',
  retryable: true,
};

export const transferFailedError: FluxError = {
  code: 'TRANSFER_FAILED',
  message: "The transfer didn't finish. Try again.",
  retryable: true,
};

export const checksumFailedError: FluxError = {
  code: 'TRANSFER_CHECKSUM_FAILED',
  message: "We couldn't verify this file. Try again.",
  retryable: true,
};
