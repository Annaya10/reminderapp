import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { Position } from 'geojson';

import { BottomSheet } from '@src/components/BottomSheet';
import { Button } from '@src/components/Button';
import { DateTimeField } from '@src/components/DateTimeField';
import { Icon } from '@src/components/Icon';
import { IconButton } from '@src/components/IconButton';
import { Text } from '@src/components/Text';
import { TextField } from '@src/components/TextField';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { nextFullHour, startOfDay } from '@src/helpers/date';
import { formatCoordinate } from '@src/helpers/geo';
import {
  LocationPicker,
  PickerValue,
} from '@src/modules/reminders/components/LocationPicker';
import { DEFAULT_GEOFENCE_RADIUS } from '@src/modules/reminders/constants';
import { Reminder, ReminderDraft } from '@src/modules/reminders/types';

export interface ReminderFormSheetProps {
  visible: boolean;
  /** The reminder being edited, or null when adding a new one. */
  reminder: Reminder | null;
  userCoordinate: Position | null;
  /** Resolves true when saved; the sheet is then closed by the owner. */
  onSave: (draft: ReminderDraft) => Promise<boolean>;
  onDeletePress: (reminder: Reminder) => void;
  onClose: () => void;
}

const TITLE_MAX_LENGTH = 60;
const NOTES_MAX_LENGTH = 200;

export const ReminderFormSheet = (props: ReminderFormSheetProps) => {
  const { visible, onClose } = props;

  // The form mounts each time the sheet opens, so its state starts fresh.
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ReminderForm {...props} />
    </BottomSheet>
  );
};

const ReminderForm = (props: ReminderFormSheetProps) => {
  const { reminder, userCoordinate, onSave, onDeletePress, onClose } = props;
  const isEditing = !!reminder;

  const [title, setTitle] = useState(reminder?.title ?? '');
  const [description, setDescription] = useState(reminder?.description ?? '');
  const [remindAt, setRemindAt] = useState(() =>
    reminder ? new Date(reminder.remindAt) : nextFullHour(),
  );
  const [location, setLocation] = useState<PickerValue>({
    coordinate: reminder?.coordinate ?? userCoordinate,
    radius: reminder?.radius ?? DEFAULT_GEOFENCE_RADIUS,
  });
  // Scrolling is paused while a map control is dragged so the two gestures
  // don't compete.
  const [isAdjustingMap, setIsAdjustingMap] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const trimmedTitle = title.trim();
  const canSave = !!trimmedTitle && !!location.coordinate;

  const handleSave = async () => {
    if (!location.coordinate) {
      return;
    }
    setIsSaving(true);
    const saved = await onSave({
      title: trimmedTitle,
      description: description.trim(),
      coordinate: location.coordinate,
      radius: location.radius,
      remindAt: remindAt.toISOString(),
    });
    if (!saved) {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <View style={styles.headerTexts}>
          <Text size="title" weight="bold">
            {isEditing ? 'Edit Reminder' : 'New Reminder'}
          </Text>
          <Text color="subtext" style={styles.headerSubtitle}>
            Set location trigger & boundary
          </Text>
        </View>
        <View style={styles.headerActions}>
          {isEditing && (
            <IconButton
              icon="trash-outline"
              color="danger"
              accessibilityLabel="Delete reminder"
              onPress={() => onDeletePress(reminder)}
            />
          )}
          <IconButton
            icon="close"
            accessibilityLabel="Close"
            onPress={onClose}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isAdjustingMap}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextField
          label="Reminder title"
          trailingIcon="notifications-outline"
          placeholder="e.g. Pick up prescription"
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          maxLength={TITLE_MAX_LENGTH}
        />

        <TextField
          label="Notes (optional)"
          labelAccessory={
            <Text size="caption" color="subtext">
              {description.length}/{NOTES_MAX_LENGTH}
            </Text>
          }
          placeholder="Add details"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={NOTES_MAX_LENGTH}
        />

        <DateTimeField
          label="Due Date & Time"
          value={remindAt}
          onChange={setRemindAt}
          minimumDate={isEditing ? undefined : startOfDay(new Date())}
        />

        <View>
          <View style={styles.locationLabelRow}>
            <Text weight="semiBold" size="caption" style={styles.sectionLabel}>
              Location & Geofence
            </Text>
            {!!location.coordinate && (
              <View style={styles.coordinateChip}>
                <Icon name="pin-outline" size={12} color="primaryDark" />
                <Text size="caption" weight="semiBold" color="primaryDark">
                  {formatCoordinate(location.coordinate)}
                </Text>
              </View>
            )}
          </View>
          <LocationPicker
            value={location}
            userCoordinate={userCoordinate}
            onChange={setLocation}
            onAdjustingChange={setIsAdjustingMap}
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label="Save Reminder"
          icon="checkmark-circle-outline"
          disabled={!canSave}
          loading={isSaving}
          onPress={handleSave}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerTexts: {
    flexShrink: 1,
  },
  headerSubtitle: {
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginLeft: Spacing.md,
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  locationLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  coordinateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryMuted,
  },
  actions: {
    paddingTop: Spacing.md,
  },
});
