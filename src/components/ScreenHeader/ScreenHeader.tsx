import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { HeaderSurface } from '@src/components/HeaderSurface';
import { IconButton } from '@src/components/IconButton';
import { Text } from '@src/components/Text';
import { Spacing } from '@src/constants/layout';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  right?: ReactNode;
  /** Extra content rendered under the title row, inside the header. */
  children?: ReactNode;
}

export const ScreenHeader = (props: ScreenHeaderProps) => {
  const { title, subtitle, onBackPress, right, children } = props;

  return (
    <HeaderSurface>
      <View style={styles.main}>
        {!!onBackPress && (
          <View style={styles.back}>
            <IconButton
              icon="chevron-back"
              accessibilityLabel="Go back"
              onPress={onBackPress}
            />
          </View>
        )}
        <View style={styles.row}>
          <View style={styles.titles}>
            <Text size="heading" weight="bold" numberOfLines={1}>
              {title}
            </Text>
            {!!subtitle && (
              <Text color="subtext" numberOfLines={1} style={styles.subtitle}>
                {subtitle}
              </Text>
            )}
          </View>
          {right}
        </View>
        {children}
      </View>
    </HeaderSurface>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titles: {
    flexShrink: 1,
    marginRight: Spacing.md,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
});
