import { StyleSheet, Text, TextInput, View } from 'react-native';

import { formFieldStyles } from '@/constants/typography';
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
  return (
    <View style={formFieldStyles.container}>
      <Text style={formFieldStyles.label}>{label}</Text>
      <TextInput
        style={formFieldStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        returnKeyType="done"
      />
    </View>
  );
}
