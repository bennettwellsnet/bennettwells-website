/**
 * cost.js
 * Cost calculations for paint and labor.
 */
export function calculatePaintCost(gallons, pricePerGallon) {
  return Math.round(gallons * pricePerGallon * 100) / 100;
}

export function calculateLaborCost(area, hourlyRate = 45, sqFtPerHour = 80) {
  const hours = area / sqFtPerHour;
  return Math.round(hours * hourlyRate * 100) / 100;
}

export function getTotalProjectCost(paintCost, laborCost = 0) {
  return Math.round((paintCost + laborCost) * 100) / 100;
}
