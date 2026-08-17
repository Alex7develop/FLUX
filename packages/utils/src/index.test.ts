import { describe, expect, it } from 'vitest';
import { cn, formatBytes } from './index';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false, undefined, 'b')).toBe('a b');
  });
});

describe('formatBytes', () => {
  it('formats bytes and larger units', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(1_048_576)).toBe('1.0 MB');
  });
});
