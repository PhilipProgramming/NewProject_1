/**
 * Editorial typography system — single source of truth for UI text.
 * Luxury publication rhythm: few sizes, generous whitespace, strict reuse.
 */

import { StyleSheet } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';

/** Pixel scale for interface copy — prefer these over ad-hoc values. */
export const typeScale = {
  pageTitle: 28,
  pageMeta: 14,
  sectionLabel: 13,
  fieldLabel: 15,
  fieldInput: 18,
  button: 14,
  body: 14,
  bodyLarge: 16,
  hint: 13,
  metricValue: 22,
  displayHero: 56,
  displaySecondary: 36,
  displayMedium: 32,
  displaySmall: 24,
  observation: 20,
} as const;

/** Shared min-height so every text field aligns on the grid. */
export const FORM_INPUT_MIN_HEIGHT = 52;

/** Page title row — identical on Today, History, Floor, Settings, Log, Dictionary. */
export const pageTitleStyles = StyleSheet.create({
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: typeScale.pageTitle,
    lineHeight: 34,
    letterSpacing: -0.3,
    color: colors.text,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: typeScale.pageMeta,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'right',
    flexShrink: 0,
  },
});

export const typography = StyleSheet.create({
  pageTitle: pageTitleStyles.title,
  pageMeta: pageTitleStyles.date,
  sectionLabel: {
    fontFamily: fonts.body,
    fontSize: typeScale.sectionLabel,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  fieldLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: typeScale.fieldLabel,
    color: colors.text,
  },
  fieldInput: {
    fontFamily: fonts.body,
    fontSize: typeScale.fieldInput,
    color: colors.text,
  },
  buttonLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: typeScale.button,
    letterSpacing: 0.2,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: typeScale.body,
    lineHeight: 20,
    color: colors.text,
  },
  bodyMuted: {
    fontFamily: fonts.body,
    fontSize: typeScale.body,
    lineHeight: 20,
    color: colors.textMuted,
  },
  bodyLarge: {
    fontFamily: fonts.bodyMedium,
    fontSize: typeScale.bodyLarge,
    lineHeight: 24,
    color: colors.text,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: typeScale.hint,
    color: colors.textMuted,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: typeScale.hint,
    color: colors.error,
  },
  metricValue: {
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.metricValue,
    color: colors.text,
  },
  displayHero: {
    fontFamily: fonts.display,
    fontSize: typeScale.displayHero,
    lineHeight: 60,
    letterSpacing: -1,
    color: colors.text,
  },
  displaySecondary: {
    fontFamily: fonts.display,
    fontSize: typeScale.displaySecondary,
    lineHeight: 40,
    color: colors.text,
  },
  displayMedium: {
    fontFamily: fonts.displayRegular,
    fontSize: typeScale.displayMedium,
    lineHeight: 38,
    color: colors.text,
  },
  displaySmall: {
    fontFamily: fonts.displayRegular,
    fontSize: typeScale.displaySmall,
    color: colors.text,
  },
  observation: {
    fontFamily: fonts.displayRegular,
    fontSize: typeScale.observation,
    lineHeight: 30,
    color: colors.text,
  },
});

export const formFieldStyles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.fieldLabel,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.fieldInput,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: FORM_INPUT_MIN_HEIGHT,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: FORM_INPUT_MIN_HEIGHT,
  },
  prefix: {
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.fieldInput,
    color: colors.textMuted,
    marginRight: spacing.xs,
  },
  inputInner: {
    flex: 1,
    ...typography.fieldInput,
    paddingVertical: spacing.md,
    minHeight: FORM_INPUT_MIN_HEIGHT - 2,
  },
  error: {
    ...typography.error,
    marginTop: spacing.xs,
  },
});

export const buttonStyles = StyleSheet.create({
  label: {
    ...typography.buttonLabel,
    color: colors.text,
  },
  labelActive: {
    color: colors.textOnBrand,
  },
  labelAccent: {
    ...typography.buttonLabel,
    color: colors.accent,
  },
});

/** Standard spacing below section labels before content. */
export const sectionLabelSpacing = {
  marginBottom: spacing.md,
} as const;
