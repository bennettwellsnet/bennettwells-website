/**
 * calculator.js - Main door replacement calculations
 * (In a real WASM version, much of this heavy lifting moves to Rust)
 */
export const DOOR_PRESETS = {
  'interior-32': { name: '32" Interior Pre-hung', width: 32, height: 80, price: 285, material: 'wood' },
  'interior-36': { name: '36" Interior Pre-hung', width: 36, height: 80, price: 310, material: 'wood' },
  'exterior-36': { name: '36" Exterior Steel', width: 36, height: 80, price: 520, material: 'steel' },
  'french-60': { name: '60" French Double', width: 60, height: 80, price: 890, material: 'wood' },
  'sliding-72': { name: '72" Sliding Patio', width: 72, height: 80, price: 680, material: 'vinyl' }
};

export function calculateDoorMaterials(door, qty = 1) {
  const { width, height, price } = door;
  const slabArea = (width * height) / 144; // sq ft
  const jambLinear = ((width * 2) + height) / 12 * 1.1; // rough casing + jamb
  const hardware = door.material === 'steel' ? 1 : 1.5; // sets
  
  return {
    slabs: qty,
    casingFt: Math.ceil(jambLinear * qty * 1.15),
    hardwareSets: Math.ceil(hardware * qty),
    estimatedCost: Math.round(price * qty * 1.08) // small markup
  };
}

export function estimateInstallTime(numDoors, complexity = 1.0) {
  // Base productivity: ~2.25 hours per pre-hung door including removal
  const baseHours = numDoors * 2.25 * complexity;
  return Math.round(baseHours * 10) / 10;
}

export function calculateProject(doorsList) {
  let totalCost = 0;
  let totalTime = 0;
  let totalMaterials = { casingFt: 0, hardwareSets: 0 };

  doorsList.forEach(entry => {
    const mats = calculateDoorMaterials(entry.door, entry.qty);
    totalCost += mats.estimatedCost;
    totalMaterials.casingFt += mats.casingFt;
    totalMaterials.hardwareSets += mats.hardwareSets;
    totalTime += estimateInstallTime(entry.qty, entry.complexity || 1.0);
  });

  return {
    totalCost: Math.round(totalCost),
    totalTime: Math.round(totalTime * 10) / 10,
    materials: totalMaterials,
    doorCount: doorsList.reduce((sum, e) => sum + e.qty, 0)
  };
}
