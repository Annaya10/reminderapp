import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@src/components/Button';
import { Icon } from '@src/components/Icon';
import { Text } from '@src/components/Text';
import { TextField } from '@src/components/TextField';
import { Colors } from '@src/constants/colors';
import { Radius, Spacing } from '@src/constants/layout';
import { useAuth } from '@src/context/AuthContext';
import {
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirmation,
} from '@src/helpers/validators';
import { AuthFooterLink } from '@src/modules/auth/components/AuthFooterLink';
import { AuthLayout } from '@src/modules/auth/components/AuthLayout';
import { useAuthSubmit } from '@src/modules/auth/hooks/useAuthSubmit';
import { AuthNavigation } from '@src/routes/types';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegisterScreen = () => {
  const navigation = useNavigation<AuthNavigation>();
  const { register } = useAuth();
  const { isSubmitting, formError, submit } = useAuthSubmit();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearError = (field: keyof FieldErrors) =>
    setErrors(prev => ({ ...prev, [field]: undefined }));

  const handleSubmit = () => {
    const nextErrors: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validatePasswordConfirmation(password, confirmPassword),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }
    submit(() => register({ name, email, password }));
  };

  return (
    <AuthLayout
      screenTitle="Register"
      variant="plain"
      eyebrow="Geo-Smart Task Assistant"
      title="Create account"
      subtitle="Save reminders for the places that matter."
      error={formError}
      footer={
        <AuthFooterLink
          prompt="Already have an account?"
          actionLabel="Log in"
          onPress={() => navigation.goBack()}
        />
      }
    >
      <TextField
        label="Full name"
        icon="person-outline"
        placeholder="Alex Morgan"
        value={name}
        onChangeText={value => {
          setName(value);
          clearError('name');
        }}
        error={errors.name}
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
      />
      <TextField
        label="Email address"
        icon="mail-outline"
        placeholder="alex@example.com"
        value={email}
        onChangeText={value => {
          setEmail(value);
          clearError('email');
        }}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <TextField
        label="Password"
        icon="lock-closed-outline"
        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
        value={password}
        onChangeText={value => {
          setPassword(value);
          clearError('password');
        }}
        error={errors.password}
        hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
      />
      <TextField
        label="Confirm password"
        icon="refresh-outline"
        placeholder="Repeat password"
        value={confirmPassword}
        onChangeText={value => {
          setConfirmPassword(value);
          clearError('confirmPassword');
        }}
        error={errors.confirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <View style={styles.notice}>
        <View style={styles.noticeIcon}>
          <Icon name="location" size={18} color="primaryDark" />
        </View>
        <View style={styles.noticeTexts}>
          <Text weight="bold">Spatial Trigger Notice</Text>
          <Text size="caption" color="subtext" style={styles.noticeBody}>
            Allow location access, including in the background, so you get an
            alert when you arrive at a reminder's place on its due date.
          </Text>
        </View>
      </View>

      <Button
        label="Create Account"
        trailingIcon="arrow-forward"
        loading={isSubmitting}
        onPress={handleSubmit}
      />
    </AuthLayout>
  );
};

const NOTICE_ICON_SIZE = 40;

const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primarySoft,
  },
  noticeIcon: {
    width: NOTICE_ICON_SIZE,
    height: NOTICE_ICON_SIZE,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
  },
  noticeTexts: {
    flex: 1,
  },
  noticeBody: {
    marginTop: 2,
    lineHeight: 18,
  },
});
