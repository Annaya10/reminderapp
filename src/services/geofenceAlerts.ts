import { NativeModules, PermissionsAndroid, Platform } from 'react-native';

import { toLocalDayKey } from '@src/helpers/date';
import { Reminder } from '@src/modules/reminders/types';

/**
 * Arrival alerts. The native ReminderGeofence module registers each open
 * reminder's area with the OS (Android Play services geofencing, iOS region
 * monitoring). On entry the OS wakes native code, even when the app is closed,
 * which shows a notification with sound if the reminder is due that day and
 * has not alerted yet that day.
 */

interface NativeGeofenceReminder {
  id: string;
  title: string;
  body: string;
  /** Local due date, "yyyy-MM-dd". */
  dueDay: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export type LocationAccess = 'always' | 'whenInUse' | 'denied';

export interface AlertStatus {
  notifications: boolean;
  location: LocationAccess;
}

export interface SyncResult {
  /** Number of areas the OS is watching. */
  watching: number;
  error: string | null;
}

interface ReminderGeofenceModule {
  sync: (reminders: NativeGeofenceReminder[]) => Promise<SyncResult>;
  getStatus: () => Promise<AlertStatus>;
  displayNotification: (title: string, body: string) => Promise<void>;
  /** iOS only: asks for notification and "Always" location access. */
  requestPermissions?: () => Promise<AlertStatus>;
}

const getNative = () =>
  NativeModules.ReminderGeofence as ReminderGeofenceModule | undefined;

export const toNativeReminder = (
  reminder: Reminder,
): NativeGeofenceReminder => ({
  id: reminder.id,
  title: reminder.title,
  body: reminder.description,
  dueDay: toLocalDayKey(new Date(reminder.remindAt)),
  latitude: reminder.coordinate[1],
  longitude: reminder.coordinate[0],
  radius: reminder.radius,
});

let lastSynced: Reminder[] = [];

/**
 * Watches the areas of open reminders and stops watching completed or
 * deleted ones. Passing an empty list stops all alerts (e.g. on logout).
 */
export const syncGeofences = async (
  reminders: Reminder[],
): Promise<SyncResult | null> => {
  lastSynced = reminders;
  const native = getNative();
  if (!native) {
    return null;
  }
  const open = reminders.filter(item => !item.isCompleted);
  const result = await native.sync(open.map(toNativeReminder));
  if (result.error) {
    console.warn('[Alerts] reminder areas not watched:', result.error);
  }
  return result;
};

/** Registers again after permissions change. */
export const resyncGeofences = () => syncGeofences(lastSynced);

export const getAlertStatus = async (): Promise<AlertStatus | null> =>
  getNative()?.getStatus() ?? null;

export const isFullyEnabled = (status: AlertStatus | null) =>
  !!status && status.notifications && status.location === 'always';

const requestAndroidPermissions = async () => {
  const { PERMISSIONS, RESULTS } = PermissionsAndroid;
  const apiLevel = Number(Platform.Version);
  const location = await PermissionsAndroid.request(
    PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (apiLevel >= 33) {
    await PermissionsAndroid.request(PERMISSIONS.POST_NOTIFICATIONS);
  }
  // Must be asked separately, after foreground location is granted. From
  // Android 11 this opens the system page with "Allow all the time".
  if (location === RESULTS.GRANTED && apiLevel >= 29) {
    await PermissionsAndroid.request(PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
  }
};

/** Asks for what arrival alerts need, then registers the areas again. */
export const requestAlertPermissions =
  async (): Promise<AlertStatus | null> => {
    const native = getNative();
    if (!native) {
      return null;
    }
    if (Platform.OS === 'android') {
      await requestAndroidPermissions();
    } else {
      await native.requestPermissions?.();
    }
    await resyncGeofences();
    return native.getStatus();
  };

export const displayNotification = async (title: string, body: string) =>
  getNative()?.displayNotification(title, body);
