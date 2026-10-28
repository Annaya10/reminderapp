import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { formatRelativeDateTime } from '@src/helpers/date';
import { formatDistance } from '@src/helpers/geo';
import { ReminderStatusBadge } from '@src/modules/reminders/components/ReminderStatusBadge';
import { Reminder } from '@src/modules/reminders/types';

interface NextReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
  onDetailsPress: () => void;
}

/** Summary of the next reminder, floating over the bottom of the map. */
export const NextReminderCard = (props: NextReminderCardProps) => {
  const { reminder, onPress, onDetailsPress } = props;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${reminder.title}, show on map`}
      onPress={onPress}
      style={styles.main}
    >
      <View style={styles.titleRow}>
        <View style={styles.iconBox}>
          <Icon name="notifications-outline" size={22} color="primary" />
        </View>
        <View style={styles.titles}>
          <Text size="large" weight="bold" numberOfLines={1}>
            {reminder.title}
          </Text>
          {!!reminder.description && (
            <Text color="subtext" numberOfLines={1}>
              {reminder.description}
            </Text>
          )}
        </View>
        <ReminderStatusBadge reminder={reminder} />
      </View>

      <View style={styles.metaRow}>
        <Meta
          icon="time-outline"
          label={formatRelativeDateTime(new Date(reminder.remindAt))}
        />
        <Meta
          icon="radio-button-on-outline"
          label={`${formatDistance(reminder.radius)} geofence`}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.trigger}>
          <Icon name="navigate-outline" size={14} color="success" />
          <Text size="caption" weight="medium">
            Triggers on entry
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View details"
          onPress={onDetailsPress}
          style={({ pressed }) => [
            styles.detailsButton,
            pressed && styles.pressed,
          ]}
        >
          <Text weight="semiBold" color="white">
            View Details
          </Text>
          <Icon name="arrow-forward" size={16} color="white" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const Meta = ({ icon, label }: { icon: IconName; label: string }) => (
  <View style={styles.meta}>
    <Icon name={icon} size={15} color="primary" />
    <Text size="caption" color="subtext">
      {label}
    </Text>
  </View>
);

const ICON_BOX_SIZE = 44;

const styles = StyleSheet.create({
  main: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.cardBg,
    ...Shadows.raised,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
  },
  titles: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexShrink: 1,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});
