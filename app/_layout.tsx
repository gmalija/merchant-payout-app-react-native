import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { useMSW } from '../mocks/useMSW';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { QueryProvider } from '@/shared/providers/query-provider';
import { useThemeColor } from '@/shared/index';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  // Initialize MSW in development mode and wait for it to be ready
  const isMSWReady = useMSW();

  useEffect(() => {
    if (isMSWReady) {
      // Hide the splash screen once MSW is ready
      SplashScreen.hideAsync();
    }
  }, [isMSWReady]);

  // Show loading indicator while MSW initializes (in dev mode)
  if (!isMSWReady) {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: backgroundColor}]}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});