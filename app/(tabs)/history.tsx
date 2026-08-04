import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EditorialPage } from '@/components/EditorialPage';
import { EmptyState } from '@/components/EmptyState';
import { useAppState } from '@/context/AppContext';
import { calculateMetrics } from '@/lib/calculations';
import { sortDateKeysDesc, formatShortDate, getTodayKey } from '@/lib/dates';
import { formatCurrency, formatPercent } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/constants/theme';

/**
 * History — read-only list of past days with sales and goal progress.
 */
export default function HistoryScreen() {
  const { isLoading, days, settings } = useAppState();

  const dateKeys = sortDateKeysDesc(Object.keys(days));
  const todayKey = getTodayKey();

  return (
    <EditorialPage title="History" loading={isLoading}>
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
              style={({ pressed, hovered }) => [
                styles.row,
                (hovered || pressed) && styles.rowActive,
              ]}
              onPress={() => router.push(`/day/${dateKey}`)}
            >
              {({ pressed, hovered }) => {
                const active = hovered || pressed;
                return (
                  <>
                    <View style={styles.rowMain}>
                      <Text
                        style={[styles.rowDate, active && styles.rowTextActive]}
                      >
                        {formatShortDate(dateKey)}
                        {isToday ? ' · Today' : ''}
                      </Text>
                      <Text
                        style={[styles.rowSales, active && styles.rowTextActive]}
                      >
                        {formatCurrency(day.totalSales)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.rowProgress,
                        active && styles.rowProgressActive,
                      ]}
                    >
                      {formatPercent(Math.min(metrics.goalProgress, 1))}
                      {metrics.goalProgress > 1 ? '+' : ''} of goal
                    </Text>
                  </>
                );
              }}
            </Pressable>
          );
        })
      )}
    </EditorialPage>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  rowActive: {
    backgroundColor: colors.brandBlue,
    borderColor: colors.brandBlue,
  },
  rowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rowDate: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    color: colors.text,
  },
  rowSales: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.accent,
  },
  rowTextActive: {
    color: colors.textOnBrand,
  },
  rowProgress: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
  },
  rowProgressActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
