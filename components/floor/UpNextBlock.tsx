import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NumberField } from '@/components/NumberField';
import { PrimaryButton } from '@/components/PrimaryButton';
import {
  buttonStyles,
  sectionLabelSpacing,
  typography,
} from '@/constants/typography';
import { colors, spacing } from '@/constants/theme';

type UpNextBlockProps = {
  upName: string | null;
  onAssign: (customerCount: number) => void;
  isSaving?: boolean;
};

/** Current "up" associate and the primary assign action. */
export function UpNextBlock({ upName, onAssign, isSaving }: UpNextBlockProps) {
  const [pendingAssign, setPendingAssign] = useState(false);
  const [customerCount, setCustomerCount] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleAssignPress() {
    setPendingAssign(true);
    setCustomerCount('');
    setError(undefined);
  }

  function handleCancel() {
    setPendingAssign(false);
    setCustomerCount('');
    setError(undefined);
  }

  function handleConfirm() {
    const count = Number(customerCount);
    if (!Number.isFinite(count) || count < 1 || !Number.isInteger(count)) {
      setError('Enter at least 1 customer.');
      return;
    }

    onAssign(count);
    setPendingAssign(false);
    setCustomerCount('');
    setError(undefined);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Up next</Text>
      {upName ? (
        <Text style={styles.upName}>▶ {upName}</Text>
      ) : (
        <Text style={styles.empty}>No one available</Text>
      )}

      {!pendingAssign ? (
        <PrimaryButton
          label={isSaving ? 'Assigning…' : 'Assign customer'}
          onPress={handleAssignPress}
          disabled={!upName || isSaving}
          style={styles.button}
        />
      ) : (
        <View style={styles.assignPicker}>
          <NumberField
            label="Number of customers"
            value={customerCount}
            onChangeText={setCustomerCount}
            keyboardType="number-pad"
            error={error}
          />
          <View style={styles.assignActions}>
            <PrimaryButton
              label={isSaving ? 'Assigning…' : 'Confirm assign'}
              onPress={handleConfirm}
              disabled={isSaving}
              style={styles.confirmButton}
            />
            <Pressable onPress={handleCancel} disabled={isSaving}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.sectionLabel,
    ...sectionLabelSpacing,
  },
  upName: {
    ...typography.displayMedium,
    marginBottom: spacing.lg,
  },
  empty: {
    ...typography.displaySmall,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  button: {
    alignSelf: 'flex-start',
  },
  assignPicker: {
    gap: spacing.sm,
  },
  assignActions: {
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  confirmButton: {
    alignSelf: 'flex-start',
  },
  cancel: {
    ...buttonStyles.labelAccent,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
