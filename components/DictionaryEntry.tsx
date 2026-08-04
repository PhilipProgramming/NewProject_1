import { StyleSheet, Text, View } from 'react-native';

import { typography } from '@/constants/typography';
import { colors, radius, spacing } from '@/constants/theme';
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
    ...typography.bodyLarge,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodyMuted,
    marginBottom: spacing.sm,
  },
  formulaBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  formulaLabel: {
    ...typography.sectionLabel,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  formula: {
    ...typography.body,
  },
  note: {
    ...typography.hint,
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
