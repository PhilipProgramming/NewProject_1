import { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { images } from '@/constants/assets';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { formatPercent } from '@/lib/format';

type ProgressBarProps = {
  /** 0–1+ ratio toward goal. */
  progress: number;
  label?: string;
};

const MARKER_SIZE = 140;
const TRACK_HEIGHT = 14;
const TRACK_ROW_HEIGHT = MARKER_SIZE + 8;

/**
 * Goal progress bar with a pomegranate marker at the leading edge of progress.
 * Fill and marker share the same pixel width so there is no gap between them.
 */
export function ProgressBar({
  progress,
  label = 'Daily goal progress',
}: ProgressBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentLabel =
    progress >= 1 ? `${formatPercent(1)}+` : formatPercent(progress);

  // Same pixel math for fill and marker — icon center sits on the true progress point.
  const progressPx = trackWidth * clampedProgress;
  const markerLeft = progressPx - MARKER_SIZE / 2;

  function handleTrackLayout(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percentLabel}</Text>
      </View>

      <View style={styles.trackArea}>
        <View style={styles.trackRow} onLayout={handleTrackLayout}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: progressPx }]} />
          </View>

          {trackWidth > 0 ? (
            <Image
              source={images.pomegranateMarker}
              style={[styles.marker, { left: markerLeft }]}
              accessibilityLabel="Progress toward daily goal"
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    overflow: 'visible',
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
    overflow: 'visible',
    // Inset so the marker is not clipped at 0% or 100% on web.
    paddingHorizontal: MARKER_SIZE / 2,
  },
  trackRow: {
    height: TRACK_ROW_HEIGHT,
    justifyContent: 'center',
    overflow: 'visible',
  },
  track: {
    height: TRACK_HEIGHT,
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
    top: (TRACK_ROW_HEIGHT - MARKER_SIZE) / 2,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    resizeMode: 'contain',
  },
});
