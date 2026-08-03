import { StyleSheet } from 'react-native';

import { colors, fonts, spacing } from '@/constants/theme';

/** Shared editorial page title — identical on Today, History, Floor, Settings. */
export const pageTitleStyles = StyleSheet.create({
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
    color: colors.text,
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'right',
    flexShrink: 0,
  },
});

/** Vertical gap between page title row and content (24–32px). */
export const PAGE_CONTENT_GAP = spacing.xl;

/** Fixed header row height so titles align with or without a trailing date. */
export const PAGE_TITLE_ROW_MIN_HEIGHT = 34;

/** Shared content column — matches ScreenBackground constraints. */
export const PAGE_MAX_WIDTH = 720;
export const PAGE_HORIZONTAL_PADDING = 40;

/** Gap between paired nav items (Today↔History, Floor↔Settings). */
export const NAV_ITEM_GAP = spacing.lg;

/** Space between each nav group and the centered logo lockup. */
export const NAV_LOGO_GAP = spacing.xl;
