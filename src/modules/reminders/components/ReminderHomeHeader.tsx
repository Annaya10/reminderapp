import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@src/components/Avatar';
import { Icon } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { formatLongDate } from '@src/helpers/date';

interface ReminderHomeHeaderProps {
  userName: string;
  onAddPress: () => void;
  onProfilePress: () => void;
}

/** Card floating over the top of the map: today's date and quick actions. */
export const ReminderHomeHeader = (props: ReminderHomeHeaderProps) => {
  const { userName, onAddPress, onProfilePress } = props;

  return (
    <View style={styles.main}>
      <View style={styles.titles}>
        <Text size="title" weight="bold" numberOfLines={1}>
          Home
        </Text>
        <View style={styles.dateRow}>
          <Icon name="calendar-outline" size={14} color="primary" />
          <Text weight="semiBold" numberOfLines={1} style={styles.date}>
            {formatLongDate(new Date())}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add reminder"
        hitSlop={Spacing.xs}
        onPress={onAddPress}
        style={({ pressed }) => [styles.addChip, pressed && styles.pressed]}
      >
        <Icon name="location-outline" size={16} color="primaryDark" />
        <Text weight="semiBold" color="primaryDark">
          Add
        </Text>
      </Pressable>
      <Avatar name={userName} size={40} onPress={onProfilePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.cardBg,
    ...Shadows.raised,
  },
  titles: {
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  date: {
    flexShrink: 1,
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    height: 40,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryMuted,
  },
  pressed: {
    opacity: 0.85,
  },
});
