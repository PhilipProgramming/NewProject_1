import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ScreenBackground } from '@/components/ScreenBackground';
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

  if (isLoading) {
    return (
      <ScreenBackground style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.title}>History</Text>

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
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    color: colors.text,
    marginBottom: spacing.xxl,
    letterSpacing: -0.3,
  },
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
    fontSize: 15,
    color: colors.text,
  },
  rowSales: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.accent,
  },
  rowTextActive: {
    color: colors.textOnBrand,
  },
  rowProgress: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  rowProgressActive: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
