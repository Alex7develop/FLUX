import { useState } from 'react';
import { disconnectPairing, joinPairing, startHostPairing } from '../features/transfer/runtime';
import { useFluxStore } from '../store/useFluxStore';

export function DevicesPage() {
  const visualState = useFluxStore((state) => state.visualState);
  const pairingToken = useFluxStore((state) => state.pairingToken);
  const connected = useFluxStore((state) => state.connected);
  const lastError = useFluxStore((state) => state.lastError);
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Pairing</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Devices</h1>
      <p className="mt-4 text-mute">
        Create a code on this computer, then join it from another FLUX tab. The file bytes travel
        over a WebRTC data channel, not through a FLUX server.
      </p>

      <div className="mt-10 grid gap-3">
        <button
          type="button"
          className="flux-button flux-button--primary"
          disabled={busy || connected}
          onClick={() => {
            setBusy(true);
            void startHostPairing().finally(() => setBusy(false));
          }}
        >
          Create connection code
        </button>

        {pairingToken ? (
          <p
            className="rounded-[24px] border border-line bg-surface/70 px-6 py-5 text-center font-mono text-3xl tracking-[0.28em]"
            data-testid="pairing-code"
          >
            {pairingToken}
          </p>
        ) : null}

        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setBusy(true);
            void joinPairing(joinCode).finally(() => setBusy(false));
          }}
        >
          <label className="grid gap-2 text-sm text-mute">
            Join with a code
            <input
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
              className="rounded-full border border-line bg-transparent px-4 py-3 font-mono tracking-[0.2em] text-ink outline-none focus-visible:border-accent"
              autoComplete="off"
              spellCheck={false}
              maxLength={6}
              placeholder="K7M2QX"
            />
          </label>
          <button type="submit" className="flux-button flux-button--ghost" disabled={busy || connected}>
            Join device
          </button>
        </form>

        {connected ? (
          <button type="button" className="flux-button flux-button--ghost" onClick={disconnectPairing}>
            Disconnect
          </button>
        ) : null}
      </div>

      <p className="mt-8 font-mono text-xs tracking-[0.18em] text-mute uppercase">
        {connected ? 'Connected' : visualState === 'pairing' ? 'Waiting' : 'Not connected'}
      </p>
      {lastError ? <p className="mt-3 text-sm text-danger">{lastError}</p> : null}
    </main>
  );
}
