import React from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';

import { Colors } from '@src/constants/colors';
import { useAuth } from '@src/context/AuthContext';
import { RemindersProvider } from '@src/context/RemindersContext';
import { SplashScreen } from '@src/modules/boot/SplashScreen';
import { MainStack } from '@src/routes/app/MainStack';
import { AuthStack } from '@src/routes/auth/AuthStack';

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.screenBg,
    card: Colors.cardBg,
    text: Colors.text,
    border: Colors.border,
  },
};

/**
 * Logged-out users only ever get the auth stack; the main app (and the
 * reminders data) is mounted only while a user is signed in.
 */
export const AppRoutes = () => {
  const { user, isRestoring, startupError } = useAuth();

  if (isRestoring || startupError) {
    return <SplashScreen error={startupError} />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? (
        <RemindersProvider key={user.id} userId={user.id}>
          <MainStack />
        </RemindersProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
