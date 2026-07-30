/**
 * geometry.js
 * Pure geometry calculations for painting surfaces.
 */
export function calculateWallArea(length, width, height, doors = 0, windows = 0) {
  const gross = 2 * (length + width) * height;
  const openingArea = (doors * 20) + (windows * 15); // standard rough sizes in sq ft
  return Math.max(0, Math.round(gross - openingArea));
}

export function calculateCeilingArea(length, width) {
  return Math.round(length * width);
}

export function calculateTotalArea(surfaces) {
  return surfaces.reduce((sum, s) => sum + s.area, 0);
}

export function createSurface(type, length, width, height = 8, doors = 0, windows = 0) {
  const area = type === 'ceiling' 
    ? calculateCeilingArea(length, width)
    : calculateWallArea(length, width, height, doors, windows);
  
  return {
    id: Date.now() + Math.random(),
    type,
    length,
    width,
    height,
    doors,
    windows,
    area
  };
}
