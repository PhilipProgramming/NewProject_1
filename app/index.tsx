import { Redirect } from 'expo-router';

import { WelcomeScreen } from '@/components/WelcomeScreen';
import { hasEnteredWelcome } from '@/lib/welcomeSession';

/**
 * App entry — welcome experience once per session, then Today dashboard.
 * Not linked from bottom navigation.
 */
export default function WelcomeRoute() {
  if (hasEnteredWelcome()) {
    return <Redirect href="/(tabs)" />;
  }

  return <WelcomeScreen />;
}
