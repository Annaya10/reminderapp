import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

export const TAB_CIRCLE_SIZE = 58;

interface TabCircleIconProps {
  name: IconName;
}

/** Circular action icon that sits raised above the tab bar. */
export const TabCircleIcon = ({ name }: TabCircleIconProps) => (
  <View style={styles.main}>
    <Icon name={name} size={30} color="white" />
  </View>
);

const styles = StyleSheet.create({
  main: {
    width: TAB_CIRCLE_SIZE,
    height: TAB_CIRCLE_SIZE,
    marginTop: -TAB_CIRCLE_SIZE / 2,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },
});
