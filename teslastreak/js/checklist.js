function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const tips = [
  { id: 'safety-first', label: 'Safety > streak — always intervene if it feels wrong (gamification is not a scoreboard)', checked: false },
  { id: 'parking', label: 'Take over early in parking lots, garages, and Superchargers', checked: true },
  { id: 'construction', label: 'Manually handle construction zones, temp lanes, and messy nav edges', checked: false },
  { id: 'chill', label: 'Use Chill / calmer profiles on long highway drives for consistency', checked: false },
  { id: 'report', label: 'Use the in-car intervention / feedback UI so Tesla can improve', checked: true },
  { id: 'insurance', label: 'Track FSD % honestly — clean miles may help insurance scoring over time', checked: false },
];
export function initChecklist() {
  const container = document.getElementById('streak-checklist');
  const progressBar = document.getElementById('checklist-progress');
  const label = document.getElementById('checklist-label');
  if (!container) return;
  const saved = JSON.parse(localStorage.getItem('teslastreak_checklist') || '[]');
  tips.forEach(tip => { const s = saved.find(x => x.id === tip.id); if (s) tip.checked = s.checked; });
  function render() {
    container.innerHTML = '';
    tips.forEach((tip, i) => {
      const div = document.createElement('label');
      div.className = 'flex items-start gap-3 p-3 bg-zinc-900 rounded-xl cursor-pointer hover:bg-zinc-800 transition';
      div.innerHTML = `<input type="checkbox" class="mt-1 accent-red-500" ${tip.checked ? 'checked' : ''}><span class="text-sm">${escapeHtml(tip.label)}</span>`;
      const input = div.querySelector('input');
      input.addEventListener('change', () => { tips[i].checked = input.checked; save(); updateProgress(); });
      container.appendChild(div);
    });
    updateProgress();
  }
  function save() { localStorage.setItem('teslastreak_checklist', JSON.stringify(tips)); }
  function updateProgress() {
    const done = tips.filter(t => t.checked).length;
    const pct = Math.round((done / tips.length) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (label) label.textContent = `${done}/${tips.length} tips followed (${pct}%)`;
  }
  render();
}
