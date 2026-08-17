import { resolveIceServers } from '@flux/transfer';

export function iceServersFromEnv() {
  return resolveIceServers({
    stunUrls: import.meta.env.VITE_STUN_URLS,
    turnUrl: import.meta.env.VITE_TURN_URL,
    turnUsername: import.meta.env.VITE_TURN_USERNAME,
    turnCredential: import.meta.env.VITE_TURN_CREDENTIAL,
  });
}
