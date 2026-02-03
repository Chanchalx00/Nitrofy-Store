import { readFileSync, writeFileSync, existsSync } from 'fs';

console.log('Creating bundled worker file...');

const serverPath = 'dist/server/index.js';
if (!existsSync(serverPath)) {
  console.error(`Expected server bundle not found at ${serverPath}`);
  process.exit(1);
}

let serverCode = readFileSync(serverPath, 'utf-8');

serverCode = serverCode
  .replace(/export\s*\{\s*server\s+as\s+default\s*\}\s*;?/g, 'const __server = server;')
  .replace(/export\s+default\s+server\s*;?/g, 'const __server = server;')
  .replace(/export\s+default\s+(\w+)\s*;?/g, (m, p1) => `const __server = ${p1};`);

const workerCode = `
// Bundled server code
${serverCode}

const _server_export = typeof __server !== 'undefined' ? __server : (typeof server !== 'undefined' ? server : (typeof defaultExport !== 'undefined' ? defaultExport : null));

if (!_server_export || typeof _server_export.fetch !== 'function') {
  throw new Error('No server fetch handler found.');
}

// Cloudflare Pages Functions export
export default {
  async fetch(request, env, context) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Let Cloudflare Pages serve ALL static assets directly
      // This includes CSS, JS, images, fonts, SVGs, etc.
      if (
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/fonts/') ||
        pathname.startsWith('/images/') ||
        pathname.endsWith('.css') ||
        pathname.endsWith('.js') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.gif') ||
        pathname.endsWith('.webp') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.woff') ||
        pathname.endsWith('.woff2') ||
        pathname.endsWith('.ttf') ||
        pathname.endsWith('.eot')
      ) {
        return env.ASSETS.fetch(request);
      }

      // Handle SSR for everything else
      return await _server_export.fetch(request, env, context);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error: ' + (error?.message || String(error)), {
        status: 500,
        headers: {'Content-Type': 'text/plain'},
      });
    }
  },
};
`;

writeFileSync('dist/client/_worker.js', workerCode);
console.log('✓ Successfully created dist/client/_worker.js with enhanced asset handling');



// Also create _routes.json to specify routing rules
const routesConfig = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/assets/*",
    "/fonts/*",
    "/*.css",
    "/*.js",
    "/*.svg",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.gif",
    "/*.webp",
    "/*.ico",
    "/*.woff",
    "/*.woff2"
  ]
};

writeFileSync('dist/client/_routes.json', JSON.stringify(routesConfig, null, 2));
console.log('✓ Created _routes.json for asset routing');