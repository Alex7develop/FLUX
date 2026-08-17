import { createBroadcastSignalingClient, type SignalingClient } from '@flux/signaling';
import { WebRtcTransport, receiveTransfer, sendTransfer } from '@flux/transfer';
import type { TransferTransport } from '@flux/transfer';
import { createId } from '@flux/utils';
import { useFluxStore } from '../../store/useFluxStore';
import { storeInboxBlob } from './inboxBlobs';
import { runLocalTransfer } from './runLocalTransfer';

const peerId = createId('peer');

let signaling: SignalingClient | undefined;
let transport: TransferTransport | undefined;
let listening = false;

function store(): ReturnType<typeof useFluxStore.getState> {
  return useFluxStore.getState();
}

function rememberTransfer(result: { manifest: { id: string; fileName: string; mimeType: string; size: number }; bytes: ArrayBuffer }) {
  storeInboxBlob(result.manifest.id, new Blob([result.bytes], { type: result.manifest.mimeType }));
  store().addInboxItem({
    id: result.manifest.id,
    title: result.manifest.fileName,
    sizeBytes: result.manifest.size,
    mimeType: result.manifest.mimeType,
    createdAt: new Date().toISOString(),
  });
}

async function listenForIncoming() {
  if (!transport || listening) {
    return;
  }
  listening = true;
  const current = transport;
  try {
    while (transport === current && store().connected) {
      try {
        const result = await receiveTransfer(current, {
          onStart: () => store().setVisualState('receiving'),
        });
        rememberTransfer(result);
        store().setVisualState('success');
      } catch {
        if (store().connected && transport === current) {
          store().setVisualState('error');
          store().setLastError("The transfer didn't finish. Try again.");
        }
        break;
      }
    }
  } finally {
    listening = false;
  }
}

export async function startHostPairing(): Promise<string> {
  signaling?.close();
  transport?.close();
  signaling = createBroadcastSignalingClient(peerId);
  const session = await signaling.createSession();
  store().setPairing({ role: 'host', sessionId: session.id, pairingToken: session.token });
  store().setVisualState('pairing');
  store().setConnected(false);

  transport = new WebRtcTransport({
    role: 'host',
    signaling,
    sessionId: session.id,
    peerId,
  });

  void transport
    .connect()
    .then(() => {
      store().setConnected(true);
      store().setVisualState('connected');
      void listenForIncoming();
    })
    .catch(() => {
      store().setVisualState('error');
      store().setLastError("We couldn't connect these devices. Try again.");
    });

  return session.token;
}

export async function joinPairing(token: string): Promise<void> {
  signaling?.close();
  transport?.close();
  signaling = createBroadcastSignalingClient(peerId);
  const session = await signaling.joinSession(token.trim());
  store().setPairing({ role: 'guest', sessionId: session.id });
  store().setVisualState('pairing');

  transport = new WebRtcTransport({
    role: 'guest',
    signaling,
    sessionId: session.id,
    peerId,
  });

  try {
    await transport.connect();
    store().setConnected(true);
    store().setVisualState('connected');
    void listenForIncoming();
  } catch {
    store().setVisualState('error');
    store().setLastError("We couldn't connect these devices. Try again.");
    throw new Error("We couldn't connect these devices. Try again.");
  }
}

export function disconnectPairing(): void {
  listening = false;
  transport?.close();
  signaling?.close();
  transport = undefined;
  signaling = undefined;
  store().resetPairing();
  store().setVisualState('idle');
}

export async function transferFiles(files: File[], text?: string): Promise<void> {
  const file =
    files[0] ??
    (text
      ? new File([text], 'pasted.txt', { type: 'text/plain' })
      : undefined);

  if (!file) {
    return;
  }

  const bytes = await file.arrayBuffer();
  const input = {
    bytes,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    sessionId: store().sessionId ?? 'local',
    itemId: createId('item'),
  };

  store().setLastError(null);
  store().setVisualState('processing');

  try {
    if (transport && store().connected) {
      const manifest = await sendTransfer(transport, input);
      rememberTransfer({ manifest, bytes });
    } else {
      const result = await runLocalTransfer(input);
      rememberTransfer(result);
    }
    store().setVisualState('success');
    window.setTimeout(() => {
      store().setVisualState(store().connected ? 'connected' : 'idle');
    }, 1200);
  } catch {
    store().setVisualState('error');
    store().setLastError("The transfer didn't finish. Try again.");
  }
}
