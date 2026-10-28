import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { Shadows } from '@src/constants/shadows';
import { useResponsive } from '@src/hooks/useResponsive';
import { BrandMark } from '@src/modules/auth/components/BrandMark';

interface AuthLayoutProps {
  /** Short name shown in the top bar, e.g. "Login". */
  screenTitle: string;
  title: string;
  subtitle: string;
  /**
   * "centered": brand mark and centered heading, form on a white card.
   * "plain": left-aligned heading with an optional eyebrow chip.
   */
  variant?: 'centered' | 'plain';
  eyebrow?: string;
  /** Form-level error, e.g. wrong credentials. */
  error?: string | null;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthLayout = (props: AuthLayoutProps) => {
  const {
    screenTitle,
    title,
    subtitle,
    variant = 'centered',
    eyebrow,
    error,
    children,
    footer,
  } = props;
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const { contentMaxWidth } = useResponsive();
  const isCentered = variant === 'centered';

  return (
    <KeyboardAvoidingView
      style={styles.main}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: top + Spacing.sm, paddingBottom: bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
          <View style={styles.topBar}>
            {navigation.canGoBack() && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={Spacing.sm}
                onPress={navigation.goBack}
                style={styles.back}
              >
                <Icon name="chevron-back" size={26} color="text" />
              </Pressable>
            )}
            <Icon name="location" size={22} color="primary" />
            <Text
              size="title"
              weight="bold"
              style={styles.topBarTitle}
              accessibilityRole="header"
            >
              {screenTitle}
            </Text>
          </View>

          {isCentered ? (
            <View style={styles.centeredIntro}>
              <BrandMark />
              <Text
                size="heading"
                weight="bold"
                alignCenter
                style={styles.title}
              >
                {title}
              </Text>
              <Text
                color="subtext"
                size="subtitle"
                alignCenter
                style={styles.subtitle}
              >
                {subtitle}
              </Text>
            </View>
          ) : (
            <View style={styles.plainIntro}>
              {!!eyebrow && (
                <View style={styles.eyebrow}>
                  <Icon name="navigate-outline" size={12} color="primaryDark" />
                  <Text size="caption" weight="semiBold" color="primaryDark">
                    {eyebrow}
                  </Text>
                </View>
              )}
              <Text weight="bold" style={styles.plainTitle}>
                {title}
              </Text>
              <Text color="subtext" size="subtitle" style={styles.subtitle}>
                {subtitle}
              </Text>
            </View>
          )}

          <View style={[styles.form, isCentered && styles.formCard]}>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    marginBottom: Spacing.md,
  },
  back: {
    marginRight: Spacing.md,
  },
  topBarTitle: {
    marginLeft: Spacing.sm,
  },
  centeredIntro: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    marginTop: Spacing.lg,
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
  plainIntro: {
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryMuted,
  },
  plainTitle: {
    fontSize: 30,
  },
  form: {
    gap: Spacing.lg,
  },
  formCard: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
});
