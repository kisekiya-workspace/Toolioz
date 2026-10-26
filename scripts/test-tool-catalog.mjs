import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';
import { segmentDestination } from './normalize-static-export.mjs';

const root = process.cwd();
assert.equal(segmentDestination('tools/word-counter/__next.tools/word-counter/__PAGE__.txt'), 'tools/word-counter/__next.tools.word-counter.__PAGE__.txt');
assert.equal(segmentDestination('tools\\__next.tools\\__PAGE__.txt'), 'tools/__next.tools.__PAGE__.txt');
assert.equal(segmentDestination('tools/__next._tree.txt'), null);
const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const mod = new Module(file);
  cache.set(file, mod);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  const nativeRequire = createRequire(file);
  mod.require = (id) => {
    if (!id.startsWith('@/') && !id.startsWith('.')) return nativeRequire(id);
    const base = id.startsWith('@/') ? path.resolve(root, 'src', id.slice(2)) : path.resolve(path.dirname(file), id);
    const target = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    return target && /\.tsx?$/.test(target) ? load(target) : nativeRequire(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText, file);
  return mod.exports;
}
const { PUBLIC_TOOLS, isAdSenseEligiblePath } = load(path.join(root, 'src/lib/tools.ts'));
const { TOOL_ALIASES, PAUSED_TOOL_PATHS, WITHHELD_TOOL_PATHS, CHANGING_RULES_NOINDEX_PATHS, canonicalToolPath } = load(path.join(root, 'src/lib/tool-routes.ts'));
const { buildPageMetadata } = load(path.join(root, 'src/lib/seo.ts'));
const redirects = new Map(fs.readFileSync('public/_redirects', 'utf8').split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#')).map(line => { const [from, to, code] = line.trim().split(/\s+/); return [from, { to, code }]; }));
const paths = new Set(PUBLIC_TOOLS.map(tool => tool.href));
assert.equal(paths.size, PUBLIC_TOOLS.length, 'Duplicate tool URLs');
assert.equal(new Set(PUBLIC_TOOLS.map(tool => tool.id)).size, PUBLIC_TOOLS.length, 'Duplicate IDs');
for (const [from, to] of Object.entries(TOOL_ALIASES)) {
  if (CHANGING_RULES_NOINDEX_PATHS?.has(to)) {
    assert(!paths.has(from), `Alias still listed: ${from}`);
    assert(!TOOL_ALIASES[to], `Redirect chain: ${from}`);
    assert.deepEqual(redirects.get(from), { to, code: '301' });
    assert.equal(canonicalToolPath(`${from}/`), to);
    continue;
  }
  assert(paths.has(to), `Missing canonical target ${to}`);
  assert(!paths.has(from), `Alias still listed: ${from}`);
  assert(!TOOL_ALIASES[to], `Redirect chain: ${from}`);
  assert.deepEqual(redirects.get(from), { to, code: '301' });
  assert.equal(buildPageMetadata({ title: 'Example | Toolioz', description: 'Example', path: from }).alternates.canonical, `https://toolioz.com${to}`);
  assert.equal(canonicalToolPath(`${from}/`), to);
}
for (const url of ['/finance/lumpsum-calculator', '/finance/fd-calculator', '/finance/car-loan', '/finance/retirement-corpus', '/finance/percentage-change-calculator', '/pdftools/split-pdf', '/pdftools/pdf-to-image', '/design/background-remover', '/devtools/html-encoder-decoder', '/devtools/slug-generator', '/devtools/chmod-calculator', '/devtools/color-contrast-checker', '/devtools/csv-json-converter']) {
  assert(paths.has(url), `Distinct tool missing: ${url}`);
  assert(!redirects.has(url), `Distinct tool redirected: ${url}`);
}
for (const url of ['/finance/grade-percentage-calculator', '/finance/win-percentage-calculator', '/finance/weight-loss-percentage-calculator', '/finance/body-fat-percentage-calculator', '/finance/average-percentage-calculator']) {
  assert(!paths.has(url), `Duplicate percentage variant still listed: ${url}`);
}
for (const url of [...PAUSED_TOOL_PATHS, ...WITHHELD_TOOL_PATHS, ...(CHANGING_RULES_NOINDEX_PATHS ?? [])]) {
  assert(!paths.has(url));
  assert.equal(buildPageMetadata({ title: 'Paused', description: 'Paused', path: url }).robots.index, false);
  assert.equal(isAdSenseEligiblePath(url), false);
}
assert.equal(isAdSenseEligiblePath('/tools/word-counter'), false);
assert.equal(isAdSenseEligiblePath('/devtools/json-schema-validator'), false);
const { minify } = require('terser');
const source = 'const text = "/* keep */ https://example.com/a = b"; function test() { return\n{ value: 1 }; }';
const result = await minify(source, { compress: false, mangle: false });
assert(result.code.includes('/* keep */ https://example.com/a = b'));
assert.match(result.code, /return;/, 'Automatic semicolon insertion must be preserved');
await assert.rejects(minify('const = broken'));
const engines = load(path.join(root, 'src/lib/workbench-engines.ts'));
assert.equal(engines.encodeHtmlEntities('Tom & Jerry <b>'), 'Tom &amp; Jerry &lt;b&gt;');
assert.equal(engines.decodeHtmlEntities('Tom &amp; Jerry &lt;b&gt;'), 'Tom & Jerry <b>');
assert.equal(engines.slugify('Café Menu 2026'), 'cafe-menu-2026');
assert.equal(engines.chmodFromBits(engines.DEFAULT_CHMOD_BITS).octal, '755');
assert.equal(engines.chmodFromBits(engines.bitsFromOctal('644')).symbolic, 'rw-r--r--');
assert.ok(engines.contrastRatio('#111111', '#ffffff').aaaNormal);
assert.equal(JSON.parse(engines.csvToJson('name,active\nToolioz,true'))[0].name, 'Toolioz');
assert.match(engines.jsonToCsv('[{"name":"Toolioz","active":true}]'), /name,active/);
console.log(`Catalog passed: ${PUBLIC_TOOLS.length} distinct tools, ${Object.keys(TOOL_ALIASES).length} permanent aliases; parser regressions passed.`);

if (process.argv.includes('--export')) {
  const xml = fs.readFileSync('out/sitemap.xml', 'utf8');
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
  for (const toolPath of paths) assert(urls.includes(`https://toolioz.com${toolPath}`), `Tool missing from sitemap: ${toolPath}`);
  for (const toolPath of [...Object.keys(TOOL_ALIASES), ...PAUSED_TOOL_PATHS]) assert(!urls.includes(`https://toolioz.com${toolPath}`), `Noncanonical sitemap URL: ${toolPath}`);
  const titles = new Set();
  let schemaCount = 0;
  let linkCount = 0;
  const failures = [];
  function exportedFile(urlPath) {
    const safe = decodeURIComponent(urlPath).replace(/\/$/, '');
    return [path.join(root, 'out', `${safe || '/index'}.html`), path.join(root, 'out', safe, 'index.html')].find(file => fs.existsSync(file));
  }
  for (const [from, to] of Object.entries(TOOL_ALIASES)) {
    const file = exportedFile(from);
    assert(file, `Missing alias fallback page: ${from}`);
    const canonical = fs.readFileSync(file, 'utf8').match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical, `https://toolioz.com${to}`, `Alias fallback canonical mismatch: ${from}`);
  }
  function checkSegments(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) checkSegments(file);
      else {
        const destination = segmentDestination(path.relative(path.join(root, 'out'), file));
        if (destination) assert(fs.readFileSync(file).equals(fs.readFileSync(path.join(root, 'out', destination))), `Missing normalized navigation asset: ${destination}`);
      }
    }
  }
  checkSegments(path.join(root, 'out'));
  for (const url of urls) {
    try {
    const urlPath = new URL(url).pathname;
    const file = exportedFile(urlPath);
    assert(file, `No exported page: ${url}`);
    const html = fs.readFileSync(file, 'utf8');
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert(title, `No title: ${url}`);
    assert(!titles.has(title), `Duplicate title: ${title}`);
    titles.add(title);
    assert.equal((title.match(/Toolioz/g) ?? []).length, 1, `Repeated brand: ${url}`);
    assert.match(html, /<meta name="description" content="[^"]+"/, `Missing description: ${url}`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical?.replace(/\/$/, ''), url.replace(/\/$/, ''), `Canonical mismatch: ${url}`);
    assert(!/<meta name="robots" content="[^"]*noindex/.test(html), `Sitemap page has noindex: ${url}`);
    const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    assert((body.match(/<h1\b/g) ?? []).length >= 1, `Missing main heading: ${url}`);
    if (paths.has(urlPath) && urlPath !== '/biodata' && urlPath !== '/resume-builder') assert.match(body, /<footer\b/, `Missing footer: ${url}`);
    for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) { JSON.parse(match[1]); schemaCount++; }
    for (const match of body.matchAll(/<a\b[^>]*href="(\/[^"?#]*)[^"]*"/g)) {
      const href = match[1];
      if (href.startsWith('//') || /\.[a-z\d]+$/i.test(href)) continue;
      assert(exportedFile(href) || redirects.has(href), `Broken local link ${href} from ${url}`);
      linkCount++;
    }
    } catch (error) { failures.push(error.message); }
  }
  assert.equal(failures.length, 0, failures.join('\n'));
  console.log(`Export passed: ${urls.length} sitemap pages, unique titles/canonicals, ${schemaCount} valid JSON-LD blocks, ${linkCount} local links checked.`);
}

if (process.argv.includes('--http')) {
  for (const [from, to] of Object.entries(TOOL_ALIASES)) {
    const response = await fetch(`http://127.0.0.1:8787${from}`, { redirect: 'manual' });
    assert.equal(response.status, 301, `Expected 301: ${from}`);
    assert.equal(new URL(response.headers.get('location'), 'http://127.0.0.1:8787').pathname, to);
    const target = await fetch(`http://127.0.0.1:8787${to}`);
    assert.equal(target.status, 200, `Redirect destination unavailable: ${to}`);
  }
  console.log(`HTTP passed: all ${Object.keys(TOOL_ALIASES).length} aliases return 301 with successful canonical destinations.`);
}
