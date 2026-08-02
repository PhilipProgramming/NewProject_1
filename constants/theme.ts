/**
 * L'Étape editorial design tokens.
 * Warm paper backgrounds, soft charcoal type, typography-led layout.
 */

export const colors = {
  /** Warm off-white page background. */
  background: '#F5F2EC',
  /** Slightly warmer variant for subtle contrast. */
  backgroundAlt: '#F7F4EF',
  /** Nearly black — primary text. */
  text: '#2C2C2C',
  /** Soft charcoal for secondary copy. */
  textMuted: '#6B6560',
  /** Hairline rules and quiet borders. */
  border: '#E8E4DC',
  /** Minimal accent — used sparingly. */
  accent: '#4A4540',
  /** Maison de Données navy — hover fills and selected states. */
  brandBlue: '#072A6C',
  /** Text on brandBlue backgrounds. */
  textOnBrand: '#FFFFFF',
  /** Progress and positive signals. */
  signal: '#3D3D3D',
  error: '#8B4B4B',
  progressTrack: '#E8E4DC',
  progressFill: '#2C2C2C',
  /** Tab bar and surfaces on light ground. */
  surface: '#F5F2EC',
  /** @deprecated Use `border` — kept until History/Settings/Log are redesigned. */
  surfaceBorder: '#E8E4DC',
  /** @deprecated Use `accent` — kept until form components are redesigned. */
  primary: '#4A4540',
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
  /** Clean sans for interface and labels. */
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyBold: 'Inter_600SemiBold',
  /** @deprecated Use `display` — kept until remaining screens are redesigned. */
  brand: 'EBGaramond_500Medium',
  /** @deprecated Use `displayRegular`. */
  brandRegular: 'EBGaramond_400Regular',
} as const;
