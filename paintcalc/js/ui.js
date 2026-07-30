function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * ui.js
 * DOM update helpers. Keeps the main logic clean.
 */
export function updateSummary(totals, elements) {
  elements.totalArea.textContent = totals.area.toLocaleString();
  elements.gallons.textContent = totals.gallons;
  elements.cans.textContent = totals.cans;
  elements.paintCost.textContent = totals.paintCost.toFixed(2);
  elements.laborCost.textContent = totals.laborCost.toFixed(2);
  elements.totalCost.textContent = totals.totalCost.toFixed(2);
  elements.hours.textContent = totals.hours;
}

export function renderSurfaces(surfaces, container, onRemove) {
  container.innerHTML = '';
  
  if (surfaces.length === 0) {
    container.innerHTML = `<div class="text-sm text-gray-500 italic">Add surfaces above to start your project</div>`;
    return;
  }

  surfaces.forEach(surface => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between bg-white border rounded-xl px-4 py-2 text-sm';
    div.innerHTML = `
      <div>
        <span class="font-medium capitalize">${escapeHtml(surface.type)}</span>
        <span class="text-gray-500 ml-2">${escapeHtml(String(surface.length))}×${escapeHtml(String(surface.width))}${surface.type === 'wall' ? ` × ${escapeHtml(String(surface.height))}` : ''} ft</span>
        <span class="ml-3 text-emerald-600 font-semibold">${escapeHtml(String(surface.area))} sq ft</span>
      </div>
      <button class="text-red-500 hover:text-red-700 px-2" data-id="${escapeHtml(String(surface.id))}">×</button>
    `;
    
    const btn = div.querySelector('button');
    btn.addEventListener('click', () => onRemove(surface.id));
    
    container.appendChild(div);
  });
}
