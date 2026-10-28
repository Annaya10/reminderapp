import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { formatRelativeDateTime } from '@src/helpers/date';
import { formatDistance } from '@src/helpers/geo';
import { ReminderStatusBadge } from '@src/modules/reminders/components/ReminderStatusBadge';
import { getReminderStatus } from '@src/modules/reminders/helpers';
import { Reminder } from '@src/modules/reminders/types';

interface ReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
  onToggleCompleted: () => void;
  onViewOnMap: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** Due-time chip style for each status. */
const DUE_CHIP = {
  pending: {
    icon: 'time-outline',
    color: 'primaryDark',
    background: 'primarySoft',
  },
  overdue: { icon: 'alarm-outline', color: 'danger', background: 'dangerBg' },
  completed: {
    icon: 'calendar-outline',
    color: 'success',
    background: 'successBg',
  },
} as const satisfies Record<
  string,
  { icon: IconName; color: ColorName; background: ColorName }
>;

export const ReminderCard = (props: ReminderCardProps) => {
  const {
    reminder,
    onPress,
    onToggleCompleted,
    onViewOnMap,
    onEdit,
    onDelete,
  } = props;
  const { title, description, remindAt, radius, isCompleted } = reminder;
  const status = getReminderStatus(reminder);
  const dueChip = DUE_CHIP[status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, view details`}
      onPress={onPress}
      style={({ pressed }) => [styles.main, pressed && styles.pressed]}
    >
      <View style={styles.titleRow}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={
            isCompleted ? 'Mark as not completed' : 'Mark as completed'
          }
          hitSlop={Spacing.sm}
          onPress={onToggleCompleted}
          style={[styles.check, styles[`check_${status}`]]}
        >
          {status === 'completed' && (
            <Icon name="checkmark" size={16} color="white" />
          )}
          {status === 'overdue' && (
            <Icon name="alert" size={16} color="danger" />
          )}
        </Pressable>
        <Text
          size="large"
          weight="semiBold"
          numberOfLines={1}
          color={isCompleted ? 'subtext' : 'text'}
          style={[styles.title, isCompleted && styles.titleDone]}
        >
          {title}
        </Text>
        <ReminderStatusBadge reminder={reminder} />
      </View>

      {!!description && (
        <Text
          size="subtitle"
          color={isCompleted ? 'subtext' : 'text'}
          numberOfLines={2}
          style={styles.description}
        >
          {description}
        </Text>
      )}

      <View style={styles.chips}>
        <Chip
          icon={dueChip.icon}
          label={formatRelativeDateTime(new Date(remindAt))}
          color={dueChip.color}
          background={dueChip.background}
        />
        <Chip
          icon="navigate-outline"
          label={`${formatDistance(radius)} radius`}
          color="subtext"
          background="inputBg"
        />
      </View>

      <View style={styles.actions}>
        <Action icon="map-outline" label="Map" onPress={onViewOnMap} />
        {isCompleted ? (
          <Action
            icon="arrow-undo-outline"
            label="Mark Pending"
            onPress={onToggleCompleted}
          />
        ) : (
          <Action icon="pencil" label="Edit" onPress={onEdit} />
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete"
          hitSlop={Spacing.sm}
          onPress={onDelete}
          style={({ pressed }) => [styles.delete, pressed && styles.pressed]}
        >
          <Icon name="trash-outline" size={20} color="danger" />
        </Pressable>
      </View>
    </Pressable>
  );
};

interface ChipProps {
  icon: IconName;
  label: string;
  color: ColorName;
  background: ColorName;
}

const Chip = ({ icon, label, color, background }: ChipProps) => (
  <View style={[styles.chip, { backgroundColor: Colors[background] }]}>
    <Icon name={icon} size={14} color={color} />
    <Text size="caption" weight="medium" color={color}>
      {label}
    </Text>
  </View>
);

interface ActionProps {
  icon: IconName;
  label: string;
  onPress: () => void;
}

const Action = ({ icon, label, onPress }: ActionProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    hitSlop={Spacing.xs}
    onPress={onPress}
    style={({ pressed }) => [styles.action, pressed && styles.pressed]}
  >
    <Icon name={icon} size={15} color="primaryDark" />
    <Text size="caption" weight="semiBold" color="primaryDark">
      {label}
    </Text>
  </Pressable>
);

const CHECK_SIZE = 26;

const styles = StyleSheet.create({
  main: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  check: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check_pending: {
    backgroundColor: Colors.primaryMuted,
  },
  check_overdue: {
    backgroundColor: Colors.dangerBg,
  },
  check_completed: {
    backgroundColor: Colors.success,
  },
  title: {
    flex: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
  },
  description: {
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  chips: {
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primarySoft,
  },
  delete: {
    marginLeft: 'auto',
    padding: Spacing.xs,
  },
});
