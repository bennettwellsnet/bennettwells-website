/**
 * time.js
 * Productivity time estimation module.
 */
export function estimatePrepAndPaintTime(area, coats = 2) {
  const prep = (area / 90) * 1.0;           // cutting in + prep
  const rolling = (area / 110) * coats;     // rolling productivity
  return Math.round((prep + rolling) * 10) / 10;
}

export function formatTime(hours) {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export const PRODUCTIVITY_TIPS = [
  "Work top to bottom: ceiling → walls → trim",
  "Use a 5-gallon bucket with a screen for faster loading",
  "Cut in one wall completely before rolling to avoid lap marks"
];
