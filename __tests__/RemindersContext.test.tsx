import React from 'react';
import { Alert } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { RemindersProvider, useReminders } from '@src/context/RemindersContext';
import { useReminderActions } from '@src/modules/reminders/hooks/useReminderActions';
import { Reminder, ReminderDraft } from '@src/modules/reminders/types';
import * as repository from '@src/services/database/reminderRepository';

jest.mock('@src/services/database/reminderRepository');
const repo = jest.mocked(repository);

const saved: Reminder = {
  id: 'r1',
  title: 'Gym',
  description: '',
  coordinate: [-0.1, 51.5],
  radius: 250,
  remindAt: '2026-10-10T09:00:00.000Z',
  createdAt: '2026-10-01T09:00:00.000Z',
  isCompleted: false,
};

const draft: ReminderDraft = {
  title: 'Groceries',
  description: 'Milk',
  coordinate: [-0.12, 51.51],
  radius: 100,
  remindAt: '2026-10-09T18:00:00.000Z',
};

const renderProvider = async () => {
  let context!: ReturnType<typeof useReminders>;
  const Probe = () => {
    context = useReminders();
    return null;
  };
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(
      <RemindersProvider userId="user-1">
        <Probe />
      </RemindersProvider>,
    );
  });
  return () => context;
};

describe('RemindersContext', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    repo.listReminders.mockResolvedValue([saved]);
    repo.insertReminder.mockResolvedValue();
    repo.updateReminder.mockResolvedValue();
    repo.setReminderCompleted.mockResolvedValue();
    repo.deleteReminder.mockResolvedValue();
  });

  test('loads the user reminders from the database', async () => {
    const context = await renderProvider();
    expect(repo.listReminders).toHaveBeenCalledWith('user-1');
    expect(context().reminders).toEqual([saved]);
    expect(context().isLoading).toBe(false);
  });

  test('create, update, complete and delete are written to the database', async () => {
    const context = await renderProvider();

    await ReactTestRenderer.act(() => context().createReminder(draft));
    const created = repo.insertReminder.mock.calls[0][1];
    expect(repo.insertReminder).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ ...draft, isCompleted: false }),
    );
    // Sorted by date: the new reminder (9 Oct) comes before the saved one.
    expect(context().reminders.map(item => item.id)).toEqual([
      created.id,
      'r1',
    ]);

    await ReactTestRenderer.act(() =>
      context().updateReminder('r1', { ...draft, title: 'Gym (updated)' }),
    );
    expect(repo.updateReminder).toHaveBeenCalledWith('user-1', 'r1', {
      ...draft,
      title: 'Gym (updated)',
    });

    await ReactTestRenderer.act(() => context().setCompleted('r1', true));
    expect(repo.setReminderCompleted).toHaveBeenCalledWith(
      'user-1',
      'r1',
      true,
    );
    expect(
      context().reminders.find(item => item.id === 'r1')?.isCompleted,
    ).toBe(true);

    await ReactTestRenderer.act(() => context().deleteReminder('r1'));
    expect(repo.deleteReminder).toHaveBeenCalledWith('user-1', 'r1');
    expect(context().reminders.map(item => item.id)).toEqual([created.id]);
  });

  test('state is unchanged when the database write fails', async () => {
    const context = await renderProvider();
    repo.insertReminder.mockRejectedValue(new Error('disk full'));

    await ReactTestRenderer.act(async () => {
      await expect(context().createReminder(draft)).rejects.toThrow(
        'disk full',
      );
    });
    expect(context().reminders).toEqual([saved]);
  });

  test('delete action asks for confirmation before deleting', async () => {
    let actions!: ReturnType<typeof useReminderActions>;
    const Probe = () => {
      actions = useReminderActions();
      return null;
    };
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <RemindersProvider userId="user-1">
          <Probe />
        </RemindersProvider>,
      );
    });

    let pressDelete: (() => unknown) | undefined;
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((_title, _message, buttons) => {
        pressDelete = buttons?.find(b => b.style === 'destructive')?.onPress as
          | (() => unknown)
          | undefined;
      });
    const onDeleted = jest.fn();

    ReactTestRenderer.act(() => actions.confirmDelete(saved, onDeleted));
    expect(alertSpy).toHaveBeenCalled();
    expect(repo.deleteReminder).not.toHaveBeenCalled();

    await ReactTestRenderer.act(async () => {
      await pressDelete?.();
    });
    expect(repo.deleteReminder).toHaveBeenCalledWith('user-1', 'r1');
    expect(onDeleted).toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});
