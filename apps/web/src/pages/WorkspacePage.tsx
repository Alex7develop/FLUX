import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FluxCanvas, FluxDropZone, FluxStatus } from '@flux/ui';
import { useCompactCanvas } from '../hooks/useCompactCanvas';
import { transferFiles } from '../features/transfer/runtime';
import { useFluxStore } from '../store/useFluxStore';

export function WorkspacePage() {
  const visualState = useFluxStore((state) => state.visualState);
  const connected = useFluxStore((state) => state.connected);
  const lastError = useFluxStore((state) => state.lastError);
  const compact = useCompactCanvas();

  const onFiles = useCallback((files: File[], text?: string) => {
    void transferFiles(files, text);
  }, []);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (!event.clipboardData) {
        return;
      }
      const files = Array.from(event.clipboardData.files);
      const text = event.clipboardData.getData('text/plain');
      if (files.length === 0 && !text) {
        return;
      }
      event.preventDefault();
      onFiles(files, text || undefined);
    };

    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [onFiles]);

  const busy =
    visualState === 'processing' ||
    visualState === 'receiving' ||
    visualState === 'pairing';

  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center px-5 pb-16 pt-4">
      <FluxCanvas visualState={visualState} compact={compact} />
      <div className="mt-2 flex w-full max-w-md flex-col items-center gap-6">
        <FluxDropZone busy={busy} onActivate={({ files }) => onFiles(files)} />
        <FluxStatus visualState={visualState} />
        {lastError ? <p className="text-center text-sm text-danger">{lastError}</p> : null}
        <p className="text-center text-sm text-mute">
          {connected ? (
            'Connected. Drops go to the other device.'
          ) : (
            <>
              Local for now.{' '}
              <Link to="/app/devices" className="text-accent">
                Connect a device
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
