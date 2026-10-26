import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';

interface ProfileOptionRowProps {
  icon: IconName;
  title: string;
  description: string;
  showDivider?: boolean;
}

/** Settings row for a feature that is not available yet. */
export const ProfileOptionRow = (props: ProfileOptionRowProps) => {
  const { icon, title, description, showDivider = false } = props;

  return (
    <View style={[styles.main, showDivider && styles.divider]}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={20} color="primary" />
      </View>
      <View style={styles.texts}>
        <Text weight="semiBold">{title}</Text>
        <Text size="caption" color="subtext" style={styles.description}>
          {description}
        </Text>
      </View>
      <View style={styles.soonBadge}>
        <Text size="caption" weight="medium" color="subtext">
          Soon
        </Text>
      </View>
    </View>
  );
};

const ICON_BOX_SIZE = 40;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  texts: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  description: {
    marginTop: 2,
  },
  soonBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.inputBg,
  },
});
