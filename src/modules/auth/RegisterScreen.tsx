import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@src/components/Button';
import { TextField } from '@src/components/TextField';
import { useAuth } from '@src/context/AuthContext';
import {
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
        placeholder="Your name"
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
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
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
        placeholder="At least 6 characters"
        value={password}
        onChangeText={value => {
          setPassword(value);
          clearError('password');
        }}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
      />
      <TextField
        label="Confirm password"
        icon="lock-closed-outline"
        placeholder="Repeat your password"
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
      <Button
        label="Create Account"
        loading={isSubmitting}
        onPress={handleSubmit}
      />
    </AuthLayout>
  );
};
