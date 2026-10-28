import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@src/constants/colors';
import { Spacing } from '@src/constants/layout';
import { useResponsive } from '@src/hooks/useResponsive';

/** Header panel that extends behind the status bar, on the screen background. */
export const HeaderSurface = (props: ViewProps) => {
  const { children, style, ...rest } = props;
  const { top } = useSafeAreaInsets();
  const { contentMaxWidth } = useResponsive();

  return (
    <View {...rest} style={[styles.main, { paddingTop: top }, style]}>
      <View style={[styles.content, { maxWidth: contentMaxWidth }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.screenBg,
  },
  content: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
});
