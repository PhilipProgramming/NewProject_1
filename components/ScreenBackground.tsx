import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type ScreenBackgroundProps = {
  children: ReactNode;
  /** Extra padding at the bottom for tab bars. */
  withTabBar?: boolean;
  style?: ViewStyle;
};

/**
 * Full-screen atmospheric background shared by every screen.
 * LinearGradient gives depth without relying on a flat single color.
 */
export function ScreenBackground({
  children,
  withTabBar = false,
  style,
}: ScreenBackgroundProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.backgroundTop, colors.backgroundBottom]}
      style={styles.gradient}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 8,
            paddingBottom: withTabBar ? 8 : insets.bottom + 16,
          },
          style,
        ]}
      >
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
