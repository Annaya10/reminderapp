import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@src/components/Avatar';
import { Text } from '@src/components/Text';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

interface ProfileSummaryCardProps {
  name: string;
  email: string;
  totalCount: number;
  completedCount: number;
  /** Reminders whose geofence is still open (not completed). */
  activeCount: number;
}

export const ProfileSummaryCard = (props: ProfileSummaryCardProps) => {
  const { name, email, totalCount, completedCount, activeCount } = props;

  return (
    <View style={styles.main}>
      <View style={styles.identity}>
        <Avatar name={name} size={72} />
        <View style={styles.texts}>
          <Text size="title" weight="bold" numberOfLines={1}>
            {name}
          </Text>
          <Text color="subtext" numberOfLines={1} style={styles.email}>
            {email}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat value={totalCount} label="Total Tasks" color="primaryDark" />
        <Stat value={completedCount} label="Completed" color="success" />
        <Stat value={activeCount} label="Geofences" color="primary" />
      </View>
    </View>
  );
};

interface StatProps {
  value: number;
  label: string;
  color: ColorName;
}

const Stat = ({ value, label, color }: StatProps) => (
  <View style={styles.stat}>
    <Text size="title" weight="bold" color={color}>
      {value}
    </Text>
    <Text size="caption" weight="medium" numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  main: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  texts: {
    flex: 1,
  },
  email: {
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primarySoft,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.cardBg,
  },
});
