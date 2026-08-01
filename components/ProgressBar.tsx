import { Image, StyleSheet, Text, View } from 'react-native';

import { images } from '@/constants/assets';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { formatPercent } from '@/lib/format';

type ProgressBarProps = {
  /** 0–1+ ratio toward goal. */
  progress: number;
  label?: string;
};

const MARKER_SIZE = 36;

/**
 * Goal progress bar with a pomegranate marker showing where you are on the track.
 * The icon moves left-to-right as sales approach the daily goal.
 */
export function ProgressBar({
  progress,
  label = 'Daily goal progress',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentLabel =
    progress >= 1 ? `${formatPercent(1)}+` : formatPercent(progress);

  // Center the marker on the progress point; clamp so edges aren't clipped.
  const markerLeftPercent = clampedProgress * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percentLabel}</Text>
      </View>

      <View style={styles.trackArea}>
        <View style={styles.track}>
          <View
            style={[styles.fill, { width: `${clampedProgress * 100}%` }]}
          />
        </View>

        <Image
          source={images.pomegranateMarker}
          style={[
            styles.marker,
            {
              left: `${markerLeftPercent}%`,
              transform: [{ translateX: -MARKER_SIZE / 2 }],
            },
          ]}
          accessibilityLabel="Progress toward daily goal"
        />
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
  trackArea: {
    height: MARKER_SIZE + 4,
    justifyContent: 'center',
    // Room for the marker at 0% and 100% without clipping.
    paddingHorizontal: MARKER_SIZE / 2,
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
  marker: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    top: 0,
    resizeMode: 'contain',
  },
});
