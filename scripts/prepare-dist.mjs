/**
 * Copy site files into dist/ excluding VCS and local junk.
 * Use as Workers/Pages build command if output directory is set to dist/.
 */
import { cpSync, rmSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

const exclude = new Set([
  '.git',
  'dist',
  'node_modules',
  '.claude',
  'scripts',
  'functions',
  'package.json',
  'package-lock.json',
  'wrangler.toml',
  '.assetsignore',
  '.gitignore',
  '.DS_Store',
  '.env',
]);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const name of readdirSync(root)) {
  if (exclude.has(name)) continue;
  // Allow .well-known only among dot-directories
  if (name.startsWith('.') && name !== '.well-known') continue;
  const from = join(root, name);
  const to = join(dist, name);
  cpSync(from, to, { recursive: true });
}

// Ensure functions run from project root in Pages; dist is assets-only here.
writeFileSync(join(dist, '.assetsignore'), ['.git', '.git/**', '.DS_Store', '.env', '.env.*'].join('\n') + '\n');

// Force /family-tree through Pages Functions (static assets alone skip middleware).
// Must live in the build output directory for Cloudflare to pick it up.
writeFileSync(
  join(dist, '_routes.json'),
  JSON.stringify(
    {
      version: 1,
      include: ['/family-tree', '/family-tree/*'],
      exclude: [],
    },
    null,
    2,
  ) + '\n',
);

console.log('Prepared dist/ without .git and other sensitive paths');
const entries = readdirSync(dist);
console.log(`dist entries (${entries.length}):`, entries.slice(0, 20).join(', '), entries.length > 20 ? '...' : '');
