import { useSegments } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditorialNavLink } from '@/components/EditorialNavLink';
import {
  NAV_ITEM_GAP,
  NAV_LOGO_GAP,
  PAGE_HORIZONTAL_PADDING,
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
 * Three-column editorial navigation — equal-width side groups mirror around
 * a perfectly centered brand lockup.
 *
 * | Today · History | MAISON DE DONNÉES | Floor · Settings |
 * |                 |      L'ÉTAPE      |                  |
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
        <View style={[styles.column, styles.columnLeft]}>
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
        </View>

        <View style={styles.lockup}>
          <Text style={styles.parent}>Maison de Données</Text>
          <Text style={styles.appName}>L&apos;Étape</Text>
        </View>

        <View style={[styles.column, styles.columnRight]}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
    paddingHorizontal: PAGE_HORIZONTAL_PADDING,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  column: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 18,
  },
  columnLeft: {
    justifyContent: 'flex-end',
    paddingRight: NAV_LOGO_GAP,
  },
  columnRight: {
    justifyContent: 'flex-start',
    paddingLeft: NAV_LOGO_GAP,
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: NAV_ITEM_GAP,
  },
  lockup: {
    flexShrink: 0,
    alignItems: 'center',
    alignSelf: 'flex-start',
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
