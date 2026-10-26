import {
  bearingBetween,
  createCirclePolygon,
  destinationPoint,
  distanceBetween,
  formatDistance,
  getCircleBounds,
} from '@src/helpers/geo';
import { normalizeRadius } from '@src/modules/reminders/helpers';

describe('geo helpers', () => {
  const center = [-0.1276, 51.5072];

  test('circle polygon is closed and every point is radius from center', () => {
    const ring = createCirclePolygon(center, 250).geometry.coordinates[0];
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    ring.forEach(point => {
      expect(distanceBetween(center, point)).toBeCloseTo(250, 0);
    });
  });

  test('destination, distance and bearing are consistent', () => {
    const point = destinationPoint(center, 1200, Math.PI / 4);
    expect(distanceBetween(center, point)).toBeCloseTo(1200, 0);
    expect(bearingBetween(center, point)).toBeCloseTo(Math.PI / 4, 3);
  });

  test('bounds enclose the circle', () => {
    const { ne, sw } = getCircleBounds(center, 500);
    expect(ne[0]).toBeGreaterThan(center[0]);
    expect(ne[1]).toBeGreaterThan(center[1]);
    expect(sw[0]).toBeLessThan(center[0]);
    expect(sw[1]).toBeLessThan(center[1]);
  });

  test('formats distances', () => {
    expect(formatDistance(250)).toBe('250 m');
    expect(formatDistance(1000)).toBe('1 km');
    expect(formatDistance(1250)).toBe('1.25 km');
  });

  test('dragged radius is stepped and clamped', () => {
    expect(normalizeRadius(734)).toBe(730);
    expect(normalizeRadius(5)).toBe(50);
    expect(normalizeRadius(99999)).toBe(5000);
  });
});
