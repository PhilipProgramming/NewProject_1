import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '@/constants/theme';

/** Centered editorial footer — Settings page only. */
export function SettingsFooter() {
  return (
    <View style={styles.container}>
      <View style={styles.rule} />
      <Text style={styles.line}>Maison de Données</Text>
      <Text style={styles.line}>L&apos;Étape</Text>
      <Text style={styles.meta}>Analytics in Steps</Text>
      <Text style={styles.meta}>Version 0.3</Text>
      <Text style={styles.meta}>Summer 2026</Text>
      <Text style={styles.copyright}>Copyright © Maison de Données</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  rule: {
    width: '100%',
    maxWidth: 320,
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  line: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  copyright: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    letterSpacing: 0.3,
  },
});
