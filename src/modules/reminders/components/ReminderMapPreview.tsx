import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

import { Icon } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { formatDistance, getCircleBounds } from '@src/helpers/geo';
import { GeofenceLayer } from '@src/modules/reminders/components/GeofenceLayer';
import { ReminderMarker } from '@src/modules/reminders/components/ReminderMarker';
import { Reminder } from '@src/modules/reminders/types';

const PREVIEW_HEIGHT = 210;
const CAMERA_PADDING = {
  paddingTop: Spacing.xxl + Spacing.lg,
  paddingBottom: Spacing.xl,
  paddingLeft: Spacing.xl,
  paddingRight: Spacing.xl,
};

interface ReminderMapPreviewProps {
  reminder: Reminder;
  /** Opens the full map focused on this reminder. */
  onExpandPress: () => void;
}

/** Static map showing a reminder's area. */
export const ReminderMapPreview = (props: ReminderMapPreviewProps) => {
  const { reminder, onExpandPress } = props;
  const bounds = useMemo(
    () => getCircleBounds(reminder.coordinate, reminder.radius),
    [reminder.coordinate, reminder.radius],
  );

  return (
    <View style={styles.main}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        // TextureView, so the map is clipped to its rounded card on Android.
        surfaceView={false}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
      >
        <Mapbox.Camera
          bounds={bounds}
          padding={CAMERA_PADDING}
          animationDuration={0}
        />
        <GeofenceLayer id="preview" geofences={[reminder]} />
        <ReminderMarker
          coordinate={reminder.coordinate}
          isCompleted={reminder.isCompleted}
        />
      </Mapbox.MapView>

      <View style={styles.triggerPill} pointerEvents="none">
        <View style={styles.triggerDot} />
        <Text weight="semiBold">
          Arrive trigger • {formatDistance(reminder.radius)}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show on map"
        hitSlop={Spacing.xs}
        onPress={onExpandPress}
        style={({ pressed }) => [styles.expand, pressed && styles.pressed]}
      >
        <Icon name="locate-outline" size={20} color="text" />
      </Pressable>
    </View>
  );
};

const EXPAND_SIZE = 40;

const styles = StyleSheet.create({
  main: {
    height: PREVIEW_HEIGHT,
    overflow: 'hidden',
    borderRadius: Radius.lg,
    backgroundColor: Colors.inputBg,
  },
  map: {
    flex: 1,
  },
  triggerPill: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  triggerDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  expand: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
    width: EXPAND_SIZE,
    height: EXPAND_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
});
