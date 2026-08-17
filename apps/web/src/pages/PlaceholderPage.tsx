import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  body: string;
}

export function PlaceholderPage({ title, body }: PlaceholderPageProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Coming later</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-mute">{body}</p>
      <Link to="/app" className="mt-8 text-sm text-accent">
        Back to workspace
      </Link>
    </main>
  );
}
