import React, { ComponentProps } from 'react';
import { Ionicons } from '@react-native-vector-icons/ionicons/static';

import { ColorName, Colors } from '@src/constants/colors';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: ColorName;
}

export const Icon = ({ name, size = 20, color = 'text' }: IconProps) => (
  <Ionicons name={name} size={size} color={Colors[color]} />
);
