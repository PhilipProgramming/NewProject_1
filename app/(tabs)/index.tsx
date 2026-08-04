import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AnimatedSalesValue } from '@/components/AnimatedSalesValue';
import { EditorialPage } from '@/components/EditorialPage';
import { EditorialPace } from '@/components/EditorialPace';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TodayPageDate } from '@/components/TodayPageDate';
import { useAppState } from '@/context/AppContext';
import { useTodayMetrics } from '@/hooks/useTodayMetrics';
import {
  sectionLabelSpacing,
  typography,
} from '@/constants/typography';
import { colors, spacing } from '@/constants/theme';
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
        <Text style={styles.sectionLabel}>Sales</Text>
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
          <Text style={styles.sectionLabel}>Goal pace</Text>
          <Text style={styles.paceEmpty}>—</Text>
        </View>
      )}

      <View style={styles.observationBlock}>
        <Text style={styles.sectionLabel}>Notes from the Maison</Text>
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
  sectionLabel: {
    ...typography.sectionLabel,
    ...sectionLabelSpacing,
  },
  heroValue: {
    ...typography.displayHero,
  },
  pacePlaceholder: {
    marginBottom: spacing.xxxl,
  },
  paceEmpty: {
    ...typography.displaySecondary,
    color: colors.textMuted,
  },
  observationBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  observationText: {
    ...typography.observation,
  },
  cta: {
    alignSelf: 'flex-start',
  },
});
