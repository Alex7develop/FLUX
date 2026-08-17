import { formatBytes } from '@flux/utils';
import { getInboxBlob } from '../features/transfer/inboxBlobs';
import { useFluxStore } from '../store/useFluxStore';

export function InboxPage() {
  const inbox = useFluxStore((state) => state.inbox);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Received</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Inbox</h1>
      <p className="mt-4 text-mute">
        Items stay in this browser for now. Cloud history comes later.
      </p>

      {inbox.length === 0 ? (
        <p className="mt-12 text-mute">Nothing here yet. Drop something in the workspace.</p>
      ) : (
        <ul className="mt-10 grid gap-3">
          {inbox.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-[24px] border border-line bg-surface/70 px-5 py-4"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="font-mono text-xs text-mute">
                  {formatBytes(item.sizeBytes)} · {item.mimeType}
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-accent"
                onClick={() => {
                  const blob = getInboxBlob(item.id);
                  if (!blob) {
                    return;
                  }
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = item.title;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Save
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
