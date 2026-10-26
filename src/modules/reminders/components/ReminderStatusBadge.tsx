import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@src/components/Text';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { isOverdue } from '@src/modules/reminders/helpers';
import { Reminder } from '@src/modules/reminders/types';

const STATUS = {
  completed: { label: 'Completed', color: 'success', background: 'successBg' },
  overdue: { label: 'Overdue', color: 'danger', background: 'dangerBg' },
  pending: { label: 'Pending', color: 'warning', background: 'warningBg' },
} as const satisfies Record<
  string,
  { label: string; color: ColorName; background: ColorName }
>;

export const ReminderStatusBadge = ({ reminder }: { reminder: Reminder }) => {
  const status = reminder.isCompleted
    ? STATUS.completed
    : isOverdue(reminder)
    ? STATUS.overdue
    : STATUS.pending;

  return (
    <View style={[styles.main, { backgroundColor: Colors[status.background] }]}>
      <Text size="caption" weight="semiBold" color={status.color}>
        {status.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
  },
});
