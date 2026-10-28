import React from 'react';
import { NativeModules } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { AlertsProvider } from '@src/context/AlertsContext';
import { useReminders } from '@src/context/RemindersContext';
import { Reminder } from '@src/modules/reminders/types';
import { toNativeReminder } from '@src/services/geofenceAlerts';

jest.mock('@src/context/RemindersContext', () => ({
  useReminders: jest.fn(),
}));

const mockUseReminders = useReminders as jest.Mock;

const nativeModule = {
  sync: jest.fn(async () => ({ watching: 0, error: null })),
  getStatus: jest.fn(async () => ({ notifications: true, location: 'always' })),
  displayNotification: jest.fn(),
};

const reminder = (overrides: Partial<Reminder> = {}): Reminder => ({
  id: 'r1',
  title: 'Pick up parcel',
  description: 'Counter 2',
  coordinate: [-0.1276, 51.5072],
  radius: 250,
  // Local time, so the due day does not depend on the test machine's zone.
  remindAt: new Date(2026, 10, 3, 23, 30).toISOString(),
  createdAt: '2026-10-01T09:00:00.000Z',
  isCompleted: false,
  ...overrides,
});

const syncedIds = (call: number) =>
  (nativeModule.sync.mock.calls[call] as unknown as [{ id: string }[]])[0].map(
    item => item.id,
  );

beforeEach(() => {
  NativeModules.ReminderGeofence = nativeModule;
  jest.clearAllMocks();
});

const mounted: ReactTestRenderer.ReactTestRenderer[] = [];

afterEach(() => {
  // Unmount so a previous test's async status update cannot sync later on.
  ReactTestRenderer.act(() => mounted.splice(0).forEach(r => r.unmount()));
  delete NativeModules.ReminderGeofence;
});

describe('toNativeReminder', () => {
  test('sends the local due day, coordinates, radius and notes', () => {
    expect(toNativeReminder(reminder())).toEqual({
      id: 'r1',
      title: 'Pick up parcel',
      body: 'Counter 2',
      dueDay: '2026-11-03',
      latitude: 51.5072,
      longitude: -0.1276,
      radius: 250,
    });
  });
});

describe('AlertsProvider', () => {
  const render = () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <AlertsProvider>{null}</AlertsProvider>,
      );
    });
    mounted.push(renderer);
    return renderer;
  };

  test('waits for reminders to load before syncing', () => {
    mockUseReminders.mockReturnValue({ reminders: [], isLoading: true });
    render();
    expect(nativeModule.sync).not.toHaveBeenCalled();
  });

  test('watches open reminders and stops watching completed or deleted ones', async () => {
    mockUseReminders.mockReturnValue({
      reminders: [reminder(), reminder({ id: 'r2' })],
      isLoading: false,
    });
    const renderer = render();
    expect(syncedIds(0)).toEqual(['r1', 'r2']);

    // r1 completed, r2 deleted.
    mockUseReminders.mockReturnValue({
      reminders: [reminder({ isCompleted: true })],
      isLoading: false,
    });
    await ReactTestRenderer.act(async () => {
      renderer.update(<AlertsProvider>{null}</AlertsProvider>);
    });
    expect(syncedIds(1)).toEqual([]);
  });

  test('stops all alerts when the user signs out', () => {
    mockUseReminders.mockReturnValue({
      reminders: [reminder()],
      isLoading: false,
    });
    const renderer = render();
    mounted.splice(mounted.indexOf(renderer), 1);
    ReactTestRenderer.act(() => renderer.unmount());
    expect(syncedIds(nativeModule.sync.mock.calls.length - 1)).toEqual([]);
  });
});
