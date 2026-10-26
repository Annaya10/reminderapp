import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { getCircleBounds } from '@src/helpers/geo';
import { GeofenceLayer } from '@src/modules/reminders/components/GeofenceLayer';
import { ReminderMarker } from '@src/modules/reminders/components/ReminderMarker';
import { Reminder } from '@src/modules/reminders/types';

const PREVIEW_HEIGHT = 200;
const CAMERA_PADDING = {
  paddingTop: Spacing.xl,
  paddingBottom: Spacing.xl,
  paddingLeft: Spacing.xl,
  paddingRight: Spacing.xl,
};

/** Static map showing a reminder's area. */
export const ReminderMapPreview = ({ reminder }: { reminder: Reminder }) => {
  const bounds = useMemo(
    () => getCircleBounds(reminder.coordinate, reminder.radius),
    [reminder.coordinate, reminder.radius],
  );

  return (
    <View style={styles.main}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
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
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    height: PREVIEW_HEIGHT,
    overflow: 'hidden',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: {
    flex: 1,
  },
});
