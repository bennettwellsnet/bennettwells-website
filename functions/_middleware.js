/**
 * Block sensitive paths at the edge (Pages Functions middleware).
 * Defense-in-depth if .git or env files ever appear in the asset bundle.
 */
const BLOCKED_EXACT = new Set([
  '/.gitignore',
  '/.DS_Store',
  '/.env',
  '/.env.local',
  '/.env.production',
  '/.env.development',
]);

function isBlocked(pathname) {
  if (BLOCKED_EXACT.has(pathname)) return true;
  if (pathname === '/.git' || pathname.startsWith('/.git/')) return true;
  if (pathname.startsWith('/.claude')) return true;
  if (pathname.startsWith('/.env.')) return true;
  // Nested junk
  if (pathname.includes('/.git/')) return true;
  if (pathname.endsWith('/.DS_Store')) return true;
  return false;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (isBlocked(url.pathname)) {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }
  return context.next();
}
