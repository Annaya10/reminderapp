import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

interface BrandMarkProps {
  size?: number;
}

/** App mark: a bell on the primary color, used on splash and auth screens. */
export const BrandMark = ({ size = 64 }: BrandMarkProps) => (
  <View
    style={[styles.main, { width: size, height: size }]}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  >
    <Icon name="notifications" size={Math.round(size * 0.45)} color="white" />
  </View>
);

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    ...Shadows.raised,
  },
});
