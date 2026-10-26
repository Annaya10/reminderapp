import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { formatDateTime } from '@src/helpers/date';
import { formatDistance } from '@src/helpers/geo';
import { ReminderStatusBadge } from '@src/modules/reminders/components/ReminderStatusBadge';
import { Reminder } from '@src/modules/reminders/types';

interface ReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
  onToggleCompleted: () => void;
  onViewOnMap: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, view details`}
      onPress={onPress}
      style={({ pressed }) => [styles.main, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isCompleted }}
          accessibilityLabel={
            isCompleted ? 'Mark as not completed' : 'Mark as completed'
          }
          hitSlop={Spacing.sm}
          onPress={onToggleCompleted}
          style={[styles.check, isCompleted && styles.checkDone]}
        >
          {isCompleted && <Icon name="checkmark" size={16} color="white" />}
        </Pressable>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text
              weight="semiBold"
              size="subtitle"
              numberOfLines={1}
              color={isCompleted ? 'subtext' : 'text'}
              style={[styles.title, isCompleted && styles.titleDone]}
            >
              {title}
            </Text>
            <ReminderStatusBadge reminder={reminder} />
          </View>

          {!!description && (
            <Text color="subtext" numberOfLines={2} style={styles.description}>
              {description}
            </Text>
          )}

          <View style={styles.metaRow}>
            <Meta
              icon="time-outline"
              label={formatDateTime(new Date(remindAt))}
            />
            <Meta
              icon="radio-button-on-outline"
              label={formatDistance(radius)}
            />
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Action icon="map-outline" label="Map" onPress={onViewOnMap} />
        <Action icon="create-outline" label="Edit" onPress={onEdit} />
        <Action
          icon="trash-outline"
          label="Delete"
          color="danger"
          onPress={onDelete}
        />
      </View>
    </Pressable>
  );
};

const Meta = ({ icon, label }: { icon: IconName; label: string }) => (
  <View style={styles.meta}>
    <Icon name={icon} size={14} color="subtext" />
    <Text size="caption" color="subtext" style={styles.metaLabel}>
      {label}
    </Text>
  </View>
);

interface ActionProps {
  icon: IconName;
  label: string;
  color?: ColorName;
  onPress: () => void;
}

const Action = ({ icon, label, color = 'primary', onPress }: ActionProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    hitSlop={Spacing.xs}
    onPress={onPress}
    style={({ pressed }) => [styles.action, pressed && styles.pressed]}
  >
    <Icon name={icon} size={16} color={color} />
    <Text size="caption" weight="semiBold" color={color}>
      {label}
    </Text>
  </Pressable>
);

const CHECK_SIZE = 24;

const styles = StyleSheet.create({
  main: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  check: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    marginTop: 2,
    marginRight: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    flexShrink: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
  },
  description: {
    marginTop: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    marginLeft: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.inputBg,
  },
});
