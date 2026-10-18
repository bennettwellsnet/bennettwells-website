/**
 * Cloudflare Worker entry for bennettwells-website (Workers + Static Assets).
 * Blocks requests for source-control and secret files, then serves assets.
 *
 * The family tree no longer lives on this site. It is served privately by
 * the separate cfamily-tree Worker.
 */

function isBlocked(pathname) {
  return (
    pathname === '/.git' ||
    pathname.startsWith('/.git/') ||
    pathname.startsWith('/.env') ||
    pathname.startsWith('/.claude') ||
    pathname === '/.gitignore'
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (isBlocked(url.pathname)) {
      return new Response('Not Found', { status: 404 });
    }
    if (!env.ASSETS) {
      return new Response('ASSETS binding missing', { status: 500 });
    }
    return env.ASSETS.fetch(request);
  },
};
