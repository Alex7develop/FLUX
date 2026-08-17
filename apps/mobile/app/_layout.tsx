import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { color } from '@flux/design-tokens';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.background }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: color.background },
            headerTintColor: color.textPrimary,
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: color.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'FLUX' }} />
          <Stack.Screen name="devices" options={{ title: 'Devices' }} />
          <Stack.Screen name="inbox" options={{ title: 'Inbox' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
