import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authConfigured, signIn } from '../features/auth/session';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const ready = authConfigured();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-4 text-mute">
        {ready
          ? 'Use the account connected to this FLUX project.'
          : 'Auth is wired, but this project has no Supabase keys yet.'}
      </p>
      <form
        className="mt-8 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          void signIn(email, password).catch((caught: Error) => setError(caught.message));
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="rounded-full border border-line bg-transparent px-4 py-3 outline-none focus-visible:border-accent"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="rounded-full border border-line bg-transparent px-4 py-3 outline-none focus-visible:border-accent"
        />
        <button type="submit" className="flux-button flux-button--primary" disabled={!ready}>
          Log in
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      <Link to="/signup" className="mt-6 text-sm text-accent">
        Create an account
      </Link>
    </main>
  );
}
