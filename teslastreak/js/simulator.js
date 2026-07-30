export function initSimulator() {
  const form = document.getElementById('streak-sim');
  if (!form) return;

  const resultEl = document.getElementById('sim-result');
  const streakDisplay = document.getElementById('sim-streak');
  const riskDisplay = document.getElementById('sim-risk');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentMiles = parseInt(document.getElementById('current-miles').value, 10) || 100;
    const plannedMiles = parseInt(document.getElementById('planned-miles').value, 10) || 50;
    const tipsApplied = form.querySelectorAll('input[type="checkbox"]:checked').length;

    // Illustrative model only — not predictive of real FSD risk
    const baseRisk = 0.08;
    const tipReduction = tipsApplied * 0.015;
    const projectedRisk = Math.max(0.01, baseRisk - tipReduction);
    const projectedStreak = Math.round(currentMiles + plannedMiles * (1 - projectedRisk));
    const riskPercent = Math.round(projectedRisk * 100);

    if (streakDisplay) streakDisplay.textContent = projectedStreak.toLocaleString();
    if (riskDisplay) riskDisplay.textContent = `${riskPercent}%`;
    if (resultEl) resultEl.classList.remove('hidden');

    const tipBox = document.getElementById('sim-tip');
    if (tipBox) {
      const tips = [
        'Parking lots remain the #1 streak-breaker — take over early.',
        'Pass with a light accelerator tap when safe; don’t wait forever behind slow traffic.',
        'High FSD % + honest takeovers beat protecting a vanity streak.',
        'Streak carries across drives — still supervise every mile.',
        'Construction and temporary lanes: manual is often the right call.',
      ];
      tipBox.textContent = `Pro tip: ${tips[Math.floor(Math.random() * tips.length)]}`;
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
