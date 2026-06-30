const COOKIE_NAME = 'alaska_trip_auth';
const COOKIE_PATH = '/alaskatrip';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const AUTH_SALT = 'alaska-trip-auth-v1';
const PROTECTED_PREFIX = '/alaskatrip';

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function authToken(password) {
  const data = new TextEncoder().encode(`${password}:${AUTH_SALT}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bytesToBase64Url(new Uint8Array(hash));
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
}

function isProtectedPath(pathname) {
  return pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);
}

function loginPage(errorMessage = '') {
  const errorHtml = errorMessage
    ? `<p class="error" role="alert">${errorMessage}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Alaska Trip 2026 · Sign in</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      color: #e2e8f0;
      background: #0c1929;
      background-image:
        radial-gradient(ellipse 70% 50% at 20% 0%, rgba(2, 132, 199, 0.15), transparent),
        radial-gradient(ellipse 50% 40% at 80% 10%, rgba(74, 222, 128, 0.08), transparent);
    }
    .card {
      width: min(100%, 420px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 32px;
      background: linear-gradient(145deg, rgba(12, 37, 64, 0.9), rgba(6, 24, 44, 0.95));
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
    }
    .eyebrow { margin: 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #7dd3fc; }
    h1 { margin: 8px 0 8px; font-family: "Playfair Display", Georgia, serif; font-size: 2rem; color: #fff; }
    .subtitle { margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.5; }
    label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 500; color: #cbd5e1; }
    input {
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 16px;
      color: #f8fafc;
      background: rgba(15, 23, 42, 0.8);
      outline: none;
    }
    input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); }
    button {
      width: 100%;
      margin-top: 16px;
      border: 0;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, #0284c7, #0369a1);
      cursor: pointer;
    }
    button:hover { filter: brightness(1.05); }
    .error {
      margin: 0 0 16px;
      padding: 10px 12px;
      border-radius: 10px;
      font-size: 13px;
      color: #fecaca;
      background: rgba(127, 29, 29, 0.35);
      border: 1px solid rgba(248, 113, 113, 0.35);
    }
    .back { display: inline-block; margin-top: 20px; font-size: 13px; color: #64748b; text-decoration: none; }
    .back:hover { color: #cbd5e1; }
  </style>
</head>
<body>
  <main class="card">
    <p class="eyebrow">Private planner</p>
    <h1>Alaska Trip 2026</h1>
    <p class="subtitle">This itinerary is password-protected for family use only.</p>
    ${errorHtml}
    <form method="post" action="/alaskatrip/auth">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
      <button type="submit">Continue</button>
    </form>
    <a class="back" href="https://bennettwells.net/">← bennettwells.net</a>
  </main>
</body>
</html>`;
}

async function handleAlaskaAuth(request, env) {
  const url = new URL(request.url);
  const password = env.ALASKA_TRIP_PASSWORD;

  if (!password) {
    return new Response('Alaska Trip password is not configured.', { status: 503 });
  }

  const expected = await authToken(password);
  const cookie = getCookie(request, COOKIE_NAME);

  if (url.pathname === '/alaskatrip/auth' && request.method === 'POST') {
    let submitted = '';
    const contentType = request.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      submitted = body.password || '';
    } else {
      const form = await request.formData();
      submitted = form.get('password') || '';
    }

    if (!safeEqual(String(submitted), password)) {
      if (contentType.includes('application/json')) {
        return new Response(JSON.stringify({ error: 'Invalid password' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(loginPage('Incorrect password. Please try again.'), {
        status: 401,
        headers: { 'Content-Type': 'text/html; charset=UTF-8' },
      });
    }

    const headers = new Headers({
      Location: '/alaskatrip/',
      'Set-Cookie': `${COOKIE_NAME}=${expected}; Path=${COOKIE_PATH}; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`,
    });

    if (contentType.includes('application/json')) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': headers.get('Set-Cookie'),
        },
      });
    }

    return new Response(null, { status: 302, headers });
  }

  if (safeEqual(cookie || '', expected)) {
    return env.ASSETS.fetch(request);
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response(loginPage(), {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=UTF-8' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (isProtectedPath(url.pathname)) {
      return handleAlaskaAuth(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};