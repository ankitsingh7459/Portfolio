import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

const scanTargets = [
  { dir: path.join(frontendDir, 'src'), checkFill: true, checkEmptyHref: true },
  { dir: path.join(frontendDir, 'public'), checkFill: true, checkEmptyHref: false },
  { file: path.join(frontendDir, 'index.html'), checkFill: true, checkEmptyHref: false },
  { file: path.join(frontendDir, 'scripts', 'og-template.html'), checkFill: true, checkEmptyHref: false },
];

const ignoredExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.pdf',
]);

const errors = [];

function checkFile(filePath, checkFill, checkEmptyHref) {
  const ext = path.extname(filePath).toLowerCase();
  if (ignoredExtensions.has(ext)) {
    return;
  }

  const isTestFile = filePath.includes('__tests__') || filePath.endsWith('.test.jsx') || filePath.endsWith('.test.js');

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    errors.push(`Could not read file: ${filePath} (${err.message})`);
    return;
  }

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    if (checkFill && line.includes('[FILL')) {
      errors.push(`[FILL placeholder] ${path.relative(frontendDir, filePath)}:${lineNum}: ${line.trim()}`);
    }
    if (checkEmptyHref && !isTestFile) {
      if (
        line.includes('href="#"') ||
        line.includes("href='#'") ||
        line.includes('href={"#"}') ||
        line.includes("href={'#'}")
      ) {
        errors.push(`[Empty href="#"] ${path.relative(frontendDir, filePath)}:${lineNum}: ${line.trim()}`);
      }
    }
  });
}

function walkDir(dirPath, checkFill, checkEmptyHref) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, checkFill, checkEmptyHref);
    } else if (entry.isFile()) {
      checkFile(fullPath, checkFill, checkEmptyHref);
    }
  }
}

for (const target of scanTargets) {
  if (target.file) {
    if (fs.existsSync(target.file)) {
      checkFile(target.file, target.checkFill, target.checkEmptyHref);
    }
  } else if (target.dir) {
    walkDir(target.dir, target.checkFill, target.checkEmptyHref);
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Release check failed with ${errors.length} issue(s):\n`);
  errors.forEach((err) => console.error(`  - ${err}`));
  console.error('\nPlease resolve all placeholders and empty href links before release.\n');
  process.exit(1);
} else {
  console.log('\n✅ Release check passed: No [FILL] placeholders or href="#" found.\n');
  process.exit(0);
}
