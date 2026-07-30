import { initSimulator } from './simulator.js';
import { initFeed } from './feed.js';
import { initChecklist } from './checklist.js';
import { fsdStats, getRandomTip } from './stats.js';

function initStats() {
  const el = (id) => document.getElementById(id);
  if (el('stat-longest')) el('stat-longest').textContent = fsdStats.longestStreak;
  if (el('stat-auto')) el('stat-auto').textContent = fsdStats.avgAutonomous;
  if (el('stat-safer')) el('stat-safer').textContent = fsdStats.safetyMultiplier;
  if (el('stat-miles')) el('stat-miles').textContent = fsdStats.realWorldMiles;
  if (el('stat-fleet')) el('stat-fleet').textContent = fsdStats.fleetMiles;
  if (el('stat-note')) el('stat-note').textContent = fsdStats.streakNote;
}

function init() {
  initStats();
  initSimulator();
  initFeed();
  initChecklist();
  const heroTip = document.getElementById('hero-tip');
  if (heroTip) {
    heroTip.textContent = `Community wisdom: “${getRandomTip()}”`;
  }
  const updated = document.getElementById('data-as-of');
  if (updated) updated.textContent = 'Data snapshot: July 30, 2026 (demo / approximate)';
  console.log('%c[TeslaStreak] Modules ready. Safety > streak.', 'color:#64748b');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
