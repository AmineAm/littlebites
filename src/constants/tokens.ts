// Design tokens — single source of truth for all visual values.
// Never use raw hex, px, or fontWeight values outside this file.

export const colors = {
  coral: {
    50:  '#FAECE7',
    100: '#F5D5C9',
    200: '#EDAA94',
    400: '#D85A30',
    800: '#712B13',
  },
  teal: {
    50:  '#E1F5EE',
    100: '#BFEBDA',
    400: '#1D9E75',
    800: '#0E5C42',
  },
  purple: {
    50:  '#EEEDFE',
    100: '#D5D3FC',
    400: '#534AB7',
    800: '#2D2773',
  },
  amber: {
    50:  '#FAEEDA',
    100: '#F4D9A0',
    200: '#EF9F27',
    400: '#C07D0A',
  },
  linen:  '#F1EFE8',
  white:  '#FFFFFF',
  gray: {
    100: '#D3D1C7',
    200: '#B8B5A8',
    400: '#888780',
    600: '#5F5E5A',
    900: '#2C2C2A',
  },
} as const

export const spacing = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
} as const

export const radius = {
  sm:   4,
  md:   8,
  lg:   12,
  xl:   16,
  pill: 999,
  full: 9999,
} as const

export const typography = {
  display:     { fontSize: 22, fontWeight: '500' as const },
  h1:          { fontSize: 18, fontWeight: '500' as const },
  h2:          { fontSize: 15, fontWeight: '500' as const },
  bodyLg:      { fontSize: 14, fontWeight: '400' as const },
  body:        { fontSize: 13, fontWeight: '400' as const },
  bodySm:      { fontSize: 12, fontWeight: '400' as const },
  label:       { fontSize: 11, fontWeight: '500' as const },
  overline:    { fontSize: 10, fontWeight: '500' as const, letterSpacing: 0.8 },
  cultureCard: { fontSize: 13, fontWeight: '400' as const, fontStyle: 'italic' as const },
} as const

export const animation = {
  fast:          120,
  default:       240,
  slow:          400,
  stampDrop:     500,
  unlockReveal:  600,
  waveLoop:      2000,
} as const

// Cuisine accent colours — keyed by cuisineId
export const cuisineColors: Record<string, { bg: string; text: string }> = {
  italian:     { bg: '#FFF3E0', text: '#8B4513' },
  japanese:    { bg: '#FCE4EC', text: '#880E4F' },
  moroccan:    { bg: '#E8F5E9', text: '#1B5E20' },
  mexican:     { bg: '#FFF8E1', text: '#F57F17' },
  indian:      { bg: '#FBE9E7', text: '#BF360C' },
  lebanese:    { bg: '#E3F2FD', text: '#0D47A1' },
  korean:      { bg: '#FCE4EC', text: '#880E4F' },
  peruvian:    { bg: '#E8EAF6', text: '#1A237E' },
  greek:       { bg: '#E3F2FD', text: '#0D47A1' },
  ethiopian:   { bg: '#FFF3E0', text: '#E65100' },
  thai:        { bg: '#E8F5E9', text: '#1B5E20' },
  'west-african': { bg: '#FFF8E1', text: '#F57F17' },
  french:      { bg: '#F3E5F5', text: '#4A148C' },
  spanish:     { bg: '#FFEBEE', text: '#B71C1C' },
}
