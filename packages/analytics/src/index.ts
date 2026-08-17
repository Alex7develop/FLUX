export interface Analytics {
  track(event: string, properties?: Record<string, unknown>): void;
}

export const noopAnalytics: Analytics = {
  track() {
    // Intentionally empty until a provider is chosen.
    // Never send file contents, OCR text, or private metadata here.
  },
};
