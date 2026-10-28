import { ViewStyle } from 'react-native';

import { Colors } from '@src/constants/colors';

export const Shadows = {
  card: {
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  raisedUp: {
    shadowColor: Colors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  /** Colored glow under primary buttons and the add button. */
  primary: {
    shadowColor: Colors.primary,
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} satisfies Record<string, ViewStyle>;
