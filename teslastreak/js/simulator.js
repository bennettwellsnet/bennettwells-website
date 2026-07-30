export function initSimulator() {
  const form = document.getElementById('streak-sim');
  if (!form) return;
  const resultEl = document.getElementById('sim-result');
  const streakDisplay = document.getElementById('sim-streak');
  const riskDisplay = document.getElementById('sim-risk');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentMiles = parseInt(document.getElementById('current-miles').value) || 100;
    const plannedMiles = parseInt(document.getElementById('planned-miles').value) || 50;
    const tipsApplied = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).length;
    const baseRisk = 0.08;
    const tipReduction = tipsApplied * 0.015;
    const projectedRisk = Math.max(0.01, baseRisk - tipReduction);
    const projectedStreak = Math.round(currentMiles + (plannedMiles * (1 - projectedRisk)));
    const riskPercent = Math.round(projectedRisk * 100);
    if (streakDisplay) streakDisplay.textContent = projectedStreak.toLocaleString();
    if (riskDisplay) riskDisplay.textContent = `${riskPercent}%`;
    if (resultEl) resultEl.classList.remove('hidden');
    const tipBox = document.getElementById('sim-tip');
    if (tipBox) {
      const tips = ["Tap the accelerator to pass instead of waiting — keeps the streak without risk.", "Parking lots are the #1 streak killer. Take over early and manually park.", "High FSD % + long streaks = big Tesla Insurance discounts. It's worth tracking.", "The streak carries across drives — perfect for daily commuters."];
      tipBox.textContent = `Pro tip from X: ${tips[Math.floor(Math.random() * tips.length)]}`;
    }
  });
  const resetBtn = document.getElementById('sim-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (resultEl) resultEl.classList.add('hidden');
      form.reset();
    });
  }
}
