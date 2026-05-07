import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const siteDir = join(root, '_site');

await rm(siteDir, { recursive: true, force: true });
await mkdir(siteDir, { recursive: true });

const demoSource = join(root, 'demo', 'index.html');
const html = await readFile(demoSource, 'utf8');
const pagesHtml = html
  .replaceAll('../dist/cdn.js', './dist/cdn.js')
  .replaceAll('../node_modules/alpinejs/dist/cdn.min.js', './vendor/alpinejs/cdn.min.js');

await writeFile(join(siteDir, 'index.html'), pagesHtml);
await writeFile(join(siteDir, 'demo.html'), pagesHtml);

await cp(join(root, 'demo', 'assets'), join(siteDir, 'assets'), { recursive: true });

await mkdir(join(siteDir, 'dist'), { recursive: true });
await cp(join(root, 'dist', 'cdn.js'), join(siteDir, 'dist', 'cdn.js'));

await mkdir(join(siteDir, 'vendor', 'alpinejs'), { recursive: true });
await cp(
  join(root, 'node_modules', 'alpinejs', 'dist', 'cdn.min.js'),
  join(siteDir, 'vendor', 'alpinejs', 'cdn.min.js')
);
