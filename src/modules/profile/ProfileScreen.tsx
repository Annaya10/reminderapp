import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@src/components/Button';
import { ScreenHeader } from '@src/components/ScreenHeader';
import { SectionHeader } from '@src/components/SectionHeader';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { useAuth, useCurrentUser } from '@src/context/AuthContext';
import { useResponsive } from '@src/hooks/useResponsive';
import { ProfileOptionRow } from '@src/modules/profile/components/ProfileOptionRow';
import { ProfileSummaryCard } from '@src/modules/profile/components/ProfileSummaryCard';
import { MainStackNavigation } from '@src/routes/types';

const OPTIONS = [
  {
    icon: 'notifications-outline',
    title: 'Notifications',
    description: 'Alerts when you reach a reminder area',
  },
  {
    icon: 'cloud-outline',
    title: 'Backup & sync',
    description: 'Keep your reminders safe across devices',
  },
] as const;

export const ProfileScreen = () => {
  const navigation = useNavigation<MainStackNavigation>();
  const user = useCurrentUser();
  const { logout } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const { contentMaxWidth } = useResponsive();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
      <ScreenHeader
        title="Profile"
        subtitle="Your account and app settings"
        onBackPress={navigation.goBack}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
          <ProfileSummaryCard name={user.name} email={user.email} />

          <View style={styles.section}>
            <SectionHeader title="Settings" />
            <View style={styles.card}>
              {OPTIONS.map((option, index) => (
                <ProfileOptionRow
                  key={option.title}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  showDivider={index > 0}
                />
              ))}
            </View>
          </View>

          <Button
            label="Log Out"
            icon="log-out-outline"
            variant="danger"
            loading={isLoggingOut}
            style={styles.logout}
            onPress={handleLogout}
          />
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
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  inner: {
    width: '100%',
  },
  section: {
    marginTop: Spacing.xl,
  },
  card: {
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  logout: {
    marginTop: Spacing.xl,
  },
});
