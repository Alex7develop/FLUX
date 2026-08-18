export interface SignalRelay {
  publish(topic: string, message: unknown): Promise<void>;
  subscribe(topic: string, handler: (message: unknown) => void): Promise<() => void>;
}

export function createMemoryRelay(): SignalRelay {
  const topics = new Map<string, Set<(message: unknown) => void>>();

  return {
    async publish(topic, message) {
      for (const handler of topics.get(topic) ?? []) {
        handler(message);
      }
    },
    async subscribe(topic, handler) {
      const listeners = topics.get(topic) ?? new Set();
      listeners.add(handler);
      topics.set(topic, listeners);
      return () => listeners.delete(handler);
    },
  };
}

export function createBroadcastRelay(): SignalRelay {
  const channels = new Map<string, BroadcastChannel>();

  const open = (topic: string) => {
    const existing = channels.get(topic);
    if (existing) {
      return existing;
    }
    const channel = new BroadcastChannel(topic);
    channels.set(topic, channel);
    return channel;
  };

  return {
    async publish(topic, message) {
      open(topic).postMessage(message);
    },
    async subscribe(topic, handler) {
      const channel = open(topic);
      const onMessage = (event: MessageEvent<unknown>) => handler(event.data);
      channel.addEventListener('message', onMessage);
      return () => channel.removeEventListener('message', onMessage);
    },
  };
}
