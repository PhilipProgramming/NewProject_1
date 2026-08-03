import { useSegments } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditorialNavLink } from '@/components/EditorialNavLink';
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
 * Full-width editorial navigation — Margiela-inspired text bar with centered lockup.
 * Today · History · MAISON DE DONNÉES / L'ÉTAPE · Floor · Settings
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
        <View style={styles.side}>
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

        <View style={styles.lockup}>
          <Text style={styles.parent}>Maison de Données</Text>
          <Text style={styles.appName}>L&apos;Étape</Text>
        </View>

        <View style={[styles.side, styles.sideRight]}>
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
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 40,
    ...(Platform.OS === 'web' ? { maxWidth: 1200, width: '100%', alignSelf: 'center' } : {}),
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: 2,
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  lockup: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
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
