import { useMemo, useState } from 'react';
import { searchItems } from '@flux/graph';
import { formatBytes } from '@flux/utils';
import { useFluxStore } from '../store/useFluxStore';

export function SearchPage() {
  const inbox = useFluxStore((state) => state.inbox);
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchItems(inbox, query), [inbox, query]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Find</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Search</h1>
      <label className="mt-8 grid gap-2 text-sm text-mute">
        What do you remember?
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-full border border-line bg-transparent px-4 py-3 text-ink outline-none focus-visible:border-accent"
          placeholder="189, 10.08, receipt…"
        />
      </label>
      <ul className="mt-8 grid gap-3">
        {results.map((item) => (
          <li key={item.id} className="rounded-[24px] border border-line bg-surface/70 px-5 py-4">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-mute">
              {item.summary ?? item.mimeType} · {formatBytes(item.sizeBytes)}
            </p>
          </li>
        ))}
      </ul>
      {results.length === 0 ? <p className="mt-8 text-mute">Nothing matches yet.</p> : null}
    </main>
  );
}
