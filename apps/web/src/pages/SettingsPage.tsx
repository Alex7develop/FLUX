import { getSupabaseConfig } from '../lib/supabase/config';
import { signalingMode } from '../features/transfer/signalingFactory';
import { signOut } from '../features/auth/session';
import { useFluxStore } from '../store/useFluxStore';

export function SettingsPage() {
  const email = useFluxStore((state) => state.userEmail);
  const supabase = getSupabaseConfig();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Account</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Settings</h1>
      <dl className="mt-10 grid gap-6 text-sm">
        <div>
          <dt className="text-mute">Signed in</dt>
          <dd className="mt-1">{email ?? 'Not signed in'}</dd>
        </div>
        <div>
          <dt className="text-mute">Signaling</dt>
          <dd className="mt-1 font-mono uppercase">
            {signalingMode() === 'supabase' ? 'Supabase Realtime' : 'This browser only'}
          </dd>
        </div>
        <div>
          <dt className="text-mute">Supabase</dt>
          <dd className="mt-1">{supabase.isConfigured ? 'Configured' : 'Not configured'}</dd>
        </div>
      </dl>
      {email ? (
        <button type="button" className="flux-button flux-button--ghost mt-10" onClick={() => void signOut()}>
          Log out
        </button>
      ) : null}
    </main>
  );
}
