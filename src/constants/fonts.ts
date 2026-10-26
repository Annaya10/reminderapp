import { TextStyle } from 'react-native';

/**
 * Font family + weight pairs. Uses the platform system font until custom
 * font assets (e.g. Poppins) are added to src/assets/fonts and linked;
 * at that point only this map needs to change.
 */
export const Fonts = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semiBold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
} satisfies Record<string, TextStyle>;

export type FontWeight = keyof typeof Fonts;

export const FontSizes = {
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  heading: 28,
};

export type FontSize = keyof typeof FontSizes;
