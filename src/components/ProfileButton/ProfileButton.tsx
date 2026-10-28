import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';

const SIZE = 36;

/** Round account button shown on the right of screen headers. */
export const ProfileButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Profile"
    hitSlop={Spacing.xs}
    onPress={onPress}
    style={({ pressed }) => [styles.main, pressed && styles.pressed]}
  >
    <Icon name="person-outline" size={18} color="white" />
  </Pressable>
);

const styles = StyleSheet.create({
  main: {
    width: SIZE,
    height: SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
