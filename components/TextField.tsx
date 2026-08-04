import { StyleSheet, Text, TextInput, View } from 'react-native';

import { VALIDATION_LIMITS } from '@/constants/validationLimits';
import { formFieldStyles } from '@/constants/typography';
import { sanitizePersonName } from '@/lib/validation';
import { colors } from '@/constants/theme';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

/** Text input for non-numeric fields like associate name. */
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
}: TextFieldProps) {
  function handleChangeText(text: string) {
    onChangeText(sanitizePersonName(text));
  }

  return (
    <View style={formFieldStyles.container}>
      <Text style={formFieldStyles.label}>{label}</Text>
      <TextInput
        style={formFieldStyles.input}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        returnKeyType="done"
        maxLength={VALIDATION_LIMITS.personNameMaxLength}
      />
    </View>
  );
}
