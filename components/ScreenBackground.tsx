import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type ScreenBackgroundProps = {
  children: ReactNode;
  withTabBar?: boolean;
  style?: ViewStyle;
};

/** Warm off-white canvas — no gradients, editorial calm. */
export function ScreenBackground({
  children,
  withTabBar = false,
  style,
}: ScreenBackgroundProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: withTabBar ? 8 : insets.bottom + 24,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
});
