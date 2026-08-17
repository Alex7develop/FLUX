export interface IceEnv {
  stunUrls?: string;
  turnUrl?: string;
  turnUsername?: string;
  turnCredential?: string;
}

export function resolveIceServers(env: IceEnv = {}): RTCIceServer[] {
  const stun = (env.stunUrls ?? 'stun:stun.l.google.com:19302')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const servers: RTCIceServer[] = [{ urls: stun.length === 1 ? (stun[0] as string) : stun }];

  if (env.turnUrl && env.turnUsername && env.turnCredential) {
    servers.push({
      urls: env.turnUrl,
      username: env.turnUsername,
      credential: env.turnCredential,
    });
  }

  return servers;
}
