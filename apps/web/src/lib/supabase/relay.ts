import type { SignalRelay } from '@flux/signaling';
import type { SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseRelay(client: SupabaseClient): SignalRelay {
  const channels = new Map<string, ReturnType<SupabaseClient['channel']>>();

  const ensure = async (topic: string) => {
    const existing = channels.get(topic);
    if (existing) {
      return existing;
    }
    const channel = client.channel(topic, { config: { broadcast: { ack: false, self: false } } });
    channels.set(topic, channel);
    await new Promise<void>((resolve, reject) => {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          resolve();
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          reject(new Error("We couldn't connect these devices. Try again."));
        }
      });
    });
    return channel;
  };

  return {
    async publish(topic, message) {
      const channel = await ensure(topic);
      await channel.send({ type: 'broadcast', event: 'flux', payload: message });
    },
    subscribe(topic, handler) {
      let cancelled = false;
      void ensure(topic).then((channel) => {
        if (cancelled) {
          void client.removeChannel(channel);
          channels.delete(topic);
          return;
        }
        channel.on('broadcast', { event: 'flux' }, ({ payload }) => {
          handler(payload);
        });
      });
      return () => {
        cancelled = true;
        const channel = channels.get(topic);
        if (channel) {
          void client.removeChannel(channel);
          channels.delete(topic);
        }
      };
    },
  };
}
