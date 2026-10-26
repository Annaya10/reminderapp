import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@src/constants/colors';
import { Spacing } from '@src/constants/layout';
import { useResponsive } from '@src/hooks/useResponsive';

/**
 * Applies the top safe-area inset only; the bottom inset is handled by the
 * tab bar.
 */
export const ScreenContainer = (props: ViewProps) => {
  const { children, style, ...rest } = props;
  const { top } = useSafeAreaInsets();
  const { contentMaxWidth } = useResponsive();

  return (
    <View {...rest} style={[styles.main, { paddingTop: top }]}>
      <View style={[styles.content, { maxWidth: contentMaxWidth }, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.screenBg,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
});
