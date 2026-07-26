import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';
import { formatPercent } from '@/lib/format';

type ProgressBarProps = {
  /** 0–1+ ratio toward goal. */
  progress: number;
  label?: string;
};

/**
 * Visual goal progress bar. Clamps fill width at 100% but shows over-goal text.
 */
export function ProgressBar({ progress, label = 'Daily goal progress' }: ProgressBarProps) {
  const clampedWidth = Math.min(Math.max(progress, 0), 1);
  const percentLabel =
    progress >= 1
      ? `${formatPercent(1)}+`
      : formatPercent(progress);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percentLabel}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedWidth * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
  },
  percent: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.accent,
  },
  track: {
    height: 10,
    backgroundColor: colors.progressTrack,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: radius.sm,
  },
});
