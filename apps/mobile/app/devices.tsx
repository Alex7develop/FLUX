import { color } from '@flux/design-tokens';
import { StyleSheet, Text, View } from 'react-native';

export default function DevicesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Devices</Text>
      <Text style={styles.body}>
        Pairing on web uses a short code and a WebRTC data channel. Native transfer will use the
        same session types. For now, connect two FLUX browser tabs.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 24,
    backgroundColor: color.background,
  },
  title: {
    color: color.textPrimary,
    fontSize: 28,
    fontWeight: '600',
  },
  body: {
    marginTop: 12,
    color: color.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
});
