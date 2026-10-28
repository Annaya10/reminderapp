import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';

import { useAlerts } from '@src/context/AlertsContext';
import { isFullyEnabled } from '@src/services/geofenceAlerts';

/** Asked at most once per app launch. */
let hasPrompted = false;

export const ALERT_DISCLOSURE =
  'ReminderApp uses your location in the background, even when the app is ' +
  "closed, to alert you with a sound when you arrive at a reminder's place " +
  'on its due date. Your location is not stored or shared.';

/** Explains and then asks for what arrival alerts need. */
export const useAlertSetup = () => {
  const { status, requestPermissions } = useAlerts();

  const setUp = () =>
    Alert.alert('Turn on arrival alerts', ALERT_DISCLOSURE, [
      { text: 'Not now', style: 'cancel' },
      {
        text: 'Continue',
        onPress: async () => {
          await requestPermissions();
        },
      },
    ]);

  const openSettings = () => Linking.openSettings();

  return { status, isEnabled: isFullyEnabled(status), setUp, openSettings };
};

/** Shows the setup prompt once per launch while alerts are not fully on. */
export const useAlertSetupPrompt = () => {
  const { status, isEnabled, setUp } = useAlertSetup();

  useEffect(() => {
    if (status && !isEnabled && !hasPrompted) {
      hasPrompted = true;
      setUp();
    }
    // setUp is recreated each render; prompting depends only on status.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isEnabled]);
};
