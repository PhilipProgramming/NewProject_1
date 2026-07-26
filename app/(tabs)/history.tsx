import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BrandHeader } from '@/components/BrandHeader';
import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/ScreenBackground';
import { useAppState } from '@/context/AppContext';
import { calculateMetrics } from '@/lib/calculations';
import { sortDateKeysDesc, formatShortDate, getTodayKey } from '@/lib/dates';
import { formatCurrency, formatPercent } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/constants/theme';

/**
 * History tab — read-only list of past days with sales and goal progress.
 */
export default function HistoryScreen() {
  const { isLoading, days, settings } = useAppState();

  const dateKeys = sortDateKeysDesc(Object.keys(days));
  const todayKey = getTodayKey();

  if (isLoading) {
    return (
      <ScreenBackground withTabBar style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground withTabBar>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <BrandHeader subtitle="History" />

        {dateKeys.length === 0 ? (
          <EmptyState
            title="No history yet"
            message="Days you log will appear here so you can review recent performance."
          />
        ) : (
          dateKeys.map((dateKey) => {
            const day = days[dateKey];
            const metrics = calculateMetrics(day, settings);
            const isToday = dateKey === todayKey;

            return (
              <Pressable
                key={dateKey}
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
                onPress={() => router.push(`/day/${dateKey}`)}
              >
                <View style={styles.rowMain}>
                  <Text style={styles.rowDate}>
                    {formatShortDate(dateKey)}
                    {isToday ? ' · Today' : ''}
                  </Text>
                  <Text style={styles.rowSales}>
                    {formatCurrency(day.totalSales)}
                  </Text>
                </View>
                <Text style={styles.rowProgress}>
                  {formatPercent(Math.min(metrics.goalProgress, 1))}
                  {metrics.goalProgress > 1 ? '+' : ''} of goal
                </Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xl,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rowDate: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.text,
  },
  rowSales: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.accent,
  },
  rowProgress: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
});
