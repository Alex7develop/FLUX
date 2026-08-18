const DB_NAME = 'flux-inbox';
const STORE = 'blobs';

const memory = new Map<string, Blob>();

function openDb(): Promise<IDBDatabase | undefined> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(undefined);
  }
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(undefined);
  });
}

export function storeInboxBlob(id: string, blob: Blob): void {
  memory.set(id, blob);
  void openDb().then((db) => {
    if (!db) {
      return;
    }
    db.transaction(STORE, 'readwrite').objectStore(STORE).put(blob, id);
  });
}

export async function getInboxBlob(id: string): Promise<Blob | undefined> {
  const cached = memory.get(id);
  if (cached) {
    return cached;
  }
  const db = await openDb();
  if (!db) {
    return undefined;
  }
  return new Promise((resolve) => {
    const request = db.transaction(STORE).objectStore(STORE).get(id);
    request.onsuccess = () => {
      const blob = request.result as Blob | undefined;
      if (blob) {
        memory.set(id, blob);
      }
      resolve(blob);
    };
    request.onerror = () => resolve(undefined);
  });
}
