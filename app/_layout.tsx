import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '../store/authStore';
import LoadingScreen from '../components/common/LoadingScreen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * The root layout component that sets up the fonts, loads stored auth, and
 * manages the app's navigation stack.
 *
 * It waits for the fonts to load and the stored auth to load before hiding
 * the splash screen and rendering the app.
 *
 * If the fonts are not loaded, it renders a loading screen with a message.
 * If the stored auth is still loading, it renders a loading screen with a
 * different message.
 *
 * Otherwise, it renders the app's navigation stack with the auth and tabs
 * screens.
 */
export default function RootLayout() {
  useFrameworkReady();

  const { loadStoredAuth, isLoading, token } = useAuthStore();


  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  if (!fontsLoaded && !fontError) {
    return <LoadingScreen message="Loading fonts..." />;
  }

  if (isLoading) {
    return <LoadingScreen message="Initializing..." />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
      { !token && <Stack.Screen name="(auth)" /> }
      {  token && <Stack.Screen name="(tabs)" /> }
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}