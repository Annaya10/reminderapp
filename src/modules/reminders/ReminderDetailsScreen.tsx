import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@src/components/Button';
import { Icon, IconName } from '@src/components/Icon';
import { ProfileButton } from '@src/components/ProfileButton';
import { ScreenHeader } from '@src/components/ScreenHeader';
import { Text } from '@src/components/Text';
import { ColorName, Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Screens } from '@src/constants/screens';
import { Shadows } from '@src/constants/shadows';
import { useReminders } from '@src/context/RemindersContext';
import { formatShortDate, formatTime } from '@src/helpers/date';
import { formatCoordinate, formatDistance } from '@src/helpers/geo';
import { EXTERNAL_MAPS_NAME, openInMaps } from '@src/helpers/maps';
import { useResponsive } from '@src/hooks/useResponsive';
import { ReminderFormSheet } from '@src/modules/reminders/components/ReminderFormSheet';
import { ReminderMapPreview } from '@src/modules/reminders/components/ReminderMapPreview';
import { ReminderStatusBadge } from '@src/modules/reminders/components/ReminderStatusBadge';
import { getReminderStatus } from '@src/modules/reminders/helpers';
import { useDistanceTo } from '@src/modules/reminders/hooks/useDistanceTo';
import { useReminderActions } from '@src/modules/reminders/hooks/useReminderActions';
import { useReminderForm } from '@src/modules/reminders/hooks/useReminderForm';
import { useShowOnMap } from '@src/modules/reminders/hooks/useShowOnMap';
import { Reminder } from '@src/modules/reminders/types';
import { MainStackNavigation, ReminderDetailsRoute } from '@src/routes/types';

const STATUS_LINE = {
  pending: { label: 'Proximity alert set', color: 'primary' },
  overdue: { label: 'Reminder overdue', color: 'danger' },
  completed: { label: 'Reminder completed', color: 'success' },
} as const satisfies Record<string, { label: string; color: ColorName }>;

/** Average walking speed, used for the rough walking-time estimate. */
const WALKING_METERS_PER_MINUTE = 80;
const MAX_WALKING_ESTIMATE_METERS = 10000;

export const ReminderDetailsScreen = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const { params } = useRoute<ReminderDetailsRoute>();
  const { reminders } = useReminders();

  const reminder = reminders.find(item => item.id === params.reminderId);

  // Leave the screen once the reminder no longer exists (e.g. deleted).
  useEffect(() => {
    if (!reminder) {
      navigation.goBack();
    }
  }, [reminder, navigation]);

  return (
    <View style={styles.main}>
      <ScreenHeader
        title="Reminder Details"
        onBackPress={navigation.goBack}
        right={
          <ProfileButton
            onPress={() =>
              navigation.navigate(Screens.navigators.bottomTabs, {
                screen: Screens.profile,
              })
            }
          />
        }
      />
      {!!reminder && <ReminderDetails reminder={reminder} />}
    </View>
  );
};

