import { MAPBOX_ACCESS_TOKEN as ENV_MAPBOX_ACCESS_TOKEN } from '@env';

/**
 * Mapbox public access token (starts with "pk."), read from .env.
 * Create one at https://account.mapbox.com/access-tokens/
 */
export const MAPBOX_ACCESS_TOKEN = ENV_MAPBOX_ACCESS_TOKEN;

export const MapConfig = {
  userZoomLevel: 15,
  defaultZoomLevel: 1,
  animationDuration: 800,
};
