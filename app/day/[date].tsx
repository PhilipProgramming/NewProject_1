import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MetricCard } from '@/components/MetricCard';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenBackground } from '@/components/ScreenBackground';
import { pageTitleStyles } from '@/constants/pageLayout';
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
import { colors, fonts, spacing } from '@/constants/theme';
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
      <ScreenBackground style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </ScreenBackground>
    );
  }

  if (!day) {
    return (
      <ScreenBackground style={styles.centered}>
        <Text style={styles.notFound}>No data found for this day.</Text>
      </ScreenBackground>
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
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={pageTitleStyles.title}>{formatDisplayDate(dateKey)}</Text>

        <View style={styles.glanceRow}>
          <Text style={pageTitleStyles.title}>{glanceLabel}</Text>
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
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxl,
    paddingTop: spacing.xl,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  percent: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
    color: colors.text,
    flexShrink: 0,
  },
  notFound: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
});
