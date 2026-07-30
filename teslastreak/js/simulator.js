/**
 * Safety-first streak simulator with drive scenarios.
 * Illustrative only — not predictive of real FSD risk.
 */

export const SCENARIOS = {
  highway: {
    id: 'highway',
    label: 'Highway commute',
    short: 'Highway',
    description: 'Mostly freeways / limited access roads, fewer tight edges.',
    baseRisk: 0.045,
    tipWeight: 0.012,
    defaultPlanned: 45,
    note: 'Highways are often where long streaks build. Still supervise: hard brakes, cut-ins, and work zones can appear suddenly.',
    tips: {
      parking: { label: 'Take over early if you exit into lots / Superchargers', default: true, weight: 1 },
      chill: { label: 'Use Chill / calmer profile on long highway legs', default: true, weight: 1.2 },
      pass: { label: 'Accelerator tap to pass instead of waiting', default: true, weight: 0.8 },
      construction: { label: 'Manually handle construction if it appears', default: false, weight: 1.1 },
    },
  },
  city: {
    id: 'city',
    label: 'City + parking',
    short: 'City + parking',
    description: 'Urban streets, unprotected turns, lots and garages.',
    baseRisk: 0.14,
    tipWeight: 0.02,
    defaultPlanned: 25,
    note: 'Parking lots and garages are the #1 streak-breakers in community reports. Taking over early is a win, not a failure.',
    tips: {
      parking: { label: 'Take over early in parking lots / garages', default: true, weight: 1.5 },
      chill: { label: 'Calmer profile in dense traffic', default: false, weight: 0.7 },
      pass: { label: 'Pass only when clearly safe', default: false, weight: 0.6 },
      construction: { label: 'Avoid complex nav edges manually if needed', default: true, weight: 1 },
    },
  },
  construction: {
    id: 'construction',
    label: 'Construction / work zone',
    short: 'Work zone',
    description: 'Temp lanes, cones, flaggers, messy navigation.',
    baseRisk: 0.22,
    tipWeight: 0.025,
    defaultPlanned: 15,
    note: 'Work zones change daily. Manual driving through cones and temporary lanes is often the safer, smarter call — even if the streak resets.',
    tips: {
      parking: { label: 'Take over for related lot/staging areas', default: true, weight: 1 },
      chill: { label: 'Slow / calm profile if you stay on FSD briefly', default: true, weight: 0.9 },
      pass: { label: 'Do not “force” progress in cones', default: true, weight: 1.2 },
      construction: { label: 'Prefer manual through the work zone', default: true, weight: 1.8 },
    },
  },
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSelectedScenarioId(form) {
  const checked = form.querySelector('input[name="scenario"]:checked');
  return checked?.value && SCENARIOS[checked.value] ? checked.value : 'highway';
}

function renderTipCheckboxes(container, scenario) {
  if (!container) return;
  container.innerHTML = Object.entries(scenario.tips)
    .map(
      ([key, tip]) => `
      <label class="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" data-tip-key="${escapeHtml(key)}" data-tip-weight="${tip.weight}" ${tip.default ? 'checked' : ''} class="mt-1 accent-emerald-500">
        <span>${escapeHtml(tip.label)}</span>
      </label>`,
    )
    .join('');
}

function updateScenarioUI(form, scenario) {
  const desc = document.getElementById('scenario-desc');
  const planned = document.getElementById('planned-miles');
  const tipsEl = document.getElementById('sim-tips');
  if (desc) desc.textContent = scenario.description;
  if (planned && document.activeElement !== planned) {
    // Only auto-fill default when switching scenarios if user hasn't just typed
    planned.value = String(scenario.defaultPlanned);
  }
  renderTipCheckboxes(tipsEl, scenario);

  // Highlight selected scenario card
  form.querySelectorAll('[data-scenario-card]').forEach((card) => {
    const on = card.getAttribute('data-scenario-card') === scenario.id;
    card.classList.toggle('ring-2', on);
    card.classList.toggle('ring-emerald-500/60', on);
    card.classList.toggle('border-emerald-500/40', on);
    card.classList.toggle('bg-emerald-500/5', on);
  });
}

export function initSimulator() {
  const form = document.getElementById('streak-sim');
  if (!form) return;

  const resultEl = document.getElementById('sim-result');
  const streakDisplay = document.getElementById('sim-streak');
  const riskDisplay = document.getElementById('sim-risk');
  const tipBox = document.getElementById('sim-tip');
  const noteBox = document.getElementById('sim-scenario-note');
  const assumeBox = document.getElementById('sim-assumptions');

  // Scenario change
  form.querySelectorAll('input[name="scenario"]').forEach((input) => {
    input.addEventListener('change', () => {
      const sc = SCENARIOS[getSelectedScenarioId(form)];
      updateScenarioUI(form, sc);
      if (resultEl) resultEl.classList.add('hidden');
    });
  });

  // Initial UI
  updateScenarioUI(form, SCENARIOS.highway);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const scenario = SCENARIOS[getSelectedScenarioId(form)];
    const currentMiles = parseInt(document.getElementById('current-miles').value, 10) || 0;
    const plannedMiles = parseInt(document.getElementById('planned-miles').value, 10) || 0;

    let tipScore = 0;
    let maxTipScore = 0;
    form.querySelectorAll('#sim-tips input[type="checkbox"]').forEach((cb) => {
      const w = parseFloat(cb.dataset.tipWeight) || 1;
      maxTipScore += w;
      if (cb.checked) tipScore += w;
    });

    // Illustrative model: scenario base risk reduced by weighted tips
    const tipRatio = maxTipScore > 0 ? tipScore / maxTipScore : 0;
    const reduction = tipRatio * scenario.tipWeight * 4; // scale so full tips meaningfully help
    const projectedRisk = Math.min(0.85, Math.max(0.02, scenario.baseRisk - reduction));
    const milesAdded = Math.round(plannedMiles * (1 - projectedRisk));
    const projectedStreak = currentMiles + milesAdded;
    const riskPercent = Math.round(projectedRisk * 100);

    if (streakDisplay) streakDisplay.textContent = projectedStreak.toLocaleString();
    if (riskDisplay) {
      riskDisplay.textContent = `${riskPercent}%`;
      riskDisplay.classList.toggle('text-amber-400', riskPercent >= 15);
      riskDisplay.classList.toggle('text-red-400', riskPercent >= 25);
      riskDisplay.classList.toggle('text-zinc-100', riskPercent < 15);
    }
    if (resultEl) resultEl.classList.remove('hidden');

    if (noteBox) {
      noteBox.innerHTML = `<strong class="text-zinc-200">${escapeHtml(scenario.label)}:</strong> ${escapeHtml(scenario.note)}`;
    }
    if (assumeBox) {
      assumeBox.textContent = `Assumptions (demo only): base risk ${(scenario.baseRisk * 100).toFixed(0)}% for this scenario; tips reduced it to ${riskPercent}%. Projected +${milesAdded.toLocaleString()} mi this drive. Not real FSD telemetry.`;
    }
    if (tipBox) {
      const safetyLine =
        riskPercent >= 20
          ? 'High-friction drive — prioritizing smart takeovers beats protecting the number.'
          : 'Lower-friction drive — still supervise every mile; the streak is a metric, not a goal.';
      tipBox.textContent = safetyLine;
    }
  });

  const resetBtn = document.getElementById('sim-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (resultEl) resultEl.classList.add('hidden');
      form.reset();
      // re-check default scenario
      const highway = form.querySelector('input[name="scenario"][value="highway"]');
      if (highway) highway.checked = true;
      updateScenarioUI(form, SCENARIOS.highway);
      document.getElementById('current-miles').value = '1200';
    });
  }
}
