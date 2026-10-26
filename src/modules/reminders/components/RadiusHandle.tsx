import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { Radius } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

const HANDLE_SIZE = 28;

/** Handle shown on the geofence edge for resizing the circle. */
export const RadiusHandle = () => (
  <View style={styles.main}>
    <Icon name="resize" size={14} color="primary" />
  </View>
);

const styles = StyleSheet.create({
  main: {
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
});
