import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';

type TextLinkButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

/** Secondary navigation button — navy fill on hover/press like PrimaryButton. */
export function TextLinkButton({ label, onPress, style }: TextLinkButtonProps) {
  return (
    <Pressable
      style={({ pressed, hovered }) => [
        styles.button,
        (hovered || pressed) && styles.buttonActive,
        style,
      ]}
      onPress={onPress}
    >
      {({ pressed, hovered }) => (
        <Text
          style={[
            styles.label,
            (hovered || pressed) && styles.labelActive,
          ]}
        >
          {label}
        </Text>
      )}
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
  buttonActive: {
    backgroundColor: colors.brandBlue,
    borderColor: colors.brandBlue,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.accent,
  },
  labelActive: {
    color: colors.textOnBrand,
  },
});
