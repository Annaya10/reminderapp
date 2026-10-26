import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@src/components/Button';
import { Icon, IconName } from '@src/components/Icon';
import { ScreenHeader } from '@src/components/ScreenHeader';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { useReminders } from '@src/context/RemindersContext';
import { formatLongDate, formatTime } from '@src/helpers/date';
import { formatDistance } from '@src/helpers/geo';
import { useResponsive } from '@src/hooks/useResponsive';
import { ReminderFormSheet } from '@src/modules/reminders/components/ReminderFormSheet';
import { ReminderMapPreview } from '@src/modules/reminders/components/ReminderMapPreview';
import { ReminderStatusBadge } from '@src/modules/reminders/components/ReminderStatusBadge';
import { useReminderActions } from '@src/modules/reminders/hooks/useReminderActions';
import { useReminderForm } from '@src/modules/reminders/hooks/useReminderForm';
import { useShowOnMap } from '@src/modules/reminders/hooks/useShowOnMap';
import { MainStackNavigation, ReminderDetailsRoute } from '@src/routes/types';

export const ReminderDetailsScreen = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const { params } = useRoute<ReminderDetailsRoute>();
  const { bottom } = useSafeAreaInsets();
  const { contentMaxWidth } = useResponsive();
  const { reminders } = useReminders();
  const { confirmDelete, toggleCompleted } = useReminderActions();
  const { sheetProps, openEdit } = useReminderForm();
  const showOnMap = useShowOnMap();

  const reminder = reminders.find(item => item.id === params.reminderId);

  // Leave the screen once the reminder no longer exists (e.g. deleted).
  useEffect(() => {
    if (!reminder) {
      navigation.goBack();
    }
  }, [reminder, navigation]);

  if (!reminder) {
    return null;
  }

  const remindAt = new Date(reminder.remindAt);

  return (
    <View style={styles.main}>
      <ScreenHeader title="Reminder" onBackPress={navigation.goBack} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
          <View style={styles.card}>
            <ReminderStatusBadge reminder={reminder} />
            <Text size="title" weight="bold" style={styles.title}>
              {reminder.title}
            </Text>
            {!!reminder.description && (
              <Text color="subtext" style={styles.description}>
                {reminder.description}
              </Text>
            )}

            <View style={styles.rows}>
              <InfoRow
                icon="calendar-outline"
                label="Date"
                value={formatLongDate(remindAt)}
              />
              <InfoRow
                icon="time-outline"
                label="Time"
                value={formatTime(remindAt)}
              />
              <InfoRow
                icon="radio-button-on-outline"
                label="Area radius"
                value={formatDistance(reminder.radius)}
              />
            </View>
          </View>

          <Text weight="semiBold" size="subtitle" style={styles.sectionTitle}>
            Location
          </Text>
          <ReminderMapPreview reminder={reminder} />
          <Button
            label="View on Map"
            icon="map-outline"
            variant="secondary"
            style={styles.mapButton}
            onPress={() => showOnMap(reminder.id)}
          />

          <View style={styles.actions}>
            <Button
              label={
                reminder.isCompleted ? 'Mark as Pending' : 'Mark as Completed'
              }
              icon={reminder.isCompleted ? 'refresh' : 'checkmark-circle'}
              onPress={() => toggleCompleted(reminder)}
            />
            <View style={styles.secondaryActions}>
              <Button
                label="Edit"
                icon="create-outline"
                variant="secondary"
                style={styles.flex}
                onPress={() => openEdit(reminder)}
              />
              <Button
                label="Delete"
                icon="trash-outline"
                variant="danger"
                style={styles.flex}
                onPress={() => confirmDelete(reminder)}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <ReminderFormSheet {...sheetProps} />
    </View>
  );
};

interface InfoRowProps {
  icon: IconName;
  label: string;
  value: string;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <Icon name={icon} size={18} color="primary" />
    </View>
    <View style={styles.flex}>
      <Text size="caption" color="subtext">
        {label}
      </Text>
      <Text weight="semiBold">{value}</Text>
    </View>
  </View>
);

const ROW_ICON_SIZE = 36;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  inner: {
    width: '100%',
  },
  card: {
    alignItems: 'flex-start',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  title: {
    marginTop: Spacing.md,
  },
  description: {
    marginTop: Spacing.xs,
  },
  rows: {
    alignSelf: 'stretch',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    width: ROW_ICON_SIZE,
    height: ROW_ICON_SIZE,
    marginRight: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  sectionTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  mapButton: {
    marginTop: Spacing.md,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flex: {
    flex: 1,
  },
});
