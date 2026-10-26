import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createId } from '@src/helpers/id';
import { sortByRemindAt } from '@src/modules/reminders/helpers';
import { Reminder, ReminderDraft } from '@src/modules/reminders/types';
import * as reminderRepository from '@src/services/database/reminderRepository';

interface RemindersContextValue {
  reminders: Reminder[];
  isLoading: boolean;
  createReminder: (draft: ReminderDraft) => Promise<void>;
  updateReminder: (id: string, draft: ReminderDraft) => Promise<void>;
  setCompleted: (id: string, isCompleted: boolean) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
}

const RemindersContext = createContext<RemindersContextValue | null>(null);

interface RemindersProviderProps {
  userId: string;
  children: ReactNode;
}

/**
 * Reminders of the signed-in user. SQLite is the source of truth: every
 * change is written to the database first, then mirrored into state.
 */
export const RemindersProvider = ({
  userId,
  children,
}: RemindersProviderProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    reminderRepository
      .listReminders(userId)
      .then(items => isMounted && setReminders(items))
      .catch(error => console.error('[Reminders] load failed', error))
      .finally(() => isMounted && setIsLoading(false));
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const createReminder = useCallback(
    async (draft: ReminderDraft) => {
      const reminder: Reminder = {
        ...draft,
        id: createId(),
        createdAt: new Date().toISOString(),
        isCompleted: false,
      };
      await reminderRepository.insertReminder(userId, reminder);
      setReminders(prev => sortByRemindAt([...prev, reminder]));
    },
    [userId],
  );

  const updateReminder = useCallback(
    async (id: string, draft: ReminderDraft) => {
      await reminderRepository.updateReminder(userId, id, draft);
      setReminders(prev =>
        sortByRemindAt(
          prev.map(item => (item.id === id ? { ...item, ...draft } : item)),
        ),
      );
    },
    [userId],
  );

  const setCompleted = useCallback(
    async (id: string, isCompleted: boolean) => {
      await reminderRepository.setReminderCompleted(userId, id, isCompleted);
      setReminders(prev =>
        prev.map(item => (item.id === id ? { ...item, isCompleted } : item)),
      );
    },
    [userId],
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      await reminderRepository.deleteReminder(userId, id);
      setReminders(prev => prev.filter(item => item.id !== id));
    },
    [userId],
  );

  const value = useMemo(
    () => ({
      reminders,
      isLoading,
      createReminder,
      updateReminder,
      setCompleted,
      deleteReminder,
    }),
    [
      reminders,
      isLoading,
      createReminder,
      updateReminder,
      setCompleted,
      deleteReminder,
    ],
  );

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};

export const useReminders = (): RemindersContextValue => {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used inside RemindersProvider.');
  }
  return context;
};
