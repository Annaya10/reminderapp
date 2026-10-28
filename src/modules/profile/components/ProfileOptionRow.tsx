import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';

interface ProfileOptionRowProps {
  icon: IconName;
  iconColor?: ColorName;
  iconBackground?: ColorName;
  title: string;
  description: string;
  /** Current setting, shown on the right. */
  value?: string;
  /** Rows without an action or value are shown as coming soon. */
  onPress?: () => void;
  showDivider?: boolean;
}

export const ProfileOptionRow = (props: ProfileOptionRowProps) => {
  const {
    icon,
    iconColor = 'primary',
    iconBackground = 'primaryMuted',
    title,
    description,
    value,
    onPress,
    showDivider = false,
  } = props;
  const isAvailable = !!onPress || !!value;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}${isAvailable ? '' : ', coming soon'}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.main,
        showDivider && styles.divider,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[styles.iconBox, { backgroundColor: Colors[iconBackground] }]}
      >
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.texts}>
        <Text size="subtitle" weight="bold">
          {title}
        </Text>
        <Text size="caption" color="subtext" style={styles.description}>
          {description}
        </Text>
      </View>
      {isAvailable ? (
        <View style={styles.trailing}>
          {!!value && (
            <Text size="caption" weight="semiBold" color="primaryDark">
              {value}
            </Text>
          )}
          {!!onPress && <Icon name="chevron-forward" size={16} color="text" />}
        </View>
      ) : (
        <View style={styles.soonBadge}>
          <Text size="caption" weight="medium" color="subtext">
            Soon
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const ICON_BOX_SIZE = 44;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  description: {
    marginTop: 2,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  soonBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.inputBg,
  },
});
