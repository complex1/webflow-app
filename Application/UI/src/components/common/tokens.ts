export const spacingScale = {
  none: '0',
  xs: 'var(--space-1)',
  sm: 'var(--space-2)',
  md: 'var(--space-3)',
  lg: 'var(--space-4)',
  xl: 'var(--space-5)',
  '2xl': 'var(--space-6)'
} as const

export type SpacingToken = keyof typeof spacingScale

export const radiusScale = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)'
} as const

export type RadiusToken = keyof typeof radiusScale

export const toneMap = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  muted: 'var(--text-muted)',
  danger: 'var(--error-red)',
  inherit: 'currentColor'
} as const

export type Tone = keyof typeof toneMap

export const textSizeMap = {
  xxs: 'var(--text-xxs)',
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  md: 'var(--text-md)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)'
} as const

export type TextVariant = keyof typeof textSizeMap

export const iconSizeMap = {
  xxs: '10px',
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '20px'
} as const

export type IconSize = keyof typeof iconSizeMap

export const buttonHeightMap = {
  sm: '32px',
  md: '40px'
} as const

export type ButtonSize = keyof typeof buttonHeightMap
