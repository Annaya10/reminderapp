import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import type { Position } from 'geojson';

import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { ReminderPin } from '@src/modules/reminders/components/ReminderPin';

interface ReminderMarkerProps {
  coordinate: Position;
  title?: string;
  isCompleted?: boolean;
  onPress?: () => void;
}

const LABEL_HEIGHT = 26;
const LABEL_MAX_WIDTH = 180;

/**
 * Pin with the title above it. A spacer below the pin keeps the pin at the
 * marker's center, so the center anchor lines up with the coordinate.
 */
export const ReminderMarker = (props: ReminderMarkerProps) => {
  const { coordinate, title, isCompleted, onPress } = props;

  return (
    <Mapbox.MarkerView
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      allowOverlap
      allowOverlapWithPuck
    >
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={title ? `Reminder ${title}` : undefined}
        disabled={!onPress}
        onPress={onPress}
        style={styles.main}
      >
        <View style={[styles.label, !title && styles.hidden]}>
          <Text size="caption" weight="semiBold" numberOfLines={1}>
            {title}
          </Text>
        </View>
        <ReminderPin isCompleted={isCompleted} />
        <View style={styles.spacer} />
      </Pressable>
    </Mapbox.MarkerView>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    maxWidth: LABEL_MAX_WIDTH,
  },
  label: {
    height: LABEL_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
    borderRadius: Radius.sm,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  hidden: {
    opacity: 0,
  },
  spacer: {
    height: LABEL_HEIGHT + Spacing.xs,
  },
});
