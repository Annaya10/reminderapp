import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { Position } from 'geojson';

import { HeaderSurface } from '@src/components/HeaderSurface';
import { Colors } from '@src/constants/colors';
import { Screens } from '@src/constants/screens';
import { useCurrentUser } from '@src/context/AuthContext';
import { useReminders } from '@src/context/RemindersContext';
import {
  LocationMap,
  MapFocusRequest,
} from '@src/modules/reminders/components/LocationMap';
import { ReminderFormSheet } from '@src/modules/reminders/components/ReminderFormSheet';
import { ReminderHomeHeader } from '@src/modules/reminders/components/ReminderHomeHeader';
import { useReminderForm } from '@src/modules/reminders/hooks/useReminderForm';
import { HomeRoute, TabNavigation } from '@src/routes/types';

export const ReminderHomeScreen = () => {
  const navigation = useNavigation<TabNavigation>();
  const route = useRoute<HomeRoute>();
  const user = useCurrentUser();
  const tabBarHeight = useBottomTabBarHeight();
  const { reminders } = useReminders();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [userCoordinate, setUserCoordinate] = useState<Position | null>(null);
  const { sheetProps, openAdd, openEdit } = useReminderForm(userCoordinate);

  const handleHeaderLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setHeaderHeight(event.nativeEvent.layout.height),
    [],
  );

  // The center "+" tab asks for the Add Reminder form via a route param.
  const addRequestId = route.params?.addRequestId;
  useEffect(() => {
    if (addRequestId) {
      openAdd();
    }
  }, [addRequestId, openAdd]);

  // "View on map" from the reminders list or details screen.
  const { focusReminderId, focusRequestId } = route.params ?? {};
  const focusRequest = useMemo<MapFocusRequest | null>(() => {
    const target = reminders.find(item => item.id === focusReminderId);
    return target && focusRequestId
      ? {
          coordinate: target.coordinate,
          radius: target.radius,
          requestId: focusRequestId,
        }
      : null;
    // Only re-focus when a new request arrives, not on every reminders change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusReminderId, focusRequestId]);

  return (
    <View style={styles.main}>
      <LocationMap
        reminders={reminders}
        insetTop={headerHeight}
        insetBottom={tabBarHeight}
        focusRequest={focusRequest}
        onReminderPress={openEdit}
        onUserLocationChange={setUserCoordinate}
      />
      <HeaderSurface style={styles.header} onLayout={handleHeaderLayout}>
        <ReminderHomeHeader
          userName={user.name}
          onAddPress={openAdd}
          onProfilePress={() => navigation.navigate(Screens.profile)}
        />
      </HeaderSurface>
      <ReminderFormSheet {...sheetProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
