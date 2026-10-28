import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

interface LocateButtonProps {
  active: boolean;
  onPress: () => void;
}

export const LocateButton = ({ active, onPress }: LocateButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Center map on my location"
    hitSlop={Spacing.sm}
    onPress={onPress}
    style={({ pressed }) => [styles.main, pressed && styles.pressed]}
  >
    <Icon
      name={active ? 'compass' : 'compass-outline'}
      size={24}
      color={active ? 'primary' : 'text'}
    />
  </Pressable>
);

const SIZE = 48;

const styles = StyleSheet.create({
  main: {
    width: SIZE,
    height: SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    ...Shadows.raised,
  },
  pressed: {
    opacity: 0.85,
  },
});
