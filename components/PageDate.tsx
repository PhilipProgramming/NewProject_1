import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '@/constants/theme';
import { formatDisplayDate, getTodayKey } from '@/lib/dates';

type PageDateProps = {
  /** Optional page title aligned left when date is shown. */
  title?: string;
};

/** Minimal page row — optional title left, date right. */
export function PageDate({ title }: PageDateProps) {
  return (
    <View style={styles.row}>
      {title ? <Text style={styles.title}>{title}</Text> : <View style={styles.spacer} />}
      <Text style={styles.date}>{formatDisplayDate(getTodayKey())}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  spacer: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.text,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
    flexShrink: 0,
  },
});
