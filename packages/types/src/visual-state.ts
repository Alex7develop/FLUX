export type FluxVisualState =
  | 'idle'
  | 'pairing'
  | 'connected'
  | 'receiving'
  | 'processing'
  | 'understood'
  | 'linked'
  | 'success'
  | 'error';

export const visualStatusCopy: Record<FluxVisualState, string> = {
  idle: 'Ready for anything.',
  pairing: 'Pairing…',
  connected: 'Connected.',
  receiving: 'Receiving…',
  processing: 'Understanding…',
  understood: 'Understood.',
  linked: 'Linked.',
  success: 'Got it.',
  error: 'Something went wrong.',
};

export const visualStatusLabel: Record<FluxVisualState, string> = {
  idle: 'Ready',
  pairing: 'Pairing',
  connected: 'Connected',
  receiving: 'Receiving',
  processing: 'Processing',
  understood: 'Understood',
  linked: 'Linked',
  success: 'Success',
  error: 'Error',
};
