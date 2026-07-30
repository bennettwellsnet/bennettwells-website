import { initSimulator } from './simulator.js';
import { initFeed } from './feed.js';
import { initChecklist } from './checklist.js';
import {
  snapshotMeta,
  companyStats,
  communityStats,
  getRandomTip,
} from './stats.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderStatCard(stat, accentClass) {
  const sourceLink = stat.sourceUrl
    ? `<a href="${escapeHtml(stat.sourceUrl)}" class="underline hover:text-zinc-200" target="_blank" rel="noopener noreferrer">${escapeHtml(stat.source)}</a>`
    : escapeHtml(stat.source);

  return `
    <article class="bg-zinc-900 border border-white/10 rounded-3xl p-5 flex flex-col">
      <div class="text-[10px] uppercase tracking-wider text-zinc-500">${escapeHtml(stat.label)}</div>
      <div class="text-2xl sm:text-3xl font-semibold metric mt-1 ${accentClass}">${escapeHtml(stat.value)}</div>
      <p class="text-[11px] text-zinc-400 mt-2 flex-1">${escapeHtml(stat.detail)}</p>
      <div class="mt-3 pt-3 border-t border-white/5 text-[10px] text-zinc-500 space-y-1">
        <div><span class="text-zinc-600">Source</span> · ${sourceLink}</div>
        <div><span class="text-zinc-600">As of</span> · ${escapeHtml(stat.asOf)}</div>
        ${
          stat.caveat
            ? `<details class="mt-1"><summary class="cursor-pointer text-zinc-400 hover:text-zinc-200">Caveat</summary><p class="mt-1 text-zinc-500 leading-relaxed">${escapeHtml(stat.caveat)}</p></details>`
            : ''
        }
      </div>
    </article>
  `;
}

function initSnapshotBanner() {
  const el = document.getElementById('snapshot-banner');
  if (!el) return;
  el.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-start gap-3">
      <div class="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
        ${escapeHtml(snapshotMeta.kind)}
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-sm text-zinc-200 font-medium">Data snapshot · ${escapeHtml(snapshotMeta.asOfLabel)}</div>
        <p class="text-xs text-zinc-400 mt-1 leading-relaxed">${escapeHtml(snapshotMeta.honesty)}</p>
        <details class="mt-2 text-xs text-zinc-400">
          <summary class="cursor-pointer text-zinc-300 hover:text-white">${escapeHtml(snapshotMeta.caveatsTitle)}</summary>
          <ul class="mt-2 list-disc list-inside space-y-1 text-zinc-500">
            ${snapshotMeta.caveats.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}
          </ul>
        </details>
      </div>
    </div>
  `;
}

function initStats() {
  const companyEl = document.getElementById('company-stats');
  const communityEl = document.getElementById('community-stats');
  if (companyEl) {
    companyEl.innerHTML = companyStats.map((s) => renderStatCard(s, 'text-sky-400')).join('');
  }
  if (communityEl) {
    communityEl.innerHTML = communityStats.map((s) => renderStatCard(s, 'text-emerald-400')).join('');
  }

  const asOfBits = document.querySelectorAll('[data-snapshot-as-of]');
  asOfBits.forEach((node) => {
    node.textContent = snapshotMeta.asOfLabel;
  });
}

function init() {
  initSnapshotBanner();
  initStats();
  initSimulator();
  initFeed();
  initChecklist();

  const heroTip = document.getElementById('hero-tip');
  if (heroTip) {
    heroTip.textContent = `Community wisdom: “${getRandomTip()}”`;
  }

  console.log('%c[TeslaStreak] Phase A: sourced stats + honesty banner.', 'color:#64748b');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
