import { useEffect, useState } from 'react';
import { locationManager } from '@rnmapbox/maps';
import type { Location } from '@rnmapbox/maps';
import type { Position } from 'geojson';

import { distanceBetween } from '@src/helpers/geo';
import { useLocationPermission } from '@src/hooks/useLocationPermission';

/**
 * Straight-line distance in meters from the device to `target`, or null
 * while the device location is unknown.
 */
export const useDistanceTo = (target: Position): number | null => {
  const hasLocationPermission = useLocationPermission();
  const [userCoordinate, setUserCoordinate] = useState<Position | null>(null);

  useEffect(() => {
    if (!hasLocationPermission) {
      return;
    }
    const handleLocation = ({ coords }: Location) =>
      setUserCoordinate([coords.longitude, coords.latitude]);
    // The manager is shared with the map; it stops once no listener remains.
    locationManager.addListener(handleLocation);
    return () => locationManager.removeListener(handleLocation);
  }, [hasLocationPermission]);

  return userCoordinate ? distanceBetween(userCoordinate, target) : null;
};
