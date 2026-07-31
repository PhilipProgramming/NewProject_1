import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { MetricDefinition } from '@/constants/metricsDictionary';

type DictionaryEntryProps = {
  metric: MetricDefinition;
};

/**
 * One row in the data dictionary — name, description, and formula.
 * Kept separate from MetricCard so reference content can be longer.
 */
export function DictionaryEntry({ metric }: DictionaryEntryProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{metric.name}</Text>
      <Text style={styles.description}>{metric.description}</Text>
      <View style={styles.formulaBox}>
        <Text style={styles.formulaLabel}>How it&apos;s calculated</Text>
        <Text style={styles.formula}>{metric.formula}</Text>
      </View>
      {metric.note ? (
        <Text style={styles.note}>{metric.note}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  formulaBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  formulaLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  formula: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
