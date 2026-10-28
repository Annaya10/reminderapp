import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@src/components/Button';
import { EmptyState } from '@src/components/EmptyState';
import { Icon } from '@src/components/Icon';
import { ProfileButton } from '@src/components/ProfileButton';
import { ScreenHeader } from '@src/components/ScreenHeader';
import { SegmentedControl } from '@src/components/SegmentedControl';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { FontSizes, Fonts } from '@src/constants/fonts';
import { Radius, Spacing } from '@src/constants/layout';
import { Screens } from '@src/constants/screens';
import { useReminders } from '@src/context/RemindersContext';
import { useResponsive } from '@src/hooks/useResponsive';
import { ReminderCard } from '@src/modules/reminders/components/ReminderCard';
import { ReminderFormSheet } from '@src/modules/reminders/components/ReminderFormSheet';
import { matchesFilter } from '@src/modules/reminders/helpers';
import { useReminderActions } from '@src/modules/reminders/hooks/useReminderActions';
import { useReminderForm } from '@src/modules/reminders/hooks/useReminderForm';
import { useShowOnMap } from '@src/modules/reminders/hooks/useShowOnMap';
import { Reminder, ReminderFilter } from '@src/modules/reminders/types';
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

const matchesSearch = (reminder: Reminder, query: string) =>
  reminder.title.toLowerCase().includes(query) ||
  reminder.description.toLowerCase().includes(query);

export const MyRemindersScreen = () => {
  const navigation = useNavigation<TabNavigation>();
  const tabBarHeight = useBottomTabBarHeight();
  const { contentMaxWidth } = useResponsive();
  const { reminders, isLoading } = useReminders();
  const { confirmDelete, toggleCompleted } = useReminderActions();
  const { sheetProps, openEdit } = useReminderForm();
  const showOnMap = useShowOnMap();
  const [filter, setFilter] = useState<ReminderFilter>('today');
  const [searchQuery, setSearchQuery] = useState('');

  const query = searchQuery.trim().toLowerCase();

  const { today, upcoming } = useMemo(() => {
    const now = new Date();
    const searched = query
      ? reminders.filter(item => matchesSearch(item, query))
      : reminders;
    return {
      today: searched.filter(item => matchesFilter(item, 'today', now)),
      upcoming: searched.filter(item => matchesFilter(item, 'upcoming', now)),
    };
  }, [reminders, query]);

  const visible = filter === 'today' ? today : upcoming;
  const openCount = reminders.filter(item => !item.isCompleted).length;

  const header = (
    <View style={[styles.item, { maxWidth: contentMaxWidth }]}>
      <View style={styles.headingRow}>
        <Text size="heading" weight="bold" style={styles.heading}>
          My Reminders
        </Text>
        <View style={styles.savedChip}>
          <Text size="caption" weight="semiBold" color="primaryDark">
            {reminders.length} saved
          </Text>
        </View>
      </View>
      <Text size="subtitle" color="subtext" style={styles.subheading}>
        Geo-triggered tasks curated for your day
      </Text>

      <View style={styles.search}>
        <Icon name="search" size={20} color="subtext" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search reminders"
          placeholderTextColor={Colors.placeholder}
          selectionColor={Colors.primary}
          accessibilityLabel="Search reminders"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={styles.searchInput}
        />
      </View>

      <SegmentedControl
        value={filter}
        onChange={setFilter}
        segments={[
          { value: 'today', label: 'Today', count: today.length },
          { value: 'upcoming', label: 'Upcoming', count: upcoming.length },
        ]}
      />
    </View>
  );

  const empty = isLoading ? (
    <ActivityIndicator color={Colors.primary} style={styles.loader} />
  ) : (
    <View style={[styles.item, { maxWidth: contentMaxWidth }]}>
      {query ? (
        <EmptyState
          icon="search-outline"
          title="No matching reminders"
          description={`Nothing ${
            filter === 'today' ? 'today' : 'upcoming'
          } matches "${searchQuery.trim()}".`}
        />
      ) : (
        <>
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
              navigation.navigate(Screens.home, { addRequestId: Date.now() })
            }
          />
        </>
      )}
    </View>
  );

  const footer =
    openCount > 0 ? (
      <View style={[styles.item, { maxWidth: contentMaxWidth }]}>
        <View style={styles.geofences}>
          <View style={styles.geofencesIcon}>
            <Icon name="compass-outline" size={22} color="white" />
          </View>
          <View style={styles.geofencesTexts}>
            <Text weight="bold">Active Geofences</Text>
            <Text size="caption" color="subtext">
              {openCount} open reminder{openCount === 1 ? '' : 's'} with a
              location area
            </Text>
          </View>
          <View style={styles.mapPill}>
            <View style={styles.mapPillDot} />
            <Text size="caption" weight="semiBold" color="success">
              On map
            </Text>
          </View>
        </View>
      </View>
    ) : undefined;

  return (
    <View style={styles.main}>
      <ScreenHeader
        title="My Reminders"
        right={
          <ProfileButton onPress={() => navigation.navigate(Screens.profile)} />
        }
      />

      <FlatList
        data={isLoading ? [] : visible}
        keyExtractor={item => item.id}
        style={styles.listView}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        ListHeaderComponentStyle={styles.listHeader}
        ListEmptyComponent={empty}
        ListFooterComponent={footer}
        ListFooterComponentStyle={styles.listFooter}
        ItemSeparatorComponent={Separator}
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
      />

      <ReminderFormSheet {...sheetProps} />
    </View>
  );
};

const Separator = () => <View style={styles.separator} />;

const GEOFENCES_ICON_SIZE = 44;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  listView: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.lg,
  },
  listHeader: {
    marginBottom: Spacing.lg,
  },
  listFooter: {
    marginTop: Spacing.xl,
  },
  // Rows stretch to the list width; the card itself is centered and capped
  // on tablets. (Centering the rows instead collapses each card.)
  item: {
    width: '100%',
    alignSelf: 'center',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  heading: {
    flexShrink: 1,
  },
  savedChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryMuted,
  },
  subheading: {
    marginTop: Spacing.xs,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 50,
    marginVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySoft,
  },
  searchInput: {
    ...Fonts.regular,
    flex: 1,
    paddingVertical: Spacing.md,
    color: Colors.text,
    fontSize: FontSizes.subtitle,
  },
  loader: {
    marginTop: Spacing.xxl,
  },
  separator: {
    height: Spacing.lg,
  },
  emptyAction: {
    marginTop: Spacing.lg,
  },
  geofences: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primaryMuted,
  },
  geofencesIcon: {
    width: GEOFENCES_ICON_SIZE,
    height: GEOFENCES_ICON_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
  },
  geofencesTexts: {
    flex: 1,
  },
  mapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardBg,
  },
  mapPillDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
  },
});
