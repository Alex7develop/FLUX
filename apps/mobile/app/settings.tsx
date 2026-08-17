import { color } from '@flux/design-tokens';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.body}>
        Privacy, devices, and account controls will live here. No cloud project is required yet.
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
