import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { Icon } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';

interface SplashScreenProps {
  error?: string | null;
}

const PROGRESS_TRACK_WIDTH = 150;

/** Shown while the database opens and the saved session is restored. */
export const SplashScreen = ({ error }: SplashScreenProps) => {
  const progress = useRef(new Animated.Value(0)).current;

  // Indeterminate: a short bar sweeps across the track until loading ends.
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-PROGRESS_TRACK_WIDTH * 0.4, PROGRESS_TRACK_WIDTH],
  });

  return (
    <View style={styles.main}>
      <View style={styles.center}>
        <View style={styles.outerRing}>
          <View style={styles.innerRing}>
            <View style={styles.badge}>
              <Icon name="location" size={40} color="white" />
            </View>
          </View>
        </View>

        <Text weight="bold" style={styles.appName} alignCenter>
          ReminderApp
        </Text>
        <Text size="subtitle" color="subtext" alignCenter>
          Smart Location-Based Alerts
        </Text>

        {error ? (
          <View style={styles.errorBox} accessibilityRole="alert">
            <Icon name="alert-circle-outline" size={18} color="danger" />
            <Text color="danger" style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statusPill}>
              <Icon name="locate-outline" size={16} color="primary" />
              <Text weight="semiBold">Preparing your reminders…</Text>
            </View>
            <View
              style={styles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityLabel="Loading"
            >
              <Animated.View
                style={[styles.progressBar, { transform: [{ translateX }] }]}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Icon name="shield-checkmark-outline" size={14} color="subtext" />
        <Text
          size="caption"
          weight="semiBold"
          color="subtext"
          style={styles.footerText}
        >
          YOUR DATA STAYS ON THIS DEVICE
        </Text>
      </View>
    </View>
  );
};

const BADGE_SIZE = 88;
const INNER_RING_SIZE = BADGE_SIZE + 36;
const OUTER_RING_SIZE = BADGE_SIZE + 80;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.screenBg,
  },
  center: {
    alignItems: 'center',
    width: '100%',
  },
  outerRing: {
    width: OUTER_RING_SIZE,
    height: OUTER_RING_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  innerRing: {
    width: INNER_RING_SIZE,
    height: INNER_RING_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    ...Shadows.primary,
  },
  appName: {
    fontSize: 34,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  progressTrack: {
    width: PROGRESS_TRACK_WIDTH,
    height: 4,
    marginTop: Spacing.xl,
    borderRadius: Radius.full,
    overflow: 'hidden',
    backgroundColor: Colors.primaryMuted,
  },
  progressBar: {
    width: PROGRESS_TRACK_WIDTH * 0.4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.dangerBg,
  },
  errorText: {
    flexShrink: 1,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxl + Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    letterSpacing: 0.6,
  },
});
