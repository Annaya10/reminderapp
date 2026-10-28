import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@src/components/Text';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import {
  getReminderStatus,
  ReminderStatus,
} from '@src/modules/reminders/helpers';
import { Reminder } from '@src/modules/reminders/types';

export const STATUS_STYLES = {
  completed: { label: 'Completed', color: 'success', background: 'successBg' },
  overdue: { label: 'Overdue', color: 'danger', background: 'dangerBg' },
  pending: { label: 'Pending', color: 'warning', background: 'warningBg' },
} as const satisfies Record<
  ReminderStatus,
  { label: string; color: ColorName; background: ColorName }
>;

export const ReminderStatusBadge = ({ reminder }: { reminder: Reminder }) => {
  const status = STATUS_STYLES[getReminderStatus(reminder)];

  return (
    <View style={[styles.main, { backgroundColor: Colors[status.background] }]}>
      <View style={[styles.dot, { backgroundColor: Colors[status.color] }]} />
      <Text size="caption" weight="semiBold" color={status.color}>
        {status.label}
      </Text>
    </View>
  );
};

const DOT_SIZE = 6;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: Radius.full,
  },
});
