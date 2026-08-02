import { StyleSheet, Text, View } from 'react-native';

import { BRAND } from '@/constants/defaults';
import { colors, fonts, spacing } from '@/constants/theme';
import { formatDisplayDate, getTodayKey } from '@/lib/dates';

type LetapeHeaderProps = {
  /** Screen question, e.g. "How am I doing today?" */
  question?: string;
  showDate?: boolean;
};

/** Editorial masthead — Maison de Données / L'Étape hierarchy. */
export function LetapeHeader({
  question,
  showDate = true,
}: LetapeHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.parent}>{BRAND.parent}</Text>
      <Text style={styles.title}>{BRAND.appName}</Text>
      <Text style={styles.descriptor}>{BRAND.descriptor}</Text>
      {showDate ? (
        <Text style={styles.date}>
          Today · {formatDisplayDate(getTodayKey())}
        </Text>
      ) : null}
      {question ? <Text style={styles.question}>{question}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
  parent: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 48,
    color: colors.text,
    letterSpacing: -0.5,
    lineHeight: 52,
  },
  descriptor: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  question: {
    fontFamily: fonts.displayRegular,
    fontSize: 22,
    color: colors.text,
    marginTop: spacing.xl,
    lineHeight: 28,
  },
});
