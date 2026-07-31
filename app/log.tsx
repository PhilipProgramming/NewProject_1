import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BrandHeader } from '@/components/BrandHeader';
import { NumberField } from '@/components/NumberField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { useAppState } from '@/context/AppContext';
import { useTodayMetrics } from '@/hooks/useTodayMetrics';
import { colors, fonts, spacing } from '@/constants/theme';
import { formatDisplayDate } from '@/lib/dates';
import {
  activityToFormValues,
  validateActivityForm,
  type FieldErrors,
} from '@/lib/validation';

/**
 * Log screen — manual entry for today's performance inputs including hours worked.
 * Opened from Dashboard via stack push (modal presentation).
 */
export default function LogScreen() {
  const { isLoading, isSaving, upsertToday } = useAppState();
  const { activity, dateKey } = useTodayMetrics();

  const [totalSales, setTotalSales] = useState('');
  const [transactions, setTransactions] = useState('');
  const [shoesSold, setShoesSold] = useState('');
  const [accessoriesSold, setAccessoriesSold] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading && !initialized) {
      const values = activityToFormValues(activity);
      setTotalSales(values.totalSales);
      setTransactions(values.transactions);
      setShoesSold(values.shoesSold);
      setAccessoriesSold(values.accessoriesSold);
      setHoursWorked(values.hoursWorked);
      setInitialized(true);
    }
  }, [isLoading, initialized, activity]);

  async function handleSave() {
    const result = validateActivityForm({
      totalSales,
      transactions,
      shoesSold,
      accessoriesSold,
      hoursWorked,
    });

    setErrors(result.errors);
    if (!result.data) {
      return;
    }

    try {
      await upsertToday(result.data);
      router.back();
    } catch {
      Alert.alert('Save failed', 'Please try again.');
    }
  }

  if (isLoading) {
    return (
      <ScreenBackground style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <BrandHeader subtitle="Log today's activity" />
          <Text style={styles.date}>{formatDisplayDate(dateKey)}</Text>

          <NumberField
            label="Hours worked"
            value={hoursWorked}
            onChangeText={setHoursWorked}
            keyboardType="decimal-pad"
            error={errors.hoursWorked}
          />
          <NumberField
            label="Total sales amount"
            value={totalSales}
            onChangeText={setTotalSales}
            prefix="$"
            keyboardType="decimal-pad"
            error={errors.totalSales}
          />
          <NumberField
            label="Number of transactions"
            value={transactions}
            onChangeText={setTransactions}
            error={errors.transactions}
          />
          <NumberField
            label="Number of shoes sold"
            value={shoesSold}
            onChangeText={setShoesSold}
            error={errors.shoesSold}
          />
          <NumberField
            label="Number of accessories sold"
            value={accessoriesSold}
            onChangeText={setAccessoriesSold}
            error={errors.accessoriesSold}
          />

          <PrimaryButton
            label={isSaving ? 'Saving…' : 'Save today\'s activity'}
            onPress={handleSave}
            disabled={isSaving}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    marginTop: -spacing.md,
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
