import { Alert, Linking, Platform } from 'react-native';
import type { Position } from 'geojson';

export const EXTERNAL_MAPS_NAME = Platform.select({
  ios: 'Apple Maps',
  default: 'Google Maps',
});

/** Opens the platform maps app with a pin at `coordinate` ([lng, lat]). */
export const openInMaps = async (coordinate: Position, label: string) => {
  const [lng, lat] = coordinate;
  const query = encodeURIComponent(label);
  const url = Platform.select({
    ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${query}`,
    default: `geo:${lat},${lng}?q=${lat},${lng}(${query})`,
  });
  const webFallback = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  try {
    await Linking.openURL(url);
  } catch {
    try {
      await Linking.openURL(webFallback);
    } catch (error) {
      console.error('[Maps] could not open maps', error);
      Alert.alert('Could not open maps', 'No maps app is available.');
    }
  }
};
