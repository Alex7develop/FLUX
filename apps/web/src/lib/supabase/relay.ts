import type { SignalRelay } from '@flux/signaling';
import type { SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseRelay(client: SupabaseClient): SignalRelay {
  type Channel = ReturnType<SupabaseClient['channel']>;
  const channels = new Map<string, Channel>();
  const ready = new Map<string, Promise<Channel>>();

  const ensure = (topic: string, setup?: (channel: Channel) => void) => {
    const existing = channels.get(topic);
    if (existing) {
      setup?.(existing);
      return ready.get(topic) ?? Promise.resolve(existing);
    }

    const channel = client.channel(topic, { config: { broadcast: { ack: false, self: false } } });
    channels.set(topic, channel);
    setup?.(channel);

    const subscribed = new Promise<Channel>((resolve, reject) => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          resolve(channel);
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          reject(new Error("We couldn't connect these devices. Try again."));
        }
      });
    });
    ready.set(topic, subscribed);
    return subscribed;
  };

  return {
    async publish(topic, message) {
      const channel = await ensure(topic);
      await channel.send({ type: 'broadcast', event: 'flux', payload: message });
    },
    async subscribe(topic, handler) {
      const channel = await ensure(topic, (next) => {
        next.on('broadcast', { event: 'flux' }, ({ payload }) => {
          handler(payload);
        });
      });
      return () => {
        void client.removeChannel(channel);
        channels.delete(topic);
        ready.delete(topic);
      };
    },
  };
}
