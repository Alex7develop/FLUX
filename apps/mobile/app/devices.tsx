import { color } from '@flux/design-tokens';
import { StyleSheet, Text, View } from 'react-native';

export default function DevicesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Devices</Text>
      <Text style={styles.body}>
        Pairing is not live yet. Nearby phones, Macs, and Windows machines will show up here.
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
