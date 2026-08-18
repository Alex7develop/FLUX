import { describe, expect, it } from 'vitest';
import { cn, formatBytes, sha256Hex } from './index';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b');
  });
});

describe('sha256Hex', () => {
  it('hashes the empty string', async () => {
    expect(await sha256Hex(new TextEncoder().encode(''))).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

describe('formatBytes', () => {
  it('formats bytes and larger units', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(1_048_576)).toBe('1.0 MB');
  });
});
