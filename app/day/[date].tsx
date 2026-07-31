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
import { ROLE_LABELS } from '@/constants/defaults';
import { useAppState } from '@/context/AppContext';
import { calculateMetrics } from '@/lib/calculations';
import { formatDisplayDate } from '@/lib/dates';
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
 * Route param [date] is the YYYY-MM-DD key from History.
 */
export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { isLoading, days, settings } = useAppState();

  const dateKey = typeof date === 'string' ? date : '';
  const day = days[dateKey];

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

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.date}>{formatDisplayDate(dateKey)}</Text>
        <ProgressBar progress={metrics.goalProgress} />

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
            hint={`${settings.commissionRate}% rate`}
          />
          <MetricCard
            label="FAR"
            value={formatFar(metrics.far)}
            hint="Accessories ÷ shoes"
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
            hint={ROLE_LABELS[settings.role]}
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
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontFamily: fonts.brandRegular,
    fontSize: 24,
    color: colors.text,
    marginBottom: spacing.lg,
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
