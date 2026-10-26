import React from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from '@src/components/Icon';
import { Colors } from '@src/constants/colors';
import { FontSizes, Fonts } from '@src/constants/fonts';
import { Radius, Spacing } from '@src/constants/layout';
import { Screens } from '@src/constants/screens';
import { Shadows } from '@src/constants/shadows';
import { MyRemindersScreen } from '@src/modules/reminders/MyRemindersScreen';
import { ReminderHomeScreen } from '@src/modules/reminders/ReminderHomeScreen';
import {
  TAB_CIRCLE_SIZE,
  TabCircleIcon,
} from '@src/routes/bottomNav/TabCircleIcon';
import { BottomTabParamList } from '@src/routes/types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_BAR_HEIGHT = 64;

const renderTabIcon =
  (
    activeIcon: IconName,
    inactiveIcon: IconName,
  ): BottomTabNavigationOptions['tabBarIcon'] =>
  ({ focused }) =>
    (
      <Icon
        name={focused ? activeIcon : inactiveIcon}
        size={24}
        color={focused ? 'primary' : 'placeholder'}
      />
    );

const renderAddIcon = () => <TabCircleIcon name="add" />;

const renderNoLabel = () => null;

/** The center tab never shows a screen; pressing it opens the Add form. */
const EmptyScreen = () => null;

export const BottomTabs = () => {
  const { bottom } = useSafeAreaInsets();

  const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
    tabBarActiveTintColor: Colors.primary,
    tabBarInactiveTintColor: Colors.placeholder,
    tabBarStyle: {
      position: 'absolute',
      height: TAB_BAR_HEIGHT + bottom,
      paddingTop: Spacing.sm,
      backgroundColor: Colors.cardBg,
      borderTopWidth: 0,
      borderTopLeftRadius: Radius.xl,
      borderTopRightRadius: Radius.xl,
      ...Shadows.raisedUp,
    },
    tabBarLabelStyle: {
      ...Fonts.semiBold,
      fontSize: FontSizes.caption,
    },
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={Screens.home}
        component={ReminderHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: renderTabIcon('map', 'map-outline'),
        }}
      />
      <Tab.Screen
        name={Screens.addReminder}
        component={EmptyScreen}
        options={{
          title: 'Add Reminder',
          tabBarLabel: renderNoLabel,
          tabBarIcon: renderAddIcon,
          tabBarIconStyle: { width: TAB_CIRCLE_SIZE, height: TAB_CIRCLE_SIZE },
        }}
        listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault();
            navigation.navigate(Screens.home, { addRequestId: Date.now() });
          },
        })}
      />
      <Tab.Screen
        name={Screens.myReminders}
        component={MyRemindersScreen}
        options={{
          title: 'My Reminders',
          tabBarIcon: renderTabIcon('list', 'list-outline'),
        }}
      />
    </Tab.Navigator>
  );
};
