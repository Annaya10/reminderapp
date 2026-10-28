import { Platform } from 'react-native';
import { getApps } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  RemoteMessage,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

import { displayNotification } from '@src/services/geofenceAlerts';

/**
 * Firebase Cloud Messaging, for notifications sent from a server. Arrival
 * alerts do not depend on it; they are raised on the device (see
 * geofenceAlerts). FCM only runs once the Firebase config files are added.
 */

const isConfigured = () => getApps().length > 0;

const showWhileOpen = (message: RemoteMessage) => {
  const title = message.notification?.title ?? message.data?.title;
  const body = message.notification?.body ?? message.data?.body ?? '';
  if (typeof title === 'string') {
    displayNotification(title, typeof body === 'string' ? body : '');
  }
};

/**
 * Must run at startup, outside React. With the app in the background or
 * closed, the OS shows "notification" messages itself, using the reminder
 * channel and sound configured natively.
 */
export const registerBackgroundMessageHandler = () => {
  if (!isConfigured()) {
    return;
  }
  setBackgroundMessageHandler(getMessaging(), async message => {
    console.log('[Push] background message', message.messageId);
  });
};

/**
 * Starts receiving pushes while the app runs. Returns a cleanup function.
 * The device token is what a server needs to send this device a message.
 */
export const startPushMessaging = (
  onToken: (token: string) => void = token =>
    console.log('[Push] FCM token', token),
): (() => void) => {
  if (!isConfigured()) {
    return () => {};
  }
  const messaging = getMessaging();
  getToken(messaging)
    .then(onToken)
    .catch(error => console.warn('[Push] could not get FCM token', error));
  const unsubscribeToken = onTokenRefresh(messaging, onToken);
  // Android does not show pushes for an app in the foreground; iOS does,
  // using the presentation options in firebase.json.
  const unsubscribeMessages =
    Platform.OS === 'android' ? onMessage(messaging, showWhileOpen) : () => {};
  return () => {
    unsubscribeToken();
    unsubscribeMessages();
  };
};
