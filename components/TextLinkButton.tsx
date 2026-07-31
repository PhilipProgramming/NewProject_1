import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';

type TextLinkButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

/** Secondary text-style button for navigation links (e.g. open data dictionary). */
export function TextLinkButton({ label, onPress, style }: TextLinkButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.accent,
  },
});
