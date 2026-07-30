function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

import { examplePosts } from './stats.js';

export function initFeed() {
  const container = document.getElementById('x-feed');
  const filterInput = document.getElementById('feed-filter');
  if (!container) return;

  let currentPosts = [...examplePosts];

  function render(posts) {
    container.innerHTML = '';
    if (posts.length === 0) {
      container.innerHTML = '<div class="text-sm text-zinc-400">No matching posts.</div>';
      return;
    }
    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'bg-zinc-900 border border-white/10 rounded-2xl p-4 text-sm post-card';
      const meta = [post.date, post.likes ? `${post.likes} eng.` : ''].filter(Boolean).join(' · ');
      card.innerHTML = `
        <div class="flex justify-between items-start mb-2 gap-3">
          <div class="font-semibold text-amber-400">${escapeHtml(post.user)}</div>
          <div class="text-[10px] text-zinc-500 shrink-0">${escapeHtml(meta)}</div>
        </div>
        <p class="text-zinc-200 mb-2">${escapeHtml(post.text)}</p>
        ${
          post.highlight
            ? `<div class="text-[10px] text-emerald-400 font-medium">${escapeHtml(post.highlight)}</div>`
            : ''
        }`;
      container.appendChild(card);
    });
  }

  render(currentPosts);

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      const term = filterInput.value.toLowerCase().trim();
      const filtered = currentPosts.filter(
        (p) =>
          p.text.toLowerCase().includes(term) ||
          (p.highlight || '').toLowerCase().includes(term) ||
          (p.user || '').toLowerCase().includes(term),
      );
      render(filtered);
    });
  }

  document.querySelectorAll('[data-x-search]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.xSearch || '';
      if (filterInput) {
        filterInput.value = query;
        filterInput.dispatchEvent(new Event('input'));
      }
      const original = btn.textContent;
      btn.textContent = 'Filtered ✓';
      setTimeout(() => {
        btn.textContent = original;
      }, 1500);
    });
  });
}
