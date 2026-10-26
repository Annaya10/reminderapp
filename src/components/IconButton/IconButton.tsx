import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';

interface IconButtonProps {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  color?: ColorName;
}

const SIZE = 36;

export const IconButton = (props: IconButtonProps) => {
  const { icon, accessibilityLabel, onPress, color = 'text' } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={Spacing.xs}
      onPress={onPress}
      style={({ pressed }) => [styles.main, pressed && styles.pressed]}
    >
      <Icon name={icon} size={20} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    width: SIZE,
    height: SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inputBg,
  },
  pressed: {
    opacity: 0.7,
  },
});
