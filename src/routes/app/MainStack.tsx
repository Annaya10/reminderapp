import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Screens } from '@src/constants/screens';
import { ProfileScreen } from '@src/modules/profile/ProfileScreen';
import { ReminderDetailsScreen } from '@src/modules/reminders/ReminderDetailsScreen';
import { BottomTabs } from '@src/routes/bottomNav/BottomTabs';
import { MainStackParamList } from '@src/routes/types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Screens.navigators.bottomTabs} component={BottomTabs} />
    <Stack.Screen
      name={Screens.reminderDetails}
      component={ReminderDetailsScreen}
    />
    <Stack.Screen name={Screens.profile} component={ProfileScreen} />
  </Stack.Navigator>
);
