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
import { RolePicker } from '@/components/RolePicker';
import { NumberField } from '@/components/NumberField';
import { TextField } from '@/components/TextField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextLinkButton } from '@/components/TextLinkButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { BRAND } from '@/constants/defaults';
import { useAppState } from '@/context/AppContext';
import { colors, fonts, spacing } from '@/constants/theme';
import type { AssociateRole } from '@/types/models';
import {
  validateActivityForm,
  type FieldErrors,
} from '@/lib/validation';

/**
 * Settings — configure daily goal, commission rate, role, and associate name.
 * Changes persist to AsyncStorage via AppContext.updateSettings.
 */
export default function SettingsScreen() {
  const { isLoading, isSaving, settings, updateSettings, error } =
    useAppState();

  const [associateName, setAssociateName] = useState('');
  const [dailySalesGoal, setDailySalesGoal] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [role, setRole] = useState<AssociateRole>('associate');
  const [errors, setErrors] = useState<
    FieldErrors & {
      dailySalesGoal?: string;
      commissionRate?: string;
    }
  >({});
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
      <ScreenBackground withTabBar style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground withTabBar>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <BrandHeader subtitle="Settings" />

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

          <View style={styles.about}>
            <Text style={styles.aboutTitle}>About {BRAND.appName}</Text>
            <Text style={styles.aboutText}>{BRAND.tagline}</Text>
            <Text style={styles.aboutText}>
              Version 0.2 · {BRAND.company}
            </Text>
            <Text style={styles.aboutText}>
              A performance journal — not a payment processor.
            </Text>
          </View>
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
  nameHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  saveButton: {
    marginTop: spacing.md,
  },
  dictionaryLink: {
    marginTop: spacing.lg,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  about: {
    marginTop: spacing.xxl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  aboutTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  aboutText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
});
