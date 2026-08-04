import { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { images } from '@/constants/assets';
import { pageTitleStyles } from '@/constants/pageLayout';
import { colors, fonts, radius, spacing } from '@/constants/theme';

type ProgressBarProps = {
  /** 0–1+ ratio toward goal. */
  progress: number;
  /** Centered status above the track, e.g. "Goal Completed!" */
  statusLabel: string;
};

const MARKER_SIZE = 140;
const TRACK_HEIGHT = 16;
const TRACK_ROW_HEIGHT = MARKER_SIZE + 8;

/**
 * Editorial goal progress — status label, thick track, blueberry marker.
 */
export function ProgressBar({ progress, statusLabel }: ProgressBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const progressPx = trackWidth * clampedProgress;
  const markerLeft = progressPx - MARKER_SIZE / 2;

  function handleTrackLayout(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{statusLabel}</Text>

      <View style={styles.trackArea}>
        <View style={styles.trackRow} onLayout={handleTrackLayout}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: progressPx }]} />
          </View>

          {trackWidth > 0 ? (
            <Image
              source={images.progressMarker}
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
    marginBottom: spacing.xxxl,
    overflow: 'visible',
  },
  status: {
    ...pageTitleStyles.title,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  trackArea: {
    overflow: 'visible',
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
