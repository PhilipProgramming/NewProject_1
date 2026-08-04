import { spacing } from '@/constants/theme';

export { pageTitleStyles } from '@/constants/typography';

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

/** Full-width nav inset from viewport edges (24–40px). */
export const NAV_HORIZONTAL_PADDING = PAGE_HORIZONTAL_PADDING;
