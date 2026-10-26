import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useReminders } from '@src/context/RemindersContext';
import { Reminder } from '@src/modules/reminders/types';

const showError = (title: string) =>
  Alert.alert(title, 'Something went wrong. Please try again.');

/** Delete and completion actions with confirmation and error feedback. */
export const useReminderActions = () => {
  const { deleteReminder, setCompleted } = useReminders();

  const confirmDelete = useCallback(
    (reminder: Reminder, onDeleted?: () => void) =>
      Alert.alert('Delete reminder?', `"${reminder.title}" will be removed.`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReminder(reminder.id);
              onDeleted?.();
            } catch (error) {
              console.error('[Reminders] delete failed', error);
              showError('Could not delete reminder');
            }
          },
        },
      ]),
    [deleteReminder],
  );

  const toggleCompleted = useCallback(
    async (reminder: Reminder) => {
      try {
        await setCompleted(reminder.id, !reminder.isCompleted);
      } catch (error) {
        console.error('[Reminders] update failed', error);
        showError('Could not update reminder');
      }
    },
    [setCompleted],
  );

  return { confirmDelete, toggleCompleted };
};
