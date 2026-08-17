import type { FluxVisualState } from '@flux/types';
import { wait } from '@flux/utils';

export async function runDropDemo(
  setVisualState: (state: FluxVisualState) => void,
  delays: { processing: number; success: number } = { processing: 1600, success: 1400 },
): Promise<void> {
  setVisualState('processing');
  await wait(delays.processing);
  setVisualState('success');
  await wait(delays.success);
  setVisualState('idle');
}
