import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

const templatePath = path.join(__dirname, 'og-template.html');
const outputPath = path.join(frontendDir, 'public', 'og.png');

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const chromePath = chromeCandidates.find((p) => fs.existsSync(p));

if (!chromePath) {
  console.error('Chrome executable not found. Set CHROME_PATH environment variable.');
  process.exit(1);
}

// Convert template path to file:// URL
const fileUrl = `file:///${templatePath.replace(/\\/g, '/')}`;

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--hide-scrollbars',
  '--window-size=1200,630',
  `--screenshot=${outputPath}`,
  fileUrl,
];

console.log(`Generating OG image with Chrome at: ${chromePath}...`);
const result = spawnSync(chromePath, args);

if (result.error) {
  console.error('Failed to generate OG image:', result.error);
  process.exit(1);
}

if (!fs.existsSync(outputPath)) {
  console.error('Output OG image was not generated.');
  process.exit(1);
}

const stats = fs.statSync(outputPath);
const sizeKb = (stats.size / 1024).toFixed(2);
console.log(`✅ OG image generated at ${outputPath}: ${sizeKb} kB`);

if (stats.size > 150 * 1024) {
  console.warn(`⚠️ Warning: OG image is larger than 150 kB (${sizeKb} kB).`);
} else {
  console.log(`✅ Size check passed: ${sizeKb} kB <= 150 kB target.`);
}
