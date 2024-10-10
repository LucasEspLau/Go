import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="Productos" options={{ headerShown: false }}/>
        <Stack.Screen name="Establecimientos" options={{ headerShown: false }}/>
        {/*<Stack.Screen name="Search" options={{ headerShown: false }}/>*/}
        <Stack.Screen name="establecimiento" options={{ headerShown: false }} />
        <Stack.Screen name="producto" options={{ headerShown: false }} />
        
      </Stack>
      <Toast />

    </ThemeProvider>
  );
}
