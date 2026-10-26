import type { Feature, Polygon, Position } from 'geojson';

const EARTH_RADIUS_METERS = 6371008.8;
const METERS_PER_DEGREE_LAT = 111320;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/**
 * Point `distance` meters from `origin` ([lng, lat]) along `bearing`
 * (radians, clockwise from north).
 */
export const destinationPoint = (
  origin: Position,
  distance: number,
  bearing: number,
): Position => {
  const latRad = toRadians(origin[1]);
  const lngRad = toRadians(origin[0]);
  const angularDistance = distance / EARTH_RADIUS_METERS;

  const pointLat = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const pointLng =
    lngRad +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(pointLat),
    );

  return [toDegrees(pointLng), toDegrees(pointLat)];
};

/** Great-circle distance in meters between two [lng, lat] points. */
export const distanceBetween = (from: Position, to: Position): number => {
  const dLat = toRadians(to[1] - from[1]);
  const dLng = toRadians(to[0] - from[0]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from[1])) *
      Math.cos(toRadians(to[1])) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(a));
};

/** Initial bearing in radians (clockwise from north) from one point to another. */
export const bearingBetween = (from: Position, to: Position): number => {
  const fromLat = toRadians(from[1]);
  const toLat = toRadians(to[1]);
  const dLng = toRadians(to[0] - from[0]);
  return Math.atan2(
    Math.sin(dLng) * Math.cos(toLat),
    Math.cos(fromLat) * Math.sin(toLat) -
      Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng),
  );
};

/** Builds a polygon approximating a circle of `radius` meters around `center`. */
export const createCirclePolygon = (
  center: Position,
  radius: number,
  steps = 64,
): Feature<Polygon> => {
  const ring: Position[] = [];
  for (let i = 0; i <= steps; i++) {
    ring.push(destinationPoint(center, radius, (i / steps) * 2 * Math.PI));
  }
  // Close the ring exactly, avoiding floating-point drift on the last point.
  ring[steps] = ring[0];

  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [ring] },
  };
};

/** North-east / south-west corners of the box enclosing a circle. */
export const getCircleBounds = (center: Position, radius: number) => {
  const [lng, lat] = center;
  const latDelta = radius / METERS_PER_DEGREE_LAT;
  const lngDelta = radius / (METERS_PER_DEGREE_LAT * Math.cos(toRadians(lat)));

  return {
    ne: [lng + lngDelta, lat + latDelta],
    sw: [lng - lngDelta, lat - latDelta],
  };
};

export const formatDistance = (meters: number): string =>
  meters >= 1000
    ? `${Number((meters / 1000).toFixed(2))} km`
    : `${Math.round(meters)} m`;
