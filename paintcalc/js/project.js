/**
 * project.js
 * Manages a collection of surfaces and computes aggregates.
 * This is the core "productivity" model.
 */
import { calculateTotalArea } from './geometry.js';
import { calculateGallons, calculateCans } from './coverage.js';
import { calculatePaintCost, calculateLaborCost, getTotalProjectCost } from './cost.js';
import { estimatePrepAndPaintTime } from './time.js';

export class Project {
  constructor(name = 'Untitled Project') {
    this.name = name;
    this.surfaces = [];
    this.preset = 'interior-flat';
    this.coats = 2;
    this.waste = 10;
    this.hourlyRate = 45;
  }

  addSurface(surface) {
    this.surfaces.push(surface);
  }

  removeSurface(id) {
    this.surfaces = this.surfaces.filter(s => s.id !== id);
  }

  getTotals() {
    const area = calculateTotalArea(this.surfaces);
    if (area === 0) return this.getEmptyTotals();

    const gallons = calculateGallons(area, this.coats, undefined, this.waste);
    const cans = calculateCans(gallons);
    const paintCost = calculatePaintCost(gallons, 50); // placeholder, overridden in UI
    const labor = calculateLaborCost(area, this.hourlyRate);
    const totalCost = getTotalProjectCost(paintCost, labor);
    const hours = estimatePrepAndPaintTime(area, this.coats);

    return {
      area: Math.round(area),
      gallons: gallons,
      cans,
      paintCost: Math.round(paintCost * 100) / 100,
      laborCost: Math.round(labor * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      hours: hours
    };
  }

  getEmptyTotals() {
    return {
      area: 0, gallons: 0, cans: 0,
      paintCost: 0, laborCost: 0, totalCost: 0, hours: 0
    };
  }
}
