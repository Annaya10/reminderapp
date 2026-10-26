import React from 'react';
import { TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import Mapbox from '@rnmapbox/maps';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Button } from '@src/components/Button';
import { DateTimeField } from '@src/components/DateTimeField';
import { IconButton } from '@src/components/IconButton';
import { TextField } from '@src/components/TextField';
import { destinationPoint } from '@src/helpers/geo';
import { DraggableMarker } from '@src/modules/reminders/components/DraggableMarker';
import { ReminderFormSheet } from '@src/modules/reminders/components/ReminderFormSheet';
import { Reminder } from '@src/modules/reminders/types';

const userCoordinate = [-0.1276, 51.5072];

const initialMetrics = {
  frame: { x: 0, y: 0, width: 400, height: 800 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

type Renderer = ReactTestRenderer.ReactTestRenderer;

const renderSheet = (
  reminder: Reminder | null,
  handlers: { onSave?: jest.Mock; onDeletePress?: jest.Mock } = {},
) => {
  let renderer!: Renderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <ReminderFormSheet
          visible
          reminder={reminder}
          userCoordinate={userCoordinate}
          onSave={handlers.onSave ?? jest.fn(async () => true)}
          onDeletePress={handlers.onDeletePress ?? jest.fn()}
          onClose={jest.fn()}
        />
      </SafeAreaProvider>,
    );
  });
  // MapView renders its children only after its first layout.
  const mapLayoutTarget = renderer.root
    .findByType(Mapbox.MapView)
    .findAll(node => typeof node.props.onLayout === 'function')[0];
  ReactTestRenderer.act(() => {
    mapLayoutTarget.props.onLayout({
      nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 260 } },
    });
  });
  return renderer;
};

const getButton = (renderer: Renderer, label: string) =>
  renderer.root.findAll(
    node => node.type === Button && node.props.label === label,
  )[0];

const getField = (renderer: Renderer, label: string) =>
  renderer.root
    .findAll(node => node.type === TextField && node.props.label === label)[0]
    .findByType(TextInput);

const getMarker = (renderer: Renderer, label: string) =>
  renderer.root.findAll(
    node =>
      node.type === DraggableMarker && node.props.accessibilityLabel === label,
  )[0];

const PIN = 'Move reminder location';
const RADIUS_HANDLE = 'Resize reminder area';

const savedReminder: Reminder = {
  id: 'r1',
  title: 'Gym',
  description: 'Bring towel',
  coordinate: [-0.1, 51.5],
  radius: 500,
  remindAt: '2026-10-12T15:30:00.000Z',
  createdAt: '2026-10-01T09:00:00.000Z',
  isCompleted: false,
};

describe('ReminderFormSheet', () => {
  test('close button closes the sheet', () => {
    const onClose = jest.fn();
    let renderer!: Renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={initialMetrics}>
          <ReminderFormSheet
            visible
            reminder={null}
            userCoordinate={userCoordinate}
            onSave={jest.fn(async () => true)}
            onDeletePress={jest.fn()}
            onClose={onClose}
          />
        </SafeAreaProvider>,
      );
    });
    const closeButton = renderer.root.findAll(
      node =>
        node.type === IconButton && node.props.accessibilityLabel === 'Close',
    )[0];
    ReactTestRenderer.act(() => {
      closeButton.props.onPress();
    });
    expect(onClose).toHaveBeenCalled();
    expect(
      renderer.root.findAll(
        node => node.type === Button && node.props.label === 'Cancel',
      ),
    ).toHaveLength(0);
  });

  test('save is disabled until a title is entered, then saves all fields', async () => {
    const onSave = jest.fn(async () => true);
    const renderer = renderSheet(null, { onSave });

    expect(getButton(renderer, 'Save Reminder').props.disabled).toBe(true);

    const remindAt = new Date(2026, 10, 3, 17, 45);
    ReactTestRenderer.act(() => {
      getField(renderer, 'Title').props.onChangeText('  Buy milk ');
      getField(renderer, 'Description').props.onChangeText(' 2 litres ');
      renderer.root.findByType(DateTimeField).props.onChange(remindAt);
    });
    expect(getButton(renderer, 'Save Reminder').props.disabled).toBe(false);

    await ReactTestRenderer.act(async () => {
      await getButton(renderer, 'Save Reminder').props.onPress();
    });
    expect(onSave).toHaveBeenCalledWith({
      title: 'Buy milk',
      description: '2 litres',
      coordinate: userCoordinate,
      radius: 250,
      remindAt: remindAt.toISOString(),
    });
  });

  test('a new reminder defaults to the next full hour', () => {
    const renderer = renderSheet(null);
    const value: Date = renderer.root.findByType(DateTimeField).props.value;
    expect(value.getMinutes()).toBe(0);
    expect(value.getTime()).toBeGreaterThan(Date.now());
  });

  test('edit mode loads saved values and saves dragged pin and radius', async () => {
    const onSave = jest.fn(async () => true);
    const renderer = renderSheet(savedReminder, { onSave });

    expect(getField(renderer, 'Title').props.value).toBe('Gym');
    expect(getField(renderer, 'Description').props.value).toBe('Bring towel');
    expect(
      renderer.root.findByType(DateTimeField).props.value.toISOString(),
    ).toBe(savedReminder.remindAt);

    const movedTo = [-0.11, 51.51];
    ReactTestRenderer.act(() => {
      getMarker(renderer, PIN).props.onDrag(movedTo);
    });
    // The radius handle follows the new center.
    expect(getMarker(renderer, RADIUS_HANDLE).props.coordinate[1]).toBeCloseTo(
      movedTo[1],
      3,
    );

    ReactTestRenderer.act(() => {
      getMarker(renderer, RADIUS_HANDLE).props.onDrag(
        destinationPoint(movedTo, 734, Math.PI / 2),
      );
    });
    await ReactTestRenderer.act(async () => {
      await getButton(renderer, 'Save Reminder').props.onPress();
    });

    expect(onSave).toHaveBeenCalledWith({
      title: 'Gym',
      description: 'Bring towel',
      coordinate: movedTo,
      radius: 730,
      remindAt: savedReminder.remindAt,
    });
  });

  test('delete button hands the reminder to the owner', () => {
    const onDeletePress = jest.fn();
    const renderer = renderSheet(savedReminder, { onDeletePress });

    const deleteButton = renderer.root.findAll(
      node =>
        node.type === IconButton &&
        node.props.accessibilityLabel === 'Delete reminder',
    )[0];
    ReactTestRenderer.act(() => {
      deleteButton.props.onPress();
    });

    expect(onDeletePress).toHaveBeenCalledWith(savedReminder);
  });
});
