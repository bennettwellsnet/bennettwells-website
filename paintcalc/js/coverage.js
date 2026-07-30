/**
 * coverage.js
 * Paint quantity calculations and presets.
 */
export const PAINT_PRESETS = {
  'interior-flat': { name: 'Interior Flat/Low Sheen', coverage: 350, pricePerGallon: 48 },
  'interior-eggshell': { name: 'Interior Eggshell/Satin', coverage: 325, pricePerGallon: 55 },
  'exterior': { name: 'Exterior Paint', coverage: 300, pricePerGallon: 72 },
  'primer': { name: 'Primer / Sealer', coverage: 400, pricePerGallon: 42 }
};

export function calculateGallons(area, coats = 2, coveragePerGallon = 350, wastePercent = 10) {
  const base = (area * coats) / coveragePerGallon;
  const withWaste = base * (1 + wastePercent / 100);
  return Math.ceil(withWaste * 10) / 10;
}

export function calculateCans(gallons, canSize = 1) {
  return Math.ceil(gallons / canSize);
}

export function getPreset(key) {
  return PAINT_PRESETS[key] || PAINT_PRESETS['interior-flat'];
}
