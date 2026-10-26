import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import type { Position } from 'geojson';

import { Colors } from '@src/constants/colors';
import { MapConfig } from '@src/constants/config';
import { Spacing } from '@src/constants/layout';
import { getCircleBounds } from '@src/helpers/geo';
import { useLocationPermission } from '@src/hooks/useLocationPermission';
import { GeofenceLayer } from '@src/modules/reminders/components/GeofenceLayer';
import { LocateButton } from '@src/modules/reminders/components/LocateButton';
import { ReminderMarker } from '@src/modules/reminders/components/ReminderMarker';
import { Geofence, Reminder } from '@src/modules/reminders/types';

export interface MapFocusRequest extends Geofence {
  /** Changes for every request, so the same reminder can be focused again. */
  requestId: number;
}

interface LocationMapProps {
  reminders: Reminder[];
  /** Space covered by overlays (header, tab bar) at the top and bottom. */
  insetTop: number;
  insetBottom: number;
  /** When set, the camera stops following the user and shows this area. */
  focusRequest?: MapFocusRequest | null;
  onReminderPress: (reminder: Reminder) => void;
  onUserLocationChange: (coordinate: Position) => void;
}

type CameraBounds = ReturnType<typeof getCircleBounds>;

export const LocationMap = (props: LocationMapProps) => {
  const {
    reminders,
    insetTop,
    insetBottom,
    focusRequest,
    onReminderPress,
    onUserLocationChange,
  } = props;
  const [isFollowingUser, setIsFollowingUser] = useState(!focusRequest);
  const [focusBounds, setFocusBounds] = useState<CameraBounds | null>(null);
  const hasLocationPermission = useLocationPermission();

  useEffect(() => {
    if (focusRequest) {
      setIsFollowingUser(false);
      setFocusBounds(
        getCircleBounds(focusRequest.coordinate, focusRequest.radius),
      );
    }
  }, [focusRequest]);

  const handleCameraChanged = useCallback((state: Mapbox.MapState) => {
    if (state.gestures.isGestureActive) {
      setIsFollowingUser(false);
    }
  }, []);

  const handleLocatePress = useCallback(() => {
    setFocusBounds(null);
    setIsFollowingUser(true);
  }, []);

  const handleUserLocationUpdate = useCallback(
    (location: Mapbox.Location) =>
      onUserLocationChange([
        location.coords.longitude,
        location.coords.latitude,
      ]),
    [onUserLocationChange],
  );

  const ornamentBottom = insetBottom + Spacing.sm;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        compassEnabled={false}
        scaleBarEnabled={false}
        logoPosition={{ bottom: ornamentBottom, left: Spacing.sm }}
        attributionPosition={{ bottom: ornamentBottom, right: Spacing.sm }}
        onCameraChanged={handleCameraChanged}
      >
        <Mapbox.Camera
          defaultSettings={{ zoomLevel: MapConfig.defaultZoomLevel }}
          followUserLocation={isFollowingUser}
          followZoomLevel={MapConfig.userZoomLevel}
          bounds={!isFollowingUser && focusBounds ? focusBounds : undefined}
          animationDuration={MapConfig.animationDuration}
          padding={{
            paddingTop: insetTop + Spacing.xl,
            paddingBottom: insetBottom + Spacing.xl,
            paddingLeft: Spacing.xl,
            paddingRight: Spacing.xl,
          }}
        />
        {hasLocationPermission && (
          <>
            <Mapbox.UserLocation
              visible={false}
              minDisplacement={10}
              onUpdate={handleUserLocationUpdate}
            />
            <Mapbox.LocationPuck
              puckBearingEnabled
              puckBearing="heading"
              pulsing={{ isEnabled: true, color: Colors.primary }}
            />
          </>
        )}
        <GeofenceLayer id="reminders" geofences={reminders} />
        {reminders.map(reminder => (
          <ReminderMarker
            key={reminder.id}
            coordinate={reminder.coordinate}
            title={reminder.title}
            isCompleted={reminder.isCompleted}
            onPress={() => onReminderPress(reminder)}
          />
        ))}
      </Mapbox.MapView>
      <View style={[styles.controls, { top: insetTop + Spacing.lg }]}>
        <LocateButton active={isFollowingUser} onPress={handleLocatePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    right: Spacing.lg,
  },
});
