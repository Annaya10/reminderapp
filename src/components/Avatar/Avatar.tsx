import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius } from '@src/constants/layout';
import { getInitials } from '@src/helpers/string';

interface AvatarProps {
  name: string;
  size?: number;
  onPress?: () => void;
}

export const Avatar = ({ name, size = 44, onPress }: AvatarProps) => {
  const content = (
    <View
      style={[styles.main, { width: size, height: size }]}
      accessibilityLabel={name}
    >
      <Text
        weight="semiBold"
        color="primary"
        style={{ fontSize: Math.round(size * 0.38) }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
    borderWidth: 2,
    borderColor: Colors.cardBg,
  },
  pressed: {
    opacity: 0.85,
  },
});
