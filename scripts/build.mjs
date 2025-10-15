import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const outdir = 'dist';

await build({
  entryPoints: ['src/demo/index.tsx'],
  bundle: true,
  outfile: 'dist/assets/index.js',
  sourcemap: true,
  target: ['es2018'],
  format: 'esm',
  minify: true,
});

// Copy static HTML and CSS
const html = await readFile('src/index.html', 'utf8');
await mkdir(resolve(outdir), { recursive: true });
await writeFile(resolve(outdir, 'index.html'), html);

const css = await readFile('src/css/app.css', 'utf8');
await mkdir(resolve(outdir, 'css'), { recursive: true });
await writeFile(resolve(outdir, 'css/app.css'), css);

// Copy redirects if present
const redirects = await readFile('_redirects', 'utf8').catch(() => null);
if (redirects) {
  await writeFile(resolve(outdir, '_redirects'), redirects);
}
