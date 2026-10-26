const navigators = {
  authStack: 'authStack',
  mainStack: 'mainStack',
  bottomTabs: 'bottomTabs',
} as const;

export const Screens = {
  login: 'login',
  register: 'register',
  home: 'home',
  /** Center "+" tab; it opens the Add Reminder form instead of a screen. */
  addReminder: 'addReminder',
  myReminders: 'myReminders',
  reminderDetails: 'reminderDetails',
  profile: 'profile',
  navigators,
} as const;
