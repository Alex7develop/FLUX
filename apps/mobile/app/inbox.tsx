import { color } from '@flux/design-tokens';
import { StyleSheet, Text, View } from 'react-native';

export default function InboxScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Inbox</Text>
      <Text style={styles.body}>
        Received items will appear here after transfer. This screen is a shell for later phases.
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
