// Isolated frontend verification server. Never connects to the live backend.
import http from 'node:http';
import { readFile, appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { projects, github } from '../e2e/fixtures/preview-api.js';

const root = path.resolve('dist');
const evidence = path.resolve('playwright-report/preview');
await mkdir(evidence, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml' };
http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
  if (pathname.startsWith('/api/')) {
    const data = pathname === '/api/projects' ? { data: projects }
      : pathname === '/api/analytics/github' ? { data: github } : { success: true };
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
    await appendFile(path.join(evidence, 'mock-api.jsonl'), JSON.stringify({ time: new Date().toISOString(), method: req.method, pathname, status: 200 }) + '\n');
    return;
  }
  try {
    const candidate = path.resolve(root, '.' + decodeURIComponent(pathname));
    if (!candidate.startsWith(root + path.sep) && candidate !== root) throw new Error('Invalid path');
    const file = path.extname(candidate) ? candidate : path.join(root, 'index.html');
    const body = await readFile(file);
    const compress = /\bgzip\b/.test(req.headers['accept-encoding'] || '') && /\.(html|js|css|txt|xml|svg)$/.test(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': file.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-store',
      ...(compress ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}) });
    res.end(compress ? gzipSync(body) : body);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(4175, '127.0.0.1', () => console.log('Isolated production build + successful API fixtures: http://127.0.0.1:4175'));

