import { color } from '@flux/design-tokens';
import { visualStatusCopy } from '@flux/types';
import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { runDropDemo } from '../src/features/runDropDemo';
import { useFluxStore } from '../src/store/useFluxStore';

export default function HomeScreen() {
  const visualState = useFluxStore((state) => state.visualState);
  const setVisualState = useFluxStore((state) => state.setVisualState);
  const running = useRef(false);

  const onSend = useCallback(async () => {
    if (running.current) {
      return;
    }
    running.current = true;
    try {
      await runDropDemo(setVisualState);
    } finally {
      running.current = false;
    }
  }, [setVisualState]);

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Phone · ready</Text>
      <Text style={styles.title}>FLUX</Text>
      <Text style={styles.status}>{visualStatusCopy[visualState]}</Text>

      <View style={styles.core} />

      <Link href="/devices" asChild>
        <Pressable style={styles.primary} accessibilityRole="button">
          <Text style={styles.primaryLabel}>Connect device</Text>
        </Pressable>
      </Link>
      <Pressable
        style={styles.secondary}
        accessibilityRole="button"
        onPress={() => void onSend()}
      >
        <Text style={styles.secondaryLabel}>Send something</Text>
      </Pressable>

      <View style={styles.links}>
        <Link href="/inbox" style={styles.link}>
          Inbox
        </Link>
        <Link href="/devices" style={styles.link}>
          Devices
        </Link>
        <Link href="/settings" style={styles.link}>
          Settings
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: color.background,
  },
  kicker: {
    color: color.textSecondary,
    letterSpacing: 3,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 16,
    color: color.textPrimary,
    fontSize: 42,
    fontWeight: '600',
    letterSpacing: 8,
  },
  status: {
    marginTop: 12,
    color: color.textSecondary,
    fontSize: 16,
  },
  core: {
    width: 88,
    height: 88,
    marginVertical: 36,
    borderRadius: 999,
    backgroundColor: color.surfaceElevated,
    borderWidth: 1,
    borderColor: color.accentMuted,
    shadowColor: color.accent,
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  primary: {
    width: '100%',
    maxWidth: 320,
    minHeight: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.textPrimary,
  },
  primaryLabel: {
    color: color.background,
    fontWeight: '600',
  },
  secondary: {
    width: '100%',
    maxWidth: 320,
    minHeight: 48,
    marginTop: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: color.border,
  },
  secondaryLabel: {
    color: color.textPrimary,
    fontWeight: '600',
  },
  links: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 36,
  },
  link: {
    color: color.textSecondary,
    fontSize: 14,
  },
});
