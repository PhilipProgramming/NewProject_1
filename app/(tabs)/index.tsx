import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedSalesValue } from '@/components/AnimatedSalesValue';
import { EditorialPage } from '@/components/EditorialPage';
import { EditorialPace } from '@/components/EditorialPace';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TodayPageDate } from '@/components/TodayPageDate';
import { useAppState } from '@/context/AppContext';
import { useTodayMetrics } from '@/hooks/useTodayMetrics';
import { colors, fonts, spacing } from '@/constants/theme';
import { generateDailyObservation } from '@/lib/observations';

/**
 * Today — daily briefing with sales, goal pace, and maison notes.
 */
export default function TodayScreen() {
  const { isLoading } = useAppState();
  const { activity, metrics, hasData } = useTodayMetrics();

  const observation = generateDailyObservation(
    activity,
    metrics,
    hasData,
  );

  return (
    <EditorialPage
      title="Today"
      headerTrailing={<TodayPageDate />}
      loading={isLoading}
    >
      <View style={styles.heroBlock}>
        <Text style={styles.heroLabel}>Sales</Text>
        <AnimatedSalesValue
          value={activity.totalSales}
          active={hasData}
          style={styles.heroValue}
        />
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
    </EditorialPage>
  );
}

const styles = StyleSheet.create({
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
