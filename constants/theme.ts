/**
 * Visual design tokens for Pomegranate.
 * Centralizing colors/spacing keeps the UI consistent and easy to tweak.
 */

export const colors = {
  /** Deep pomegranate wine — primary brand accent. */
  primary: '#8B1538',
  primaryDark: '#5C0E25',
  /** Warm gold highlight for commission / success moments. */
  accent: '#C4A35A',
  /** Cool slate background tones (not flat white). */
  backgroundTop: '#1A2332',
  backgroundBottom: '#0F1419',
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceBorder: 'rgba(255, 255, 255, 0.12)',
  text: '#F5F0EB',
  textMuted: 'rgba(245, 240, 235, 0.65)',
  textInverse: '#1A2332',
  success: '#4ADE80',
  error: '#F87171',
  progressTrack: 'rgba(255, 255, 255, 0.15)',
  progressFill: '#8B1538',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const fonts = {
  /** Display font for the Pomegranate brand name. */
  brand: 'Fraunces_700Bold',
  brandRegular: 'Fraunces_400Regular',
  /** Body / UI font. */
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;
