import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Screens } from '@src/constants/screens';
import { LoginScreen } from '@src/modules/auth/LoginScreen';
import { RegisterScreen } from '@src/modules/auth/RegisterScreen';
import { AuthStackParamList } from '@src/routes/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Screens.login} component={LoginScreen} />
    <Stack.Screen name={Screens.register} component={RegisterScreen} />
  </Stack.Navigator>
);
