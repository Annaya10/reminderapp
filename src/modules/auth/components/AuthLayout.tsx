import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { useResponsive } from '@src/hooks/useResponsive';
import { BrandMark } from '@src/modules/auth/components/BrandMark';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  /** Form-level error, e.g. wrong credentials. */
  error?: string | null;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthLayout = (props: AuthLayoutProps) => {
  const { title, subtitle, error, children, footer } = props;
  const { top, bottom } = useSafeAreaInsets();
  const { contentMaxWidth } = useResponsive();

  return (
    <KeyboardAvoidingView
      style={styles.main}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: top + Spacing.xxl,
            paddingBottom: bottom + Spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
          <BrandMark />
          <Text size="heading" weight="bold" style={styles.title}>
            {title}
          </Text>
          <Text color="subtext" style={styles.subtitle}>
            {subtitle}
          </Text>

          <View style={styles.card}>
            {!!error && (
              <View style={styles.errorBanner} accessibilityRole="alert">
                <Icon name="alert-circle-outline" size={18} color="danger" />
                <Text color="danger" style={styles.errorText}>
                  {error}
                </Text>
              </View>
            )}
            {children}
          </View>

          <View style={styles.demoNotice}>
            <Icon name="information-circle-outline" size={16} color="subtext" />
            <Text size="caption" color="subtext" style={styles.demoText}>
              Demo mode: accounts are stored only on this device and are not
              protected by a server.
            </Text>
          </View>

          <View style={styles.footer}>{footer}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.screenBg,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  inner: {
    width: '100%',
  },
  title: {
    marginTop: Spacing.xl,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
  card: {
    gap: Spacing.lg,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    ...Shadows.card,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.dangerBg,
  },
  errorText: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  demoText: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
});
