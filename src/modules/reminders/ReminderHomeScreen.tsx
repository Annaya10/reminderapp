import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { Position } from 'geojson';

import { ProfileButton } from '@src/components/ProfileButton';
import { ScreenHeader } from '@src/components/ScreenHeader';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Screens } from '@src/constants/screens';
import { useCurrentUser } from '@src/context/AuthContext';
import { useReminders } from '@src/context/RemindersContext';
import { useResponsive } from '@src/hooks/useResponsive';
import {
  LocationMap,
  MapFocusRequest,
} from '@src/modules/reminders/components/LocationMap';
import { NextReminderCard } from '@src/modules/reminders/components/NextReminderCard';
import { ReminderFormSheet } from '@src/modules/reminders/components/ReminderFormSheet';
import { ReminderHomeHeader } from '@src/modules/reminders/components/ReminderHomeHeader';
import { getNextReminder } from '@src/modules/reminders/helpers';
import { useAlertSetupPrompt } from '@src/modules/reminders/hooks/useAlertSetupPrompt';
import { useReminderForm } from '@src/modules/reminders/hooks/useReminderForm';
import { HomeRoute, TabNavigation } from '@src/routes/types';

const useOverlayHeight = () => {
  const [height, setHeight] = useState(0);
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height),
    [],
  );
  return [height, onLayout] as const;
};

export const ReminderHomeScreen = () => {
  const navigation = useNavigation<TabNavigation>();
  const route = useRoute<HomeRoute>();
  const user = useCurrentUser();
  const tabBarHeight = useBottomTabBarHeight();
  const { contentMaxWidth } = useResponsive();
  const { reminders } = useReminders();
  const [topCardHeight, handleTopCardLayout] = useOverlayHeight();
  const [bottomCardHeight, handleBottomCardLayout] = useOverlayHeight();
  const [userCoordinate, setUserCoordinate] = useState<Position | null>(null);
  const { sheetProps, openAdd, openEdit } = useReminderForm(userCoordinate);

  useAlertSetupPrompt();

  const nextReminder = useMemo(() => getNextReminder(reminders), [reminders]);

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

  const openProfile = () => navigation.navigate(Screens.profile);

  return (
    <View style={styles.main}>
      <ScreenHeader
        title="Map Overview"
        right={<ProfileButton onPress={openProfile} />}
      />
      <View
        style={[styles.mapArea, { paddingBottom: tabBarHeight + Spacing.md }]}
      >
        <View style={[styles.mapCard, { maxWidth: contentMaxWidth }]}>
          <LocationMap
            reminders={reminders}
            insetTop={topCardHeight + Spacing.md}
            insetBottom={nextReminder ? bottomCardHeight + Spacing.md : 0}
            focusRequest={focusRequest}
            onReminderPress={openEdit}
            onUserLocationChange={setUserCoordinate}
          />
          <View style={styles.topOverlay} onLayout={handleTopCardLayout}>
            <ReminderHomeHeader
              userName={user.name}
              onAddPress={openAdd}
              onProfilePress={openProfile}
            />
          </View>
          {!!nextReminder && (
            <View
              style={styles.bottomOverlay}
              onLayout={handleBottomCardLayout}
            >
              <NextReminderCard
                reminder={nextReminder}
                onPress={() =>
                  navigation.setParams({
                    focusReminderId: nextReminder.id,
                    focusRequestId: Date.now(),
                  })
                }
                onDetailsPress={() =>
                  navigation.navigate(Screens.reminderDetails, {
                    reminderId: nextReminder.id,
                  })
                }
              />
            </View>
          )}
        </View>
      </View>
      <ReminderFormSheet {...sheetProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  mapArea: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  mapCard: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: Radius.xl,
    backgroundColor: Colors.inputBg,
  },
  topOverlay: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
});
