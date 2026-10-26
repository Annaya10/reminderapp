import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

const PIN_SIZE = 30;

interface ReminderPinProps {
  isCompleted?: boolean;
}

export const ReminderPin = ({ isCompleted = false }: ReminderPinProps) => (
  <View style={[styles.main, isCompleted && styles.completed]}>
    <Icon
      name={isCompleted ? 'checkmark' : 'notifications'}
      size={14}
      color="white"
    />
  </View>
);

const styles = StyleSheet.create({
  main: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    ...Shadows.card,
  },
  completed: {
    backgroundColor: Colors.placeholder,
  },
});
