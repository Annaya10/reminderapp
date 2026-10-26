import { ViewStyle } from 'react-native';

import { Colors } from '@src/constants/colors';

export const Shadows = {
  card: {
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  raised: {
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  raisedUp: {
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
} satisfies Record<string, ViewStyle>;
