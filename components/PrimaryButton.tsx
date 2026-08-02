import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, fonts, spacing } from '@/constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

/** Quiet editorial action — outline at rest, navy fill on hover/press. */
export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed, hovered }) => [
        styles.button,
        (hovered || pressed) && styles.buttonActive,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
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
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  buttonActive: {
    backgroundColor: colors.brandBlue,
    borderColor: colors.brandBlue,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.textOnBrand,
  },
});
