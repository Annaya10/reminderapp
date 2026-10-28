export const Colors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  /** Chips, icon tiles and other light indigo surfaces. */
  primarySoft: '#EEF0FE',
  /** Slightly stronger tint for avatars and count bubbles. */
  primaryMuted: '#E0E3FB',
  screenBg: '#F7F7FC',
  cardBg: '#FFFFFF',
  inputBg: '#F1F2FC',
  border: '#E6E8F5',
  text: '#111827',
  subtext: '#6B7280',
  placeholder: '#9CA3AF',
  success: '#16A34A',
  successBg: '#E9F9EF',
  warning: '#D97706',
  warningBg: '#FFF5E6',
  danger: '#DC2626',
  dangerBg: '#FEECEC',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(17, 24, 39, 0.45)',
};

export type ColorName = keyof typeof Colors;
