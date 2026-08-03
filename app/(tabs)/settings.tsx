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

import { RolePicker } from '@/components/RolePicker';
import { NumberField } from '@/components/NumberField';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextLinkButton } from '@/components/TextLinkButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SettingsFooter } from '@/components/SettingsFooter';
import { useAppState } from '@/context/AppContext';
import { colors, fonts, spacing } from '@/constants/theme';
import type { AssociateRole } from '@/types/models';

/**
 * Settings — configure daily goal, commission rate, role, and associate name.
 */
export default function SettingsScreen() {
  const { isLoading, isSaving, settings, updateSettings, error } =
    useAppState();

  const [associateName, setAssociateName] = useState('');
  const [dailySalesGoal, setDailySalesGoal] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [role, setRole] = useState<AssociateRole>('associate');
  const [errors, setErrors] = useState<{
    dailySalesGoal?: string;
    commissionRate?: string;
  }>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isLoading && !initialized) {
      setAssociateName(settings.associateName);
      setDailySalesGoal(String(settings.dailySalesGoal));
      setCommissionRate(String(settings.commissionRate));
      setRole(settings.role);
      setInitialized(true);
    }
  }, [isLoading, initialized, settings]);

  async function handleSave() {
    const fieldErrors: typeof errors = {};

    const goal = Number(dailySalesGoal);
    if (!Number.isFinite(goal) || goal <= 0) {
      fieldErrors.dailySalesGoal = 'Enter a goal greater than 0.';
    }

    const rate = Number(commissionRate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      fieldErrors.commissionRate = 'Enter a rate between 0 and 100.';
    }

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    try {
      await updateSettings({
        associateName: associateName.trim(),
        dailySalesGoal: goal,
        commissionRate: rate,
        role,
      });
      Alert.alert('Saved', 'Your settings have been updated.');
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
          <Text style={styles.title}>Settings</Text>

          <View style={styles.form}>
            <TextField
              label="Your name (optional)"
              value={associateName}
              onChangeText={setAssociateName}
              placeholder="Alex"
            />
            <Text style={styles.nameHint}>
              Shown as a greeting on the Dashboard.
            </Text>

            <RolePicker
              label="Your role"
              value={role}
              onChange={setRole}
            />
            <Text style={styles.nameHint}>
              Sets base hourly pay: $2 for associates, $4 for team leads.
            </Text>

            <NumberField
              label="Daily sales goal ($)"
              value={dailySalesGoal}
              onChangeText={setDailySalesGoal}
              prefix="$"
              keyboardType="decimal-pad"
              error={errors.dailySalesGoal}
            />
            <NumberField
              label="Commission rate (%)"
              value={commissionRate}
              onChangeText={setCommissionRate}
              keyboardType="decimal-pad"
              error={errors.commissionRate}
            />

            <PrimaryButton
              label={isSaving ? 'Saving…' : 'Save settings'}
              onPress={handleSave}
              disabled={isSaving}
              style={styles.saveButton}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextLinkButton
              label="How metrics are calculated →"
              onPress={() => router.push('/dictionary')}
              style={styles.dictionaryLink}
            />
          </View>

          <SettingsFooter />
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
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.xxl,
    letterSpacing: -0.3,
  },
  form: {
    flex: 1,
  },
  nameHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  dictionaryLink: {
    marginTop: spacing.xl,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
