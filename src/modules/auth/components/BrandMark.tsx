import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

interface BrandMarkProps {
  size?: number;
}

const HALO_WIDTH = 6;

/** App mark: a location pin on a rounded indigo tile with a soft halo. */
export const BrandMark = ({ size = 80 }: BrandMarkProps) => (
  <View
    style={[
      styles.halo,
      {
        width: size + HALO_WIDTH * 2,
        height: size + HALO_WIDTH * 2,
        borderRadius: size * 0.3 + HALO_WIDTH,
      },
    ]}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  >
    <View
      style={[
        styles.main,
        { width: size, height: size, borderRadius: size * 0.3 },
      ]}
    >
      <Icon name="location" size={Math.round(size * 0.45)} color="white" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  halo: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xl,
    backgroundColor: Colors.primaryMuted,
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },
});
