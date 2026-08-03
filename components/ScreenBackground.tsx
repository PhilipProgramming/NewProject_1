import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

type ScreenBackgroundProps = {
  children: ReactNode;
  style?: ViewStyle;
};

/** Warm off-white canvas — generous editorial margins, no gradients. */
export function ScreenBackground({ children, style }: ScreenBackgroundProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.content,
          {
            paddingBottom: insets.bottom + spacing.xxl,
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
    paddingHorizontal: 40,
    paddingTop: spacing.xl,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
});
