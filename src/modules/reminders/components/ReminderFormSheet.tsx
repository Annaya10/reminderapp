import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { Position } from 'geojson';

import { BottomSheet } from '@src/components/BottomSheet';
import { Button } from '@src/components/Button';
import { DateTimeField } from '@src/components/DateTimeField';
import { IconButton } from '@src/components/IconButton';
import { Text } from '@src/components/Text';
import { TextField } from '@src/components/TextField';
import { Colors } from '@src/constants/colors';
import { Spacing } from '@src/constants/layout';
import { nextFullHour, startOfDay } from '@src/helpers/date';
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
        <Text size="title" weight="bold">
          {isEditing ? 'Edit Reminder' : 'New Reminder'}
        </Text>
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
        scrollEnabled={!isAdjustingMap}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextField
          label="Title"
          placeholder="e.g. Pick up groceries"
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          maxLength={60}
        />

        <View style={styles.field}>
          <TextField
            label="Description"
            placeholder="Add details (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={200}
          />
        </View>

        <View style={styles.field}>
          <DateTimeField
            label="Date & time"
            value={remindAt}
            onChange={setRemindAt}
            minimumDate={isEditing ? undefined : startOfDay(new Date())}
          />
        </View>

        <Text weight="medium" style={styles.sectionLabel}>
          Location
        </Text>
        <LocationPicker
          value={location}
          userCoordinate={userCoordinate}
          onChange={setLocation}
          onAdjustingChange={setIsAdjustingMap}
        />
      </ScrollView>

      <View style={styles.actions}>
        <Button
          label="Save Reminder"
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  scroll: {
    flexShrink: 1,
  },
  field: {
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  actions: {
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
});
