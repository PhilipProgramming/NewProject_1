import {
  Fraunces_400Regular,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { AppProvider } from '@/context/AppContext';
import { colors } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

// Keep splash visible until custom fonts load.
SplashScreen.preventAutoHideAsync();

/**
 * Root layout — wraps the entire app in AppProvider and loads fonts.
 * Expo Router treats this file as the top of the navigation tree.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fraunces_400Regular,
    Fraunces_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.backgroundTop },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: 'DMSans_500Medium' },
          contentStyle: { backgroundColor: colors.backgroundBottom },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="log"
          options={{
            title: "Log Today's Activity",
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="day/[date]"
          options={{
            title: 'Day Detail',
          }}
        />
        <Stack.Screen
          name="dictionary"
          options={{
            title: 'Data Dictionary',
          }}
        />
      </Stack>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.backgroundBottom,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
