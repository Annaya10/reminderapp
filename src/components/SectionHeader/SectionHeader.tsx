import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@src/components/Text';
import { Spacing } from '@src/constants/layout';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const SectionHeader = (props: SectionHeaderProps) => {
  const { title, actionLabel, onActionPress } = props;

  return (
    <View style={styles.main}>
      <Text size="subtitle" weight="semiBold">
        {title}
      </Text>
      {!!actionLabel && (
        <Pressable
          accessibilityRole="button"
          hitSlop={Spacing.sm}
          onPress={onActionPress}
        >
          <Text weight="medium" color="primary">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
});
