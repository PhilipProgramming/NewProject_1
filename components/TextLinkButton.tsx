import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { buttonStyles } from '@/constants/typography';
import { colors, radius, spacing } from '@/constants/theme';

type TextLinkButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

/** Secondary navigation button — navy fill on hover/press like PrimaryButton. */
export function TextLinkButton({
  label,
  onPress,
  style,
  disabled = false,
}: TextLinkButtonProps) {
  return (
    <Pressable
      style={({ pressed, hovered }) => [
        styles.button,
        (hovered || pressed) && !disabled && styles.buttonActive,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {({ pressed, hovered }) => (
        <Text
          style={[
            buttonStyles.labelAccent,
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
  disabled: {
    opacity: 0.4,
  },
});
