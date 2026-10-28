import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';

import { useReminders } from '@src/context/RemindersContext';
import {
  AlertStatus,
  getAlertStatus,
  requestAlertPermissions,
  resyncGeofences,
  syncGeofences,
} from '@src/services/geofenceAlerts';
import { startPushMessaging } from '@src/services/pushMessaging';

interface AlertsContextValue {
  /** Null until known, or when the native module is unavailable. */
  status: AlertStatus | null;
  requestPermissions: () => Promise<void>;
}

const AlertsContext = createContext<AlertsContextValue | null>(null);

/**
 * Keeps the OS watching the signed-in user's open reminders, so arrival
 * alerts follow every add, edit, completion and deletion.
 */
export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const { reminders, isLoading } = useReminders();
  const [status, setStatus] = useState<AlertStatus | null>(null);

  const refreshStatus = useCallback(
    () =>
      getAlertStatus()
        .then(setStatus)
        .catch(() => setStatus(null)),
    [],
  );

  useEffect(() => {
    if (!isLoading) {
      syncGeofences(reminders).catch(error =>
        console.error('[Alerts] sync failed', error),
      );
    }
  }, [reminders, isLoading]);

  // Signing out stops all alerts for this account.
  useEffect(
    () => () => {
      syncGeofences([]).catch(() => {});
    },
    [],
  );

  // Permissions may change in system settings, and past due dates expire.
  useEffect(() => {
    refreshStatus();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refreshStatus();
        resyncGeofences().catch(() => {});
      }
    });
    return () => subscription.remove();
  }, [refreshStatus]);

  useEffect(() => startPushMessaging(), []);

  const requestPermissions = useCallback(async () => {
    setStatus(await requestAlertPermissions());
  }, []);

  const value = useMemo(
    () => ({ status, requestPermissions }),
    [status, requestPermissions],
  );

  return (
    <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>
  );
};

export const useAlerts = (): AlertsContextValue => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used inside AlertsProvider.');
  }
  return context;
};