const ReminderDetails = ({ reminder }: { reminder: Reminder }) => {
  const { bottom } = useSafeAreaInsets();
  const { contentMaxWidth } = useResponsive();
  const { confirmDelete, toggleCompleted } = useReminderActions();
  const { sheetProps, openEdit } = useReminderForm();
  const showOnMap = useShowOnMap();
  const distance = useDistanceTo(reminder.coordinate);

  const remindAt = new Date(reminder.remindAt);
  const statusLine = STATUS_LINE[getReminderStatus(reminder)];

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
          <View style={styles.statusRow}>
            <Icon name="navigate-outline" size={16} color={statusLine.color} />
            <Text
              size="subtitle"
              weight="medium"
              color={statusLine.color}
              style={styles.statusText}
            >
              {statusLine.label}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit reminder"
              hitSlop={Spacing.xs}
              onPress={() => openEdit(reminder)}
              style={({ pressed }) => [
                styles.editChip,
                pressed && styles.pressed,
              ]}
            >
              <Icon name="pencil" size={14} color="primaryDark" />
              <Text weight="semiBold" color="primaryDark">
                Edit
              </Text>
            </Pressable>
          </View>

          <ReminderMapPreview
            reminder={reminder}
            onExpandPress={() => showOnMap(reminder.id)}
          />

          <View style={styles.card}>
            <View style={styles.titleRow}>
              <Text size="large" weight="bold" style={styles.title}>
                {reminder.title}
              </Text>
              <ReminderStatusBadge reminder={reminder} />
            </View>
            {!!reminder.description && (
              <Text size="subtitle" color="subtext" style={styles.description}>
                {reminder.description}
              </Text>
            )}
          </View>

          <View style={styles.tiles}>
            <InfoTile
              icon="time-outline"
              label="Due time"
              value={formatTime(remindAt)}
              detail={formatShortDate(remindAt)}
            />
            <InfoTile
              icon="radio-button-on-outline"
              label="Geofence"
              value={formatDistance(reminder.radius)}
              detail="When entering"
            />
            <InfoTile
              icon="walk-outline"
              label="Distance"
              value={distance === null ? '—' : formatDistance(distance)}
              detail={
                distance === null
                  ? 'Location unknown'
                  : distance <= MAX_WALKING_ESTIMATE_METERS
                  ? `~${Math.max(
                      1,
                      Math.round(distance / WALKING_METERS_PER_MINUTE),
                    )} min walk`
                  : 'Straight line'
              }
            />
          </View>

          <View style={styles.card}>
            <View style={styles.placeRow}>
              <View style={styles.placeIcon}>
                <Icon name="storefront-outline" size={20} color="primaryDark" />
              </View>
              <View style={styles.placeTexts}>
                <Text size="subtitle" weight="bold">
                  Reminder location
                </Text>
                <Text color="subtext">
                  {formatCoordinate(reminder.coordinate)}
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="link"
              onPress={() => openInMaps(reminder.coordinate, reminder.title)}
              style={({ pressed }) => [
                styles.mapsButton,
                pressed && styles.pressed,
              ]}
            >
              <Icon name="map-outline" size={18} color="primaryDark" />
              <Text
                size="subtitle"
                color="primaryDark"
                style={styles.mapsLabel}
              >
                Open in {EXTERNAL_MAPS_NAME}
              </Text>
              <Icon name="open-outline" size={16} color="subtext" />
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Button
              label={
                reminder.isCompleted ? 'Mark as Pending' : 'Mark as Completed'
              }
              icon={
                reminder.isCompleted
                  ? 'arrow-undo-outline'
                  : 'checkmark-circle-outline'
              }
              onPress={() => toggleCompleted(reminder)}
            />
            <View style={styles.secondaryActions}>
              <Button
                label="Edit Reminder"
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
    </>
  );
};

interface InfoTileProps {
  icon: IconName;
  label: string;
  value: string;
  detail: string;
}

const InfoTile = ({ icon, label, value, detail }: InfoTileProps) => (
  <View style={styles.tile}>
    <View style={styles.tileIcon}>
      <Icon name={icon} size={18} color="primaryDark" />
    </View>
    <Text
      size="caption"
      weight="medium"
      color="subtext"
      style={styles.tileLabel}
    >
      {label}
    </Text>
    <Text size="title" weight="bold" numberOfLines={1} adjustsFontSizeToFit>
      {value}
    </Text>
    <Text size="caption" color="subtext" numberOfLines={1}>
      {detail}
    </Text>
  </View>
);

const TILE_ICON_SIZE = 32;
const PLACE_ICON_SIZE = 44;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  inner: {
    width: '100%',
    gap: Spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusText: {
    flex: 1,
  },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryMuted,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
  },
  description: {
    marginTop: Spacing.xs,
    lineHeight: 22,
  },
  tiles: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tile: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  tileIcon: {
    width: TILE_ICON_SIZE,
    height: TILE_ICON_SIZE,
    marginBottom: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
  },
  tileLabel: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  placeIcon: {
    width: PLACE_ICON_SIZE,
    height: PLACE_ICON_SIZE,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
  },
  placeTexts: {
    flex: 1,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySoft,
  },
  mapsLabel: {
    flex: 1,
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
