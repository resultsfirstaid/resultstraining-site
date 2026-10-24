import fs from 'node:fs/promises';
import path from 'node:path';

const VERSION = 'v0.6.0';
const SHARED_FILES = [
  'tokens/foundations.css',
  'components/buttons.css',
  'components/library.css',
  'components/adoption.css',
  'components/adoption-v06.css'
];
const local = process.env.RESULTS_DESIGN_SYSTEM_LOCAL_DIR;
const styles = [];
for (const file of SHARED_FILES) {
  if (local) {
    styles.push(await fs.readFile(path.join(local, file), 'utf8'));
  } else {
    const url = `https://raw.githubusercontent.com/resultsfirstaid/results-design-system/${VERSION}/${file}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Shared Results library ${VERSION}/${file}: HTTP ${response.status}`);
    styles.push(await response.text());
  }
}
await fs.rm('dist', { recursive: true, force: true });
await fs.mkdir('dist/assets', { recursive: true });
await fs.copyFile('index.html', 'dist/index.html');
await fs.cp('assets', 'dist/assets', { recursive: true });
await fs.writeFile('dist/assets/results-shared.css', styles.join('\n\n'));
await fs.writeFile('dist/_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);
console.log(`Built Results Training parent website with Results Design System ${VERSION}.`);
