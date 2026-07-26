import { StyleSheet, Text, View } from 'react-native';

import { BRAND } from '@/constants/defaults';
import { colors, fonts, spacing } from '@/constants/theme';
import { formatDisplayDate, getTodayKey } from '@/lib/dates';

type BrandHeaderProps = {
  /** Optional subtitle under the brand, e.g. "Today's performance". */
  subtitle?: string;
  /** Show today's date under the subtitle. */
  showDate?: boolean;
};

/**
 * Hero-level brand block — Pomegranate should dominate the first viewport.
 */
export function BrandHeader({ subtitle, showDate = false }: BrandHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>{BRAND.appName}</Text>
      <Text style={styles.company}>{BRAND.company}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {showDate ? (
        <Text style={styles.date}>{formatDisplayDate(getTodayKey())}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  brand: {
    fontFamily: fonts.brand,
    fontSize: 42,
    color: colors.text,
    letterSpacing: -0.5,
  },
  company: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.md,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
