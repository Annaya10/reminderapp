import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Mapbox from '@rnmapbox/maps';

/**
 * Whether the map may use the device location. On iOS, Mapbox shows the
 * system prompt itself; on Android the app must request it at runtime.
 */
export const useLocationPermission = () => {
  const [isGranted, setIsGranted] = useState(Platform.OS !== 'android');

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    let isMounted = true;
    Mapbox.requestAndroidLocationPermissions()
      .then(granted => isMounted && setIsGranted(granted))
      .catch(() => isMounted && setIsGranted(false));
    return () => {
      isMounted = false;
    };
  }, []);

  return isGranted;
};
