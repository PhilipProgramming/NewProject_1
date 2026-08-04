import { StyleSheet, Text, View } from 'react-native';

import { sectionLabelSpacing, typography } from '@/constants/typography';
import { colors, spacing } from '@/constants/theme';
import { formatPercent } from '@/lib/format';

type EditorialPaceProps = {
  /** 0–1+ ratio toward goal. */
  progress: number;
};

/** Minimal goal pace — thin rule, no icons, typography-first. */
export function EditorialPace({ progress }: EditorialPaceProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const label =
    progress >= 1 ? `${formatPercent(1)}+` : formatPercent(progress);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Goal pace</Text>
      <Text style={styles.value}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxxl,
  },
  label: {
    ...typography.sectionLabel,
    ...sectionLabelSpacing,
  },
  value: {
    ...typography.displaySecondary,
    marginBottom: spacing.md,
  },
  track: {
    height: 2,
    backgroundColor: colors.progressTrack,
    borderRadius: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.progressFill,
  },
});
