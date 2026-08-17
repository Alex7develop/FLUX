export const color = {
  background: '#05060A',
  surface: '#0B0E16',
  surfaceElevated: '#121624',
  textPrimary: '#F3F5FB',
  textSecondary: '#8B93A7',
  border: 'rgba(243, 245, 251, 0.08)',
  accent: '#6EC8FF',
  accentMuted: 'rgba(110, 200, 255, 0.16)',
  accentSecondary: '#8B7CFF',
  success: '#5EEAD4',
  error: '#FB7185',
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
  9: 96,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 24,
  pill: 999,
  full: 9999,
} as const;

export const shadow = {
  glow: '0 0 80px rgba(110, 200, 255, 0.18)',
  elevated: '0 24px 80px rgba(0, 0, 0, 0.45)',
} as const;

export const blur = {
  glass: 24,
} as const;

export const motion = {
  duration: {
    fast: 160,
    base: 280,
    slow: 520,
    pulse: 2400,
  },
  easing: {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
} as const;

export const typography = {
  family: {
    sans: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
} as const;

export const tokens = {
  color,
  spacing,
  radius,
  shadow,
  blur,
  motion,
  typography,
} as const;
