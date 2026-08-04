import { StyleSheet, Text, View } from 'react-native';

import { typography } from '@/constants/typography';
import { colors, radius, spacing } from '@/constants/theme';

type MetricCardProps = {
  label: string;
  value: string;
  /** Optional hint shown below the value, e.g. formula explanation. */
  hint?: string;
};

/**
 * Single KPI tile. Used on Dashboard and Day Detail screens.
 * Kept presentational — parent passes formatted strings.
 */
export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  label: {
    ...typography.sectionLabel,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.metricValue,
  },
  hint: {
    ...typography.hint,
    marginTop: spacing.xs,
  },
});
