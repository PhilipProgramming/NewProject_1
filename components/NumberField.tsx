import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';

type NumberFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Prefix shown inside the field, e.g. "$". */
  prefix?: string;
  error?: string;
  /** decimal-pad for dollars, number-pad for counts */
  keyboardType?: 'decimal-pad' | 'number-pad';
};

/**
 * Controlled numeric TextInput.
 * In React Native, "controlled" means the parent owns the value via props.
 */
export function NumberField({
  label,
  value,
  onChangeText,
  prefix,
  error,
  keyboardType = 'number-pad',
}: NumberFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  prefix: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 18,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
