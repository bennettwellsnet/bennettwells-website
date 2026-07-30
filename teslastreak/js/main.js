import { initSimulator } from './simulator.js';
import { initFeed } from './feed.js';
import { initChecklist } from './checklist.js';
import { fsdStats } from './stats.js';
function initStats() {
  const el = (id) => document.getElementById(id);
  if (el('stat-longest')) el('stat-longest').textContent = fsdStats.longestStreak;
  if (el('stat-auto')) el('stat-auto').textContent = fsdStats.avgAutonomous;
  if (el('stat-safer')) el('stat-safer').textContent = fsdStats.safetyMultiplier;
  if (el('stat-miles')) el('stat-miles').textContent = fsdStats.realWorldMiles;
}
function init() {
  initStats();
  initSimulator();
  initFeed();
  initChecklist();
  const heroTip = document.getElementById('hero-tip');
  if (heroTip) heroTip.textContent = 'Community wisdom: "The streak isn’t worth the achievements you might think it represents. Safety is the key priority."';
  console.log('%c[TeslaStreak] All modules initialized. Simulator should now calculate on form submit.', 'color:#64748b');
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
