import { copyFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const indexPath = resolve(distDir, 'index.html');
const notFoundPath = resolve(distDir, '404.html');

await copyFile(indexPath, notFoundPath);
await writeFile(resolve(distDir, 'robots.txt'), 'User-agent: *\nAllow: /\n');
