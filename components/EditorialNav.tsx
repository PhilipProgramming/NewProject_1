import { useSegments } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditorialNavLink } from '@/components/EditorialNavLink';
import {
  NAV_HORIZONTAL_PADDING,
  NAV_ITEM_GAP,
} from '@/constants/pageLayout';
import { colors, fonts, spacing } from '@/constants/theme';

type NavTab = 'today' | 'history' | 'floor' | 'settings';

function resolveActiveTab(segments: string[]): NavTab {
  const leaf = segments[segments.length - 1];
  if (leaf === 'history') return 'history';
  if (leaf === 'floor') return 'floor';
  if (leaf === 'settings') return 'settings';
  return 'today';
}

/**
 * Full-viewport editorial navigation — edge-anchored link groups with a
 * logo lockup centered in the browser window, independent of page content width.
 */
export function EditorialNav() {
  const insets = useSafeAreaInsets();
  const active = resolveActiveTab(useSegments() as string[]);

  return (
    <View
      style={[
        styles.shell,
        { paddingTop: insets.top + spacing.sm },
      ]}
    >
      <View style={styles.bar}>
        <View style={styles.edgeRow}>
          <View style={styles.navGroup}>
            <EditorialNavLink
              href="/(tabs)"
              label="Today"
              active={active === 'today'}
            />
            <EditorialNavLink
              href="/(tabs)/history"
              label="History"
              active={active === 'history'}
            />
          </View>

          <View style={styles.navGroup}>
            <EditorialNavLink
              href="/(tabs)/floor"
              label="Floor"
              active={active === 'floor'}
            />
            <EditorialNavLink
              href="/(tabs)/settings"
              label="Settings"
              active={active === 'settings'}
            />
          </View>
        </View>

        <View style={styles.lockup} pointerEvents="none">
          <Text style={styles.parent}>Maison de Données</Text>
          <Text style={styles.appName}>L&apos;Étape</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
    ...(Platform.OS === 'web'
      ? {
          position: 'relative' as const,
          left: 0,
          right: 0,
        }
      : {}),
  },
  bar: {
    position: 'relative',
    width: '100%',
    minHeight: 36,
    justifyContent: 'center',
  },
  edgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: NAV_HORIZONTAL_PADDING,
    zIndex: 1,
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: NAV_ITEM_GAP,
  },
  lockup: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    zIndex: 0,
  },
  parent: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.text,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  appName: {
    fontFamily: fonts.displayRegular,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
