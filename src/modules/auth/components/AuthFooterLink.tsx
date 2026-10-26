import React from 'react';
import { Pressable } from 'react-native';

import { Text } from '@src/components/Text';
import { Spacing } from '@src/constants/layout';

interface AuthFooterLinkProps {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
}

export const AuthFooterLink = (props: AuthFooterLinkProps) => {
  const { prompt, actionLabel, onPress } = props;

  return (
    <>
      <Text color="subtext">{prompt} </Text>
      <Pressable
        accessibilityRole="link"
        hitSlop={Spacing.sm}
        onPress={onPress}
      >
        <Text weight="semiBold" color="primary">
          {actionLabel}
        </Text>
      </Pressable>
    </>
  );
};
