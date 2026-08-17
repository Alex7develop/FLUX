export type DevicePlatform = 'ios' | 'android' | 'macos' | 'windows' | 'web' | 'linux';

export interface Device {
  id: string;
  name: string;
  platform: DevicePlatform;
  createdAt: string;
  lastSeenAt?: string;
}
