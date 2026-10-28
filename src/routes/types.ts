import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screens } from '@src/constants/screens';

export type AuthStackParamList = {
  [Screens.login]: undefined;
  [Screens.register]: undefined;
};

export type HomeParams = {
  /** Changes each time the Add Reminder form is requested. */
  addRequestId?: number;
  /** Reminder to show on the map; `focusRequestId` changes per request. */
  focusReminderId?: string;
  focusRequestId?: number;
};

export type BottomTabParamList = {
  [Screens.home]: HomeParams | undefined;
  [Screens.addReminder]: undefined;
  [Screens.myReminders]: undefined;
  [Screens.profile]: undefined;
};

export type MainStackParamList = {
  [Screens.navigators.bottomTabs]: NavigatorScreenParams<BottomTabParamList>;
  [Screens.reminderDetails]: { reminderId: string };
};

export type AuthNavigation = NativeStackNavigationProp<AuthStackParamList>;

export type MainStackNavigation = NativeStackNavigationProp<MainStackParamList>;

/** Navigation available inside a tab screen (tabs + the parent stack). */
export type TabNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList>,
  MainStackNavigation
>;

export type HomeRoute = RouteProp<BottomTabParamList, typeof Screens.home>;

export type ReminderDetailsRoute = RouteProp<
  MainStackParamList,
  typeof Screens.reminderDetails
>;
