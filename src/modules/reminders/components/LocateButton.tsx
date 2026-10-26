import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';

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
      name={active ? 'navigate' : 'navigate-outline'}
      size={20}
      color={active ? 'primary' : 'subtext'}
    />
  </Pressable>
);

const SIZE = 44;

const styles = StyleSheet.create({
  main: {
    width: SIZE,
    height: SIZE,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    shadowColor: Colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
