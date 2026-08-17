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
