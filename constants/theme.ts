/**
 * L'Étape editorial design tokens.
 * Warm paper backgrounds, Helvetica Neue UI type, Garamond display.
 */

import { Platform } from 'react-native';

/** Universal text color — all copy unless on navy fills. */
export const TEXT_COLOR = '#121212';

const helvetica = Platform.select({
  ios: {
    regular: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
    bold: 'HelveticaNeue-Bold',
  },
  android: {
    regular: 'sans-serif',
    medium: 'sans-serif-medium',
    bold: 'sans-serif-bold',
  },
  default: {
    regular: 'Helvetica Neue',
    medium: 'Helvetica Neue',
    bold: 'Helvetica Neue',
  },
}) as { regular: string; medium: string; bold: string };

export const colors = {
  /** Warm off-white page background. */
  background: '#F5F2EC',
  /** Slightly warmer variant for subtle contrast. */
  backgroundAlt: '#F7F4EF',
  /** Primary text — all UI and display copy on light ground. */
  text: TEXT_COLOR,
  /** Secondary labels — same ink for unified editorial tone. */
  textMuted: TEXT_COLOR,
  /** Hairline rules and quiet borders. */
  border: '#E8E4DC',
  /** Text accent on light backgrounds. */
  accent: TEXT_COLOR,
  /** Maison de Données navy — hover fills and selected states. */
  brandBlue: '#072A6C',
  /** Text on brandBlue backgrounds. */
  textOnBrand: '#FFFFFF',
  /** Progress and positive signals. */
  signal: TEXT_COLOR,
  error: '#8B4B4B',
  progressTrack: '#E8E4DC',
  progressFill: TEXT_COLOR,
  /** Tab bar and surfaces on light ground. */
  surface: '#F5F2EC',
  /** @deprecated Use `border` — kept until History/Settings/Log are redesigned. */
  surfaceBorder: '#E8E4DC',
  /** @deprecated Use `accent` — kept until form components are redesigned. */
  primary: TEXT_COLOR,
  /** @deprecated Use `background` — kept until +not-found is redesigned. */
  backgroundBottom: '#F5F2EC',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  sm: 4,
  md: 8,
} as const;

export const fonts = {
  /** Garamond-inspired serif for headlines. */
  display: 'EBGaramond_500Medium',
  displayRegular: 'EBGaramond_400Regular',
  displayItalic: 'EBGaramond_400Regular_Italic',
  /** Helvetica Neue for interface and labels. */
  body: helvetica.regular,
  bodyMedium: helvetica.medium,
  bodyBold: helvetica.bold,
  /** @deprecated Use `display` — kept until remaining screens are redesigned. */
  brand: 'EBGaramond_500Medium',
  /** @deprecated Use `displayRegular`. */
  brandRegular: 'EBGaramond_400Regular',
} as const;
