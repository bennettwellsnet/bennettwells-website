/**
 * geometry.js - Door opening calculations
 */
export function calculateRoughOpening(doorWidth, doorHeight, jambDepth, prehung) {
  const extraWidth = prehung ? 2.5 : 1.0;  // typical for pre-hung
  const extraHeight = prehung ? 2.0 : 0.75;
  return {
    width: doorWidth + extraWidth,
    height: doorHeight + extraHeight,
    jamb: jambDepth
  };
}

export function calculateCasing(length, width, height, type = 'standard') {
  const factor = type === 'standard' ? 2.5 : 3.2; // linear ft of casing per door
  return (length + width) * factor / 12; // rough linear feet
}
