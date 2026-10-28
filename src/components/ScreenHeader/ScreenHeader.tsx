import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { HeaderSurface } from '@src/components/HeaderSurface';
import { Icon } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Spacing } from '@src/constants/layout';

interface ScreenHeaderProps {
  title: string;
  onBackPress?: () => void;
  right?: ReactNode;
  /** Extra content rendered under the title row, inside the header. */
  children?: ReactNode;
}

/** Top bar: optional back button, brand pin and title, with actions on the right. */
export const ScreenHeader = (props: ScreenHeaderProps) => {
  const { title, onBackPress, right, children } = props;

  return (
    <HeaderSurface>
      <View style={styles.main}>
        <View style={styles.navRow}>
          <View style={styles.titleRow}>
            {!!onBackPress && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={Spacing.sm}
                onPress={onBackPress}
                style={styles.back}
              >
                <Icon name="chevron-back" size={26} color="text" />
              </Pressable>
            )}
            <Icon name="location" size={22} color="primary" />
            <Text
              size="title"
              weight="bold"
              numberOfLines={1}
              style={styles.title}
              accessibilityRole="header"
            >
              {title}
            </Text>
          </View>
          {!!right && <View style={styles.right}>{right}</View>}
        </View>
        {children}
      </View>
    </HeaderSurface>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  back: {
    marginRight: Spacing.md,
  },
  title: {
    flexShrink: 1,
    marginLeft: Spacing.sm,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginLeft: Spacing.md,
  },
});
