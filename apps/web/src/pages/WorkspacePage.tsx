import { useCallback, useEffect, useRef } from 'react';
import { FluxCanvas, FluxDropZone, FluxStatus } from '@flux/ui';
import { useCompactCanvas } from '../hooks/useCompactCanvas';
import { runDropDemo } from '../features/drop/runDropDemo';
import { useFluxStore } from '../store/useFluxStore';

export function WorkspacePage() {
  const visualState = useFluxStore((state) => state.visualState);
  const setVisualState = useFluxStore((state) => state.setVisualState);
  const compact = useCompactCanvas();
  const running = useRef(false);

  const runDemo = useCallback(async () => {
    if (running.current) {
      return;
    }
    running.current = true;
    try {
      await runDropDemo(setVisualState);
    } finally {
      running.current = false;
    }
  }, [setVisualState]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (!event.clipboardData) {
        return;
      }
      event.preventDefault();
      void runDemo();
    };

    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [runDemo]);

  const busy = visualState === 'processing' || visualState === 'receiving';

  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center px-5 pb-16 pt-4">
      <FluxCanvas visualState={visualState} compact={compact} />
      <div className="mt-2 flex w-full max-w-md flex-col items-center gap-6">
        <FluxDropZone disabled={false} busy={busy} onActivate={() => void runDemo()} />
        <FluxStatus visualState={visualState} />
      </div>
    </main>
  );
}
