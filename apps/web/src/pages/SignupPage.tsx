import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authConfigured, signUp } from '../features/auth/session';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const ready = authConfigured();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Sign up</h1>
      <p className="mt-4 text-mute">
        {ready
          ? 'Creates a Supabase auth user. No service-role key is used here.'
          : 'Add VITE_SUPABASE_URL and the publishable key to enable accounts.'}
      </p>
      <form
        className="mt-8 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          void signUp(email, password).catch((caught: Error) => setError(caught.message));
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
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="rounded-full border border-line bg-transparent px-4 py-3 outline-none focus-visible:border-accent"
        />
        <button type="submit" className="flux-button flux-button--primary" disabled={!ready}>
          Create account
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      <Link to="/login" className="mt-6 text-sm text-accent">
        I already have an account
      </Link>
    </main>
  );
}
