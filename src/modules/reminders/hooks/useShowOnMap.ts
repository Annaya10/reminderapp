import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Screens } from '@src/constants/screens';
import { MainStackNavigation } from '@src/routes/types';

/** Opens the Home map focused on a reminder, from any main-app screen. */
export const useShowOnMap = () => {
  const navigation = useNavigation<MainStackNavigation>();

  return useCallback(
    (reminderId: string) =>
      navigation.popTo(Screens.navigators.bottomTabs, {
        screen: Screens.home,
        params: { focusReminderId: reminderId, focusRequestId: Date.now() },
      }),
    [navigation],
  );
};
