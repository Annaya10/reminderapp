import Mapbox from '@rnmapbox/maps';

import { MAPBOX_ACCESS_TOKEN } from '@src/constants/config';

export const initMapbox = () => {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
};
