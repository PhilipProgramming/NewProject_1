import { StyleSheet, Text, TextInput, View } from 'react-native';

import { formFieldStyles } from '@/constants/typography';
import { colors } from '@/constants/theme';

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
    <View style={formFieldStyles.container}>
      <Text style={formFieldStyles.label}>{label}</Text>
      <View style={[formFieldStyles.inputRow, error ? styles.inputError : null]}>
        {prefix ? <Text style={formFieldStyles.prefix}>{prefix}</Text> : null}
        <TextInput
          style={formFieldStyles.inputInner}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
        />
      </View>
      {error ? <Text style={formFieldStyles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputError: {
    borderColor: colors.error,
  },
});
