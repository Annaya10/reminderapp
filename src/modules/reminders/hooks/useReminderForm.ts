import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import type { Position } from 'geojson';

import { useReminders } from '@src/context/RemindersContext';
import { ReminderFormSheetProps } from '@src/modules/reminders/components/ReminderFormSheet';
import { useReminderActions } from '@src/modules/reminders/hooks/useReminderActions';
import { Reminder, ReminderDraft } from '@src/modules/reminders/types';

interface FormState {
  visible: boolean;
  reminder: Reminder | null;
}

/**
 * State and handlers for the Add/Edit reminder sheet. Spread `sheetProps`
 * onto <ReminderFormSheet />.
 */
export const useReminderForm = (userCoordinate: Position | null = null) => {
  const { createReminder, updateReminder } = useReminders();
  const { confirmDelete } = useReminderActions();
  const [form, setForm] = useState<FormState>({
    visible: false,
    reminder: null,
  });

  const openAdd = useCallback(
    () => setForm({ visible: true, reminder: null }),
    [],
  );

  const openEdit = useCallback(
    (reminder: Reminder) => setForm({ visible: true, reminder }),
    [],
  );

  const close = useCallback(
    () => setForm(prev => ({ ...prev, visible: false })),
    [],
  );

  const handleSave = useCallback(
    async (draft: ReminderDraft) => {
      try {
        if (form.reminder) {
          await updateReminder(form.reminder.id, draft);
        } else {
          await createReminder(draft);
        }
        close();
        return true;
      } catch (error) {
        console.error('[Reminders] save failed', error);
        Alert.alert(
          'Could not save reminder',
          'Something went wrong. Please try again.',
        );
        return false;
      }
    },
    [form.reminder, createReminder, updateReminder, close],
  );

  const handleDeletePress = useCallback(
    (reminder: Reminder) => confirmDelete(reminder, close),
    [confirmDelete, close],
  );

  const sheetProps: ReminderFormSheetProps = {
    visible: form.visible,
    reminder: form.reminder,
    userCoordinate,
    onSave: handleSave,
    onDeletePress: handleDeletePress,
    onClose: close,
  };

  return { sheetProps, openAdd, openEdit };
};
