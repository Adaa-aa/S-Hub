import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppNavigator() {
  const { colorScheme } = useAppTheme();

  return (
    <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
