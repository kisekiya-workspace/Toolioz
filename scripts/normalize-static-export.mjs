import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Next 16 on Windows can export __next.foo/bar/__PAGE__.txt while the browser
// requests __next.foo.bar.__PAGE__.txt. Normalize only generated segment assets.
// https://github.com/vercel/next.js/issues/92339
export function segmentDestination(relativeFile) {
  const parts = relativeFile.replaceAll('\\', '/').split('/');
  const index = parts.findIndex(part => part.startsWith('__next.'));
  if (index < 0 || index === parts.length - 1 || !relativeFile.endsWith('.txt')) return null;
  return [...parts.slice(0, index), parts.slice(index).join('.')].join('/');
}

export function normalizeExport(directory) {
  const root = path.resolve(directory);
  function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
  }
  let count = 0;
  for (const source of walk(root)) {
    const relative = path.relative(root, source);
    const normalized = segmentDestination(relative);
    if (!normalized) continue;
    const target = path.resolve(root, normalized);
    if (!target.startsWith(`${root}${path.sep}`)) throw new Error('Export target must remain inside out');
    if (fs.existsSync(target)) {
      if (!fs.readFileSync(source).equals(fs.readFileSync(target))) throw new Error(`Conflicting exported segment: ${normalized}`);
      continue;
    }
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    count++;
  }
  return count;
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  console.log(`Static export normalized: ${normalizeExport('out')} navigation assets added.`);
}
