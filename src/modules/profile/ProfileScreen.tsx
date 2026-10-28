import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { Button } from '@src/components/Button';
import { ScreenHeader } from '@src/components/ScreenHeader';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { useAuth, useCurrentUser } from '@src/context/AuthContext';
import { useReminders } from '@src/context/RemindersContext';
import { useResponsive } from '@src/hooks/useResponsive';
import { ProfileOptionRow } from '@src/modules/profile/components/ProfileOptionRow';
import { ProfileSummaryCard } from '@src/modules/profile/components/ProfileSummaryCard';
import { useAlertSetup } from '@src/modules/reminders/hooks/useAlertSetupPrompt';

export const ProfileScreen = () => {
  const user = useCurrentUser();
  const { logout } = useAuth();
  const { reminders } = useReminders();
  const tabBarHeight = useBottomTabBarHeight();
  const { contentMaxWidth } = useResponsive();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const alerts = useAlertSetup();

  const completedCount = reminders.filter(item => item.isCompleted).length;

  const handleLogout = () =>
    Alert.alert(
      'Log out?',
      'You can log back in with your email and password.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              console.error('[Auth] logout failed', error);
              setIsLoggingOut(false);
              Alert.alert('Could not log out', 'Please try again.');
            }
          },
        },
      ],
    );

  return (
    <View style={styles.main}>
      <ScreenHeader title="Profile" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
          <View>
            <Text size="heading" weight="bold">
              Profile
            </Text>
            <Text color="subtext" style={styles.subheading}>
              Your account and app settings
            </Text>
          </View>

          <ProfileSummaryCard
            name={user.name}
            email={user.email}
            totalCount={reminders.length}
            completedCount={completedCount}
            activeCount={reminders.length - completedCount}
          />

          <View>
            <Text size="large" weight="semiBold" style={styles.sectionTitle}>
              App Preferences
            </Text>
            <View style={styles.card}>
              <ProfileOptionRow
                icon="notifications-outline"
                title="Arrival Alerts"
                description={
                  alerts.isEnabled
                    ? 'Sound alert when you reach a reminder on its due date'
                    : 'Needs notifications and location set to "Always"'
                }
                value={
                  !alerts.status
                    ? undefined
                    : alerts.isEnabled
                    ? 'On'
                    : 'Turn on'
                }
                onPress={
                  !alerts.status
                    ? undefined
                    : alerts.isEnabled
                    ? alerts.openSettings
                    : alerts.setUp
                }
              />
              <ProfileOptionRow
                icon="locate-outline"
                title="Location Access"
                description="Lets the map show where you are"
                value="Settings"
                onPress={() => Linking.openSettings()}
                showDivider
              />
              <ProfileOptionRow
                icon="sync-outline"
                iconColor="success"
                iconBackground="successBg"
                title="Backup & Sync"
                description="Reminders are stored on this device"
                showDivider
              />
              <ProfileOptionRow
                icon="color-palette-outline"
                iconColor="primaryDark"
                iconBackground="primarySoft"
                title="Appearance"
                description="Light theme"
                value="Light"
                showDivider
              />
            </View>
          </View>

          <Button
            label="Log Out"
            icon="log-out-outline"
            variant="danger"
            loading={isLoggingOut}
            onPress={handleLogout}
          />

          <View>
            <Text size="caption" weight="medium" color="subtext" alignCenter>
              ReminderApp
            </Text>
            <Text size="caption" color="placeholder" alignCenter>
              Made with precision for mobile wanderers
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
    gap: Spacing.xl,
  },
  subheading: {
    marginTop: 2,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    marginLeft: Spacing.xs,
  },
  card: {
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
});
