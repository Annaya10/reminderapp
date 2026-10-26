import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, IconName } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';

export const TAB_CIRCLE_SIZE = 60;
const RING_WIDTH = 4;

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
    marginTop: -Spacing.xl,
    borderRadius: Radius.full,
    borderWidth: RING_WIDTH,
    borderColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
