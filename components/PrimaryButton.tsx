import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { buttonStyles } from '@/constants/typography';
import { colors, spacing } from '@/constants/theme';

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
            buttonStyles.label,
            (hovered || pressed) && buttonStyles.labelActive,
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
});
