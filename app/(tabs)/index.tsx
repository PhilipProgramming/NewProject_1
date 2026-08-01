import { router } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { BrandHeader } from '@/components/BrandHeader';
import { MetricCard } from '@/components/MetricCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { ScreenBackground } from '@/components/ScreenBackground';
import { useAppState } from '@/context/AppContext';
import { useTodayMetrics } from '@/hooks/useTodayMetrics';
import { colors, fonts, spacing } from '@/constants/theme';
import {
  formatCurrency,
  formatCount,
  formatFar,
  formatHourlyRate,
  formatHours,
} from '@/lib/format';

/**
 * Dashboard — the associate's home screen for today's performance.
 * Shows derived KPIs; raw numbers are entered on the Log screen.
 */
export default function DashboardScreen() {
  const { isLoading, settings } = useAppState();
  const { activity, metrics, hasData } = useTodayMetrics();

  if (isLoading) {
    return (
      <ScreenBackground withTabBar style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </ScreenBackground>
    );
  }

  const greeting = settings.associateName
    ? `Welcome back, ${settings.associateName}`
    : "Today's performance";

  return (
    <ScreenBackground withTabBar>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <BrandHeader subtitle={greeting} showDate />

        <Animated.View
          entering={FadeInDown.duration(500)}
          style={styles.progressWrapper}
        >
          <ProgressBar progress={metrics.goalProgress} />
        </Animated.View>

        {!hasData ? (
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <View style={styles.emptyBanner}>
              <Text style={styles.emptyTitle}>No activity logged yet</Text>
              <Text style={styles.emptyMessage}>
                Enter today&apos;s numbers to see your KPIs update in real time.
              </Text>
            </View>
          </Animated.View>
        ) : null}

        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.metricsSection}
        >
          <Text style={styles.sectionTitle}>Key metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Total sales"
              value={formatCurrency(activity.totalSales)}
            />
            <MetricCard
              label="Transactions"
              value={formatCount(activity.transactions)}
            />
            <MetricCard
              label="Avg transaction"
              value={formatCurrency(metrics.averageTransactionValue)}
            />
            <MetricCard
              label="Commission"
              value={formatCurrency(metrics.commissionEarned)}
            />
            <MetricCard
              label="Shoes sold"
              value={formatCount(activity.shoesSold)}
            />
            <MetricCard
              label="Accessories"
              value={formatCount(activity.accessoriesSold)}
            />
            <MetricCard
              label="Attachment rate"
              value={formatFar(metrics.far)}
            />
            <MetricCard
              label="Goal"
              value={formatCurrency(settings.dailySalesGoal)}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.metricsSection}
        >
          <Text style={styles.sectionTitle}>Earnings</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="Hours worked"
              value={formatHours(activity.hoursWorked)}
            />
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
        </Animated.View>

        <PrimaryButton
          label={hasData ? "Update today's numbers" : "Log today's numbers"}
          onPress={() => router.push('/log')}
          style={styles.cta}
        />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xl,
    overflow: 'visible',
  },
  progressWrapper: {
    overflow: 'visible',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBanner: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyMessage: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  metricsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cta: {
    marginTop: spacing.sm,
  },
});
