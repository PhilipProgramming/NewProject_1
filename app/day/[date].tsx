import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MetricCard } from '@/components/MetricCard';
import { EditorialNav } from '@/components/EditorialNav';
import { PageTitle } from '@/components/PageTitle';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenBackground } from '@/components/ScreenBackground';
import { PAGE_CONTENT_GAP } from '@/constants/pageLayout';
import {
  sectionLabelSpacing,
  typography,
} from '@/constants/typography';
import { useAppState } from '@/context/AppContext';
import { calculateMetrics } from '@/lib/calculations';
import { formatDisplayDate, getTodayKey } from '@/lib/dates';
import {
  formatCount,
  formatCurrency,
  formatFar,
  formatHourlyRate,
  formatHours,
  formatPercent,
} from '@/lib/format';
import { colors, spacing } from '@/constants/theme';
import type { ActivityInput } from '@/types/models';

/** Ensure older saved days without hoursWorked still calculate correctly. */
function toActivityInput(day: {
  totalSales: number;
  transactions: number;
  shoesSold: number;
  accessoriesSold: number;
  hoursWorked?: number;
}): ActivityInput {
  return {
    totalSales: day.totalSales,
    transactions: day.transactions,
    shoesSold: day.shoesSold,
    accessoriesSold: day.accessoriesSold,
    hoursWorked: day.hoursWorked ?? 0,
  };
}

/**
 * Day detail — read-only breakdown for a single past day.
 */
export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { isLoading, days, settings } = useAppState();

  const dateKey = typeof date === 'string' ? date : '';
  const day = days[dateKey];
  const isToday = dateKey === getTodayKey();

  if (isLoading) {
    return (
      <View style={styles.page}>
        <EditorialNav />
        <ScreenBackground style={styles.centered}>
          <ActivityIndicator color={colors.accent} size="large" />
        </ScreenBackground>
      </View>
    );
  }

  if (!day) {
    return (
      <View style={styles.page}>
        <EditorialNav />
        <ScreenBackground style={styles.centered}>
          <Text style={styles.notFound}>No data found for this day.</Text>
        </ScreenBackground>
      </View>
    );
  }

  const activity = toActivityInput(day);
  const metrics = calculateMetrics(activity, settings);
  const goalComplete = metrics.goalProgress >= 1;
  const percentLabel =
    metrics.goalProgress >= 1
      ? formatPercent(1)
      : formatPercent(metrics.goalProgress);
  const statusLabel = goalComplete ? 'Goal Completed!' : 'in progress';
  const glanceLabel = isToday ? 'Today at a glance' : 'Day at a glance';

  return (
    <View style={styles.page}>
      <EditorialNav />
      <ScreenBackground>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <PageTitle title={formatDisplayDate(dateKey)} />

          <View style={[styles.content, styles.glanceRow]}>
            <Text style={styles.glanceLabel}>{glanceLabel}</Text>
            <Text style={styles.percent}>{percentLabel}</Text>
          </View>

          <ProgressBar
            progress={metrics.goalProgress}
            statusLabel={statusLabel}
          />

          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Hours worked"
              value={formatHours(activity.hoursWorked)}
            />
            <MetricCard
              label="Total sales"
              value={formatCurrency(day.totalSales)}
            />
            <MetricCard
              label="Transactions"
              value={formatCount(day.transactions)}
            />
            <MetricCard
              label="Shoes sold"
              value={formatCount(day.shoesSold)}
            />
            <MetricCard
              label="Accessories"
              value={formatCount(day.accessoriesSold)}
            />
          </View>

          <Text style={styles.sectionTitle}>Calculated</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Avg transaction"
              value={formatCurrency(metrics.averageTransactionValue)}
            />
            <MetricCard
              label="Commission"
              value={formatCurrency(metrics.commissionEarned)}
            />
            <MetricCard
              label="Attachment rate"
              value={formatFar(metrics.far)}
            />
            <MetricCard
              label="Goal progress"
              value={formatPercent(metrics.goalProgress)}
            />
          </View>

          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Base rate"
              value={formatCurrency(metrics.baseHourlyRate) + '/hr'}
            />
            <MetricCard
              label="Base pay"
              value={formatCurrency(metrics.basePay)}
            />
            <MetricCard
              label="Total earnings"
              value={formatCurrency(metrics.totalEarnings)}
            />
            <MetricCard
              label="Effective rate"
              value={formatHourlyRate(
                metrics.effectiveHourlyRate,
                activity.hoursWorked,
              )}
            />
          </View>
        </ScrollView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },
  content: {
    marginTop: PAGE_CONTENT_GAP,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  glanceLabel: {
    ...typography.sectionLabel,
    flex: 1,
  },
  percent: {
    ...typography.displaySecondary,
    flexShrink: 0,
  },
  notFound: {
    ...typography.bodyLarge,
    color: colors.textMuted,
  },
  sectionTitle: {
    ...typography.sectionLabel,
    ...sectionLabelSpacing,
    marginTop: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
