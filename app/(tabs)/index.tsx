import { router } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EditorialPace } from '@/components/EditorialPace';
import { PageDate } from '@/components/PageDate';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { useAppState } from '@/context/AppContext';
import { useTodayMetrics } from '@/hooks/useTodayMetrics';
import { colors, fonts, spacing } from '@/constants/theme';
import { formatCurrency } from '@/lib/format';
import { generateDailyObservation } from '@/lib/observations';

/**
 * Today — daily briefing with sales, goal pace, and maison notes.
 */
export default function TodayScreen() {
  const { isLoading } = useAppState();
  const { activity, metrics, hasData } = useTodayMetrics();

  if (isLoading) {
    return (
      <ScreenBackground style={styles.centered}>
        <ActivityIndicator color={colors.textMuted} size="large" />
      </ScreenBackground>
    );
  }

  const observation = generateDailyObservation(
    activity,
    metrics,
    hasData,
  );

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <PageDate title="Today" />

        <View style={styles.heroBlock}>
          <Text style={styles.heroLabel}>Sales</Text>
          <Text style={styles.heroValue}>
            {hasData ? formatCurrency(activity.totalSales) : '—'}
          </Text>
        </View>

        {hasData ? (
          <EditorialPace progress={metrics.goalProgress} />
        ) : (
          <View style={styles.pacePlaceholder}>
            <Text style={styles.heroLabel}>Goal pace</Text>
            <Text style={styles.paceEmpty}>—</Text>
          </View>
        )}

        <View style={styles.observationBlock}>
          <Text style={styles.observationLabel}>Notes from the Maison</Text>
          <Text style={styles.observationText}>{observation}</Text>
        </View>

        <PrimaryButton
          label={hasData ? 'Update today\'s figures' : 'Record today\'s figures'}
          onPress={() => router.push('/log')}
          style={styles.cta}
        />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBlock: {
    marginBottom: spacing.xxxl,
  },
  heroLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  heroValue: {
    fontFamily: fonts.display,
    fontSize: 56,
    color: colors.text,
    lineHeight: 60,
    letterSpacing: -1,
  },
  pacePlaceholder: {
    marginBottom: spacing.xxxl,
  },
  paceEmpty: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.textMuted,
    lineHeight: 40,
  },
  observationBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  observationLabel: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  observationText: {
    fontFamily: fonts.displayRegular,
    fontSize: 20,
    color: colors.text,
    lineHeight: 30,
  },
  cta: {
    alignSelf: 'flex-start',
  },
});
