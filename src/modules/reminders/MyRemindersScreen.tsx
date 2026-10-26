import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { Avatar } from '@src/components/Avatar';
import { EmptyState } from '@src/components/EmptyState';
import { ScreenHeader } from '@src/components/ScreenHeader';
import { SegmentedControl } from '@src/components/SegmentedControl';
import { Button } from '@src/components/Button';
import { Colors } from '@src/constants/colors';
import { Spacing } from '@src/constants/layout';
import { Screens } from '@src/constants/screens';
import { useCurrentUser } from '@src/context/AuthContext';
import { useReminders } from '@src/context/RemindersContext';
import { useResponsive } from '@src/hooks/useResponsive';
import { ReminderCard } from '@src/modules/reminders/components/ReminderCard';
import { ReminderFormSheet } from '@src/modules/reminders/components/ReminderFormSheet';
import { matchesFilter } from '@src/modules/reminders/helpers';
import { useReminderActions } from '@src/modules/reminders/hooks/useReminderActions';
import { useReminderForm } from '@src/modules/reminders/hooks/useReminderForm';
import { useShowOnMap } from '@src/modules/reminders/hooks/useShowOnMap';
import { ReminderFilter } from '@src/modules/reminders/types';
import { TabNavigation } from '@src/routes/types';

const EMPTY_COPY: Record<
  ReminderFilter,
  { title: string; description: string }
> = {
  today: {
    title: 'Nothing due today',
    description: 'Reminders scheduled for today will show up here.',
  },
  upcoming: {
    title: 'No upcoming reminders',
    description: 'Reminders scheduled for later dates will show up here.',
  },
};

export const MyRemindersScreen = () => {
  const navigation = useNavigation<TabNavigation>();
  const user = useCurrentUser();
  const tabBarHeight = useBottomTabBarHeight();
  const { contentMaxWidth } = useResponsive();
  const { reminders, isLoading } = useReminders();
  const { confirmDelete, toggleCompleted } = useReminderActions();
  const { sheetProps, openEdit } = useReminderForm();
  const showOnMap = useShowOnMap();
  const [filter, setFilter] = useState<ReminderFilter>('today');

  const { today, upcoming } = useMemo(() => {
    const now = new Date();
    return {
      today: reminders.filter(item => matchesFilter(item, 'today', now)),
      upcoming: reminders.filter(item => matchesFilter(item, 'upcoming', now)),
    };
  }, [reminders]);

  const visible = filter === 'today' ? today : upcoming;

  return (
    <View style={styles.main}>
      <ScreenHeader
        title="My Reminders"
        subtitle={`${reminders.length} saved reminder${
          reminders.length === 1 ? '' : 's'
        }`}
        right={
          <Avatar
            name={user.name}
            size={44}
            onPress={() => navigation.navigate(Screens.profile)}
          />
        }
      >
        <View style={styles.segments}>
          <SegmentedControl
            value={filter}
            onChange={setFilter}
            segments={[
              { value: 'today', label: 'Today', count: today.length },
              { value: 'upcoming', label: 'Upcoming', count: upcoming.length },
            ]}
          />
        </View>
      </ScreenHeader>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          style={styles.listView}
          ItemSeparatorComponent={Separator}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.item, { maxWidth: contentMaxWidth }]}>
              <ReminderCard
                reminder={item}
                onPress={() =>
                  navigation.navigate(Screens.reminderDetails, {
                    reminderId: item.id,
                  })
                }
                onToggleCompleted={() => toggleCompleted(item)}
                onViewOnMap={() => showOnMap(item.id)}
                onEdit={() => openEdit(item)}
                onDelete={() => confirmDelete(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={[styles.item, { maxWidth: contentMaxWidth }]}>
              <EmptyState
                icon={filter === 'today' ? 'sunny-outline' : 'calendar-outline'}
                title={EMPTY_COPY[filter].title}
                description={EMPTY_COPY[filter].description}
              />
              <Button
                label="Add Reminder"
                icon="add"
                variant="secondary"
                style={styles.emptyAction}
                onPress={() =>
                  navigation.navigate(Screens.home, {
                    addRequestId: Date.now(),
                  })
                }
              />
            </View>
          }
        />
      )}

      <ReminderFormSheet {...sheetProps} />
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  segments: {
    marginTop: Spacing.lg,
  },
  loader: {
    marginTop: Spacing.xxl,
  },
  listView: {
    flex: 1,
  },
  list: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  // Rows stretch to the list width; the card itself is centered and capped
  // on tablets. (Centering the rows instead collapses each card.)
  item: {
    width: '100%',
    alignSelf: 'center',
  },
  separator: {
    height: Spacing.md,
  },
  emptyAction: {
    marginTop: Spacing.lg,
  },
});
