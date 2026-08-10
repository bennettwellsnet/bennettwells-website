/**
 * Cloudflare Pages middleware:
 * - Block sensitive paths
 * - Password-gate /family-tree (cookie session)
 *
 * Set secret in Cloudflare Pages → Settings → Environment variables:
 *   FAMILY_TREE_PASSWORD  (required for access)
 * Optional:
 *   FAMILY_TREE_COOKIE_SECRET  (extra signing material; defaults to password)
 */

const BLOCKED_EXACT = new Set([
  '/.gitignore',
  '/.DS_Store',
  '/.env',
  '/.env.local',
  '/.env.production',
  '/.env.development',
]);

const COOKIE_NAME = 'ft_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function isBlocked(pathname) {
  if (BLOCKED_EXACT.has(pathname)) return true;
  if (pathname === '/.git' || pathname.startsWith('/.git/')) return true;
  if (pathname.startsWith('/.claude')) return true;
  if (pathname.startsWith('/.env.')) return true;
  if (pathname.includes('/.git/')) return true;
  if (pathname.endsWith('/.DS_Store')) return true;
  return false;
}

function isFamilyTreePath(pathname) {
  return pathname === '/family-tree' || pathname.startsWith('/family-tree/');
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    out[k] = decodeURIComponent(v);
  }
  return out;
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sessionToken(password, cookieSecret) {
  // Bound to site path so token isn't reusable elsewhere
  return sha256Hex(`family-tree|v1|${cookieSecret}|${password}`);
}

function loginPage({ error = '', actionPath = '/family-tree/' } = {}) {
  const err = error
    ? `<p class="err" role="alert">${escapeHtml(error)}</p>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Family Tree · Sign in</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    font-family: system-ui, -apple-system, Segoe UI, sans-serif;
    background: #0c0a09; color: #e7e5e4;
    background-image:
      radial-gradient(ellipse 70% 45% at 20% -5%, rgba(168,162,158,.12), transparent),
      radial-gradient(ellipse 50% 40% at 90% 10%, rgba(120,113,108,.1), transparent);
  }
  .card {
    width: min(100% - 2rem, 22rem);
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(0,0,0,.45);
    border-radius: 1rem; padding: 1.5rem;
  }
  h1 { font-size: 1.25rem; margin: 0 0 .35rem; font-weight: 700; }
  p.sub { margin: 0 0 1.25rem; color: #a8a29e; font-size: .875rem; line-height: 1.45; }
  label { display: block; font-size: .7rem; text-transform: uppercase; letter-spacing: .08em;
    color: #78716c; font-weight: 600; margin-bottom: .4rem; }
  input[type=password] {
    width: 100%; border-radius: .65rem; border: 1px solid rgba(255,255,255,.15);
    background: rgba(255,255,255,.04); color: #fafaf9; padding: .7rem .85rem;
    font-size: 1rem; outline: none;
  }
  input[type=password]:focus { border-color: rgba(251,191,36,.45); }
  button {
    margin-top: .9rem; width: 100%; border: 0; border-radius: .65rem;
    background: #fbbf24; color: #1c1917; font-weight: 700; padding: .7rem;
    font-size: .9rem; cursor: pointer;
  }
  button:hover { background: #fcd34d; }
  .err { color: #fca5a5; font-size: .8rem; margin: 0 0 .75rem; }
  a.home { display: inline-block; margin-top: 1rem; color: #78716c; font-size: .8rem; }
  a.home:hover { color: #d6d3d1; }
</style>
</head>
<body>
  <div class="card">
    <h1>Family tree</h1>
    <p class="sub">This section is private. Enter the password to continue.</p>
    ${err}
    <form method="POST" action="${escapeHtml(actionPath)}">
      <input type="hidden" name="ft_login" value="1" />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" autofocus required />
      <button type="submit">Unlock</button>
    </form>
    <a class="home" href="/">← bennettwells.net</a>
  </div>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function htmlResponse(html, status = 200, extraHeaders = {}) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      ...extraHeaders,
    },
  });
}

async function handleFamilyTreeAuth(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const password = env.FAMILY_TREE_PASSWORD;
  const cookieSecret = env.FAMILY_TREE_COOKIE_SECRET || password || 'unset';

  if (!password) {
    return htmlResponse(
      loginPage({
        error: 'Access is not configured yet (missing FAMILY_TREE_PASSWORD).',
        actionPath: '/family-tree/',
      }),
      503,
    );
  }

  const expected = await sessionToken(password, cookieSecret);
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const hasSession = cookies[COOKIE_NAME] === expected;

  // Login POST
  if (request.method === 'POST') {
    const ct = request.headers.get('Content-Type') || '';
    let bodyPassword = '';
    if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const form = await request.formData();
      if (form.get('ft_login') === '1') {
        bodyPassword = String(form.get('password') || '');
      }
    }

    if (bodyPassword && bodyPassword === password) {
      const token = expected;
      const secure = url.protocol === 'https:' ? '; Secure' : '';
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/family-tree/',
          'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/family-tree; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`,
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }

    return htmlResponse(
      loginPage({ error: 'Incorrect password.', actionPath: '/family-tree/' }),
      401,
    );
  }

  if (hasSession) {
    const res = await context.next();
    // Ensure private caching / noindex on tree assets
    const headers = new Headers(res.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    headers.set('Cache-Control', headers.get('Cache-Control') || 'private, max-age=300');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  }

  // Unauthenticated: HTML login for navigations; 401 for assets/API-ish requests
  const accept = request.headers.get('Accept') || '';
  const isAsset = /\.(js|css|svg|png|jpg|jpeg|webp|ico|woff2?|map)(\?|$)/i.test(url.pathname);
  if (isAsset || (accept && !accept.includes('text/html'))) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  return htmlResponse(loginPage({ actionPath: '/family-tree/' }), 401);
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

  if (isFamilyTreePath(url.pathname)) {
    return handleFamilyTreeAuth(context);
  }

  return context.next();
}
