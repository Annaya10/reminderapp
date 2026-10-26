import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@src/components/Avatar';
import { Button } from '@src/components/Button';
import { Text } from '@src/components/Text';
import { Spacing } from '@src/constants/layout';
import { formatLongDate } from '@src/helpers/date';

interface ReminderHomeHeaderProps {
  userName: string;
  onAddPress: () => void;
  onProfilePress: () => void;
}

export const ReminderHomeHeader = (props: ReminderHomeHeaderProps) => {
  const { userName, onAddPress, onProfilePress } = props;

  return (
    <View style={styles.main}>
      <View style={styles.titles}>
        <Text size="heading" weight="bold" numberOfLines={1}>
          Home
        </Text>
        <Text color="subtext" numberOfLines={1} style={styles.date}>
          {formatLongDate(new Date())}
        </Text>
      </View>
      <View style={styles.actions}>
        <Button label="Add Reminder" icon="add" onPress={onAddPress} />
        <Avatar name={userName} size={44} onPress={onProfilePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  titles: {
    flexShrink: 1,
    marginRight: Spacing.md,
  },
  date: {
    marginTop: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
