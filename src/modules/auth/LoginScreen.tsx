import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@src/components/Button';
import { TextField } from '@src/components/TextField';
import { Screens } from '@src/constants/screens';
import { useAuth } from '@src/context/AuthContext';
import { validateEmail } from '@src/helpers/validators';
import { AuthFooterLink } from '@src/modules/auth/components/AuthFooterLink';
import { AuthLayout } from '@src/modules/auth/components/AuthLayout';
import { useAuthSubmit } from '@src/modules/auth/hooks/useAuthSubmit';
import { AuthNavigation } from '@src/routes/types';

interface FieldErrors {
  email?: string;
  password?: string;
}

export const LoginScreen = () => {
  const navigation = useNavigation<AuthNavigation>();
  const { login } = useAuth();
  const { isSubmitting, formError, submit } = useAuthSubmit();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = () => {
    const nextErrors: FieldErrors = {
      email: validateEmail(email),
      password: password ? undefined : 'Please enter your password.',
    };
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      return;
    }
    submit(() => login({ email, password }));
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your location reminders."
      error={formError}
      footer={
        <AuthFooterLink
          prompt="Don't have an account?"
          actionLabel="Create one"
          onPress={() => navigation.navigate(Screens.register)}
        />
      }
    >
      <TextField
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        value={email}
        onChangeText={value => {
          setEmail(value);
          setErrors(prev => ({ ...prev, email: undefined }));
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
        placeholder="Your password"
        value={password}
        onChangeText={value => {
          setPassword(value);
          setErrors(prev => ({ ...prev, password: undefined }));
        }}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <Button label="Log In" loading={isSubmitting} onPress={handleSubmit} />
    </AuthLayout>
  );
};
