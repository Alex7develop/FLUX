import { connectionFailedError, type SignalMessage } from '@flux/types';
import type { SignalingClient } from '@flux/signaling';
import type { TransferTransport } from './transport';

interface WebRtcTransportOptions {
  role: 'host' | 'guest';
  signaling: SignalingClient;
  sessionId: string;
  peerId: string;
}

const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];

export class WebRtcTransport implements TransferTransport {
  private peer: RTCPeerConnection | undefined;
  private channel: RTCDataChannel | undefined;
  private stopSignal: (() => void) | undefined;
  private handlers = new Set<(payload: ArrayBuffer | string) => void>();
  private closers = new Set<() => void>();

  constructor(private readonly options: WebRtcTransportOptions) {}

  async connect(): Promise<void> {
    const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    this.peer = peer;
    const pendingIce: RTCIceCandidateInit[] = [];
    let remoteReady = false;

    const opened = new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject({ ...connectionFailedError }), 15_000);
      this.attachOpen = () => {
        window.clearTimeout(timer);
        resolve();
      };
    });

    peer.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }
      void this.options.signaling.sendSignal({
        sessionId: this.options.sessionId,
        from: this.options.peerId,
        type: 'ice',
        payload: event.candidate.toJSON(),
      });
    };

    const applyRemote = async (description: RTCSessionDescriptionInit) => {
      await peer.setRemoteDescription(description);
      remoteReady = true;
      for (const candidate of pendingIce) {
        await peer.addIceCandidate(candidate);
      }
      pendingIce.length = 0;
    };

    this.stopSignal = this.options.signaling.onSignal((message: SignalMessage) => {
      void (async () => {
        if (message.type === 'join' && this.options.role === 'host') {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          await this.options.signaling.sendSignal({
            sessionId: this.options.sessionId,
            from: this.options.peerId,
            type: 'offer',
            payload: offer,
          });
        }
        if (message.type === 'offer' && this.options.role === 'guest') {
          await applyRemote(message.payload as RTCSessionDescriptionInit);
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          await this.options.signaling.sendSignal({
            sessionId: this.options.sessionId,
            from: this.options.peerId,
            type: 'answer',
            payload: answer,
          });
        }
        if (message.type === 'answer' && this.options.role === 'host') {
          await applyRemote(message.payload as RTCSessionDescriptionInit);
        }
        if (message.type === 'ice' && message.payload) {
          const candidate = message.payload as RTCIceCandidateInit;
          if (!remoteReady) {
            pendingIce.push(candidate);
            return;
          }
          await peer.addIceCandidate(candidate);
        }
      })();
    });

    if (this.options.role === 'host') {
      this.bindChannel(peer.createDataChannel('flux', { ordered: true }));
    } else {
      peer.ondatachannel = (event) => this.bindChannel(event.channel);
      await this.options.signaling.sendSignal({
        sessionId: this.options.sessionId,
        from: this.options.peerId,
        type: 'join',
      });
    }

    await opened;
  }

  async send(payload: ArrayBuffer | string): Promise<void> {
    if (!this.channel || this.channel.readyState !== 'open') {
      throw { ...connectionFailedError };
    }
    if (typeof payload === 'string') {
      this.channel.send(payload);
      return;
    }
    this.channel.send(new Uint8Array(payload));
  }

  onMessage(handler: (payload: ArrayBuffer | string) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  onClose(handler: () => void): () => void {
    this.closers.add(handler);
    return () => {
      this.closers.delete(handler);
    };
  }

  close(): void {
    this.stopSignal?.();
    this.channel?.close();
    this.peer?.close();
    this.handlers.clear();
    for (const closer of this.closers) {
      closer();
    }
    this.closers.clear();
  }

  private attachOpen: () => void = () => undefined;

  private bindChannel(channel: RTCDataChannel) {
    this.channel = channel;
    channel.binaryType = 'arraybuffer';
    channel.onopen = () => this.attachOpen();
    channel.onclose = () => {
      for (const closer of this.closers) {
        closer();
      }
    };
    channel.onmessage = (event) => {
      const data = event.data as ArrayBuffer | string | Blob;
      if (data instanceof Blob) {
        void data.arrayBuffer().then((buffer) => this.emit(buffer));
        return;
      }
      this.emit(data);
    };
  }

  private emit(payload: ArrayBuffer | string) {
    for (const handler of this.handlers) {
      handler(payload);
    }
  }
}
