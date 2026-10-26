import React, { useMemo } from 'react';
import Mapbox, { FillLayerStyle, LineLayerStyle } from '@rnmapbox/maps';
import type { FeatureCollection, Polygon } from 'geojson';

import { Colors } from '@src/constants/colors';
import { createCirclePolygon } from '@src/helpers/geo';
import { Geofence } from '@src/modules/reminders/types';

export interface GeofenceShape extends Geofence {
  /** Completed geofences are drawn muted. */
  isCompleted?: boolean;
}

const colorByStatus: FillLayerStyle['fillColor'] = [
  'case',
  ['get', 'isCompleted'],
  Colors.placeholder,
  Colors.primary,
];

const fillStyle: FillLayerStyle = {
  fillColor: colorByStatus,
  fillOpacity: 0.15,
};

const outlineStyle: LineLayerStyle = {
  lineColor: colorByStatus,
  lineWidth: 2,
  lineOpacity: 0.8,
};

interface GeofenceLayerProps {
  id: string;
  geofences: GeofenceShape[];
}

/** Draws a filled circle for each geofence. Must be rendered inside a MapView. */
export const GeofenceLayer = ({ id, geofences }: GeofenceLayerProps) => {
  const shape = useMemo<FeatureCollection<Polygon>>(
    () => ({
      type: 'FeatureCollection',
      features: geofences.map(({ coordinate, radius, isCompleted }) => {
        const feature = createCirclePolygon(coordinate, radius);
        feature.properties = { isCompleted: !!isCompleted };
        return feature;
      }),
    }),
    [geofences],
  );

  return (
    <Mapbox.ShapeSource id={`${id}-source`} shape={shape}>
      <Mapbox.FillLayer id={`${id}-fill`} style={fillStyle} />
      <Mapbox.LineLayer id={`${id}-outline`} style={outlineStyle} />
    </Mapbox.ShapeSource>
  );
};
