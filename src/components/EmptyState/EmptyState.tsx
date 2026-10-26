import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconName;
}

export const EmptyState = (props: EmptyStateProps) => {
  const { title, description, icon = 'notifications-outline' } = props;

  return (
    <View style={styles.main}>
      <View style={styles.badge}>
        <Icon name={icon} size={26} color="primary" />
      </View>
      <Text size="subtitle" weight="semiBold" alignCenter>
        {title}
      </Text>
      {!!description && (
        <Text color="subtext" alignCenter style={styles.description}>
          {description}
        </Text>
      )}
    </View>
  );
};

const BADGE_SIZE = 56;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    backgroundColor: Colors.primarySoft,
  },
  description: {
    marginTop: Spacing.xs,
  },
});
