import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@src/components/Avatar';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

interface ProfileSummaryCardProps {
  name: string;
  email: string;
}

export const ProfileSummaryCard = ({
  name,
  email,
}: ProfileSummaryCardProps) => (
  <View style={styles.main}>
    <Avatar name={name} size={72} />
    <Text size="title" weight="bold" style={styles.name}>
      {name}
    </Text>
    <Text color="subtext" style={styles.email}>
      {email}
    </Text>
    <View style={styles.badge}>
      <Text size="caption" weight="semiBold" color="primary">
        Demo account · stored on this device
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  name: {
    marginTop: Spacing.md,
  },
  email: {
    marginTop: 2,
  },
  badge: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.primarySoft,
  },
});
