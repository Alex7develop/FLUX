import { useEffect, useMemo, useState } from 'react';
import { formatBytes } from '@flux/utils';
import { filterInbox, inboxKind, type InboxFilter } from '../features/inbox/filter';
import { getInboxBlob } from '../features/transfer/inboxBlobs';
import { useFluxStore, type InboxEntry } from '../store/useFluxStore';

const FILTERS: Array<{ id: InboxFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'image', label: 'Images' },
  { id: 'document', label: 'Docs' },
  { id: 'link', label: 'Links' },
  { id: 'note', label: 'Notes' },
];

function useBlobUrl(id: string | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setUrl(null);
      return;
    }
    let objectUrl: string | undefined;
    let cancelled = false;
    void getInboxBlob(id).then((blob) => {
      if (!blob || cancelled) {
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [id]);

  return url;
}

function InboxCard({
  item,
  onOpen,
}: {
  item: InboxEntry;
  onOpen: (item: InboxEntry) => void;
}) {
  const kind = inboxKind(item);
  const preview = useBlobUrl(kind === 'image' ? item.id : undefined);

  return (
    <li>
      <button
        type="button"
        data-testid="inbox-item"
        className="flex w-full items-center gap-4 rounded-[24px] border border-line bg-surface/70 px-5 py-4 text-left"
        onClick={() => onOpen(item)}
      >
        {preview ? (
          <img src={preview} alt="" className="h-14 w-14 rounded-2xl object-cover" />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
            {kind}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block font-medium">{item.title}</span>
          <span className="mt-1 block text-sm text-mute">{item.summary ?? item.mimeType}</span>
          <span className="mt-1 block font-mono text-xs text-mute">
            {formatBytes(item.sizeBytes)}
          </span>
        </span>
      </button>
    </li>
  );
}

function InboxPreview({ item, onClose }: { item: InboxEntry; onClose: () => void }) {
  const url = useBlobUrl(item.id);
  const kind = inboxKind(item);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-background/80 px-4 backdrop-blur-xl">
      <article className="w-full max-w-lg rounded-[28px] border border-line bg-surface p-6">
        <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">{kind}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">{item.title}</h2>
        <p className="mt-2 text-sm text-mute">{item.summary}</p>
        {kind === 'image' && url ? (
          <img src={url} alt={item.title} className="mt-6 max-h-[50vh] w-full rounded-2xl object-contain" />
        ) : null}
        {kind === 'document' && url ? (
          <iframe title={item.title} src={url} className="mt-6 h-64 w-full rounded-2xl border border-line" />
        ) : null}
        <div className="mt-6 flex gap-3">
          <button type="button" className="flux-button flux-button--ghost" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="flux-button flux-button--primary"
            onClick={() => {
              if (!url) {
                return;
              }
              const link = document.createElement('a');
              link.href = url;
              link.download = item.title;
              link.click();
            }}
          >
            Save
          </button>
        </div>
      </article>
    </div>
  );
}

export function InboxPage() {
  const inbox = useFluxStore((state) => state.inbox);
  const [filter, setFilter] = useState<InboxFilter>('all');
  const [open, setOpen] = useState<InboxEntry | null>(null);
  const items = useMemo(() => filterInbox(inbox, filter), [filter, inbox]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Received</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Inbox</h1>
      <p className="mt-4 text-mute">
        Items stay on this device. Refresh keeps previews; another browser will not.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm ${
              filter === entry.id ? 'border-accent text-ink' : 'border-line text-mute'
            }`}
            onClick={() => setFilter(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-mute">Nothing here yet. Drop something in the workspace.</p>
      ) : (
        <ul className="mt-10 grid gap-3">
          {items.map((item) => (
            <InboxCard key={item.id} item={item} onOpen={setOpen} />
          ))}
        </ul>
      )}

      {open ? <InboxPreview item={open} onClose={() => setOpen(null)} /> : null}
    </main>
  );
}
