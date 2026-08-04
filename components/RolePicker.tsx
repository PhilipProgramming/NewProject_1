import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ROLE_LABELS } from '@/constants/defaults';
import { buttonStyles, formFieldStyles, FORM_INPUT_MIN_HEIGHT } from '@/constants/typography';
import { colors, radius, spacing } from '@/constants/theme';
import type { AssociateRole } from '@/types/models';

type RolePickerProps = {
  label: string;
  value: AssociateRole;
  onChange: (role: AssociateRole) => void;
};

/**
 * Two-option role selector — Associate vs Team Lead.
 * Uses Pressable buttons instead of a native Picker for clearer UX on web.
 */
export function RolePicker({ label, value, onChange }: RolePickerProps) {
  const roles: AssociateRole[] = ['associate', 'team_lead'];

  return (
    <View style={formFieldStyles.container}>
      <Text style={formFieldStyles.label}>{label}</Text>
      <View style={styles.row}>
        {roles.map((role) => {
          const selected = value === role;
          return (
            <Pressable
              key={role}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onChange(role)}
            >
              <Text
                style={[
                  buttonStyles.label,
                  styles.optionText,
                  selected && styles.optionTextSelected,
                ]}
              >
                {ROLE_LABELS[role]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: FORM_INPUT_MIN_HEIGHT,
  },
  optionSelected: {
    borderColor: colors.brandBlue,
    backgroundColor: colors.brandBlue,
  },
  optionText: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.textOnBrand,
  },
});
