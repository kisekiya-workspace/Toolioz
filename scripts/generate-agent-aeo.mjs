import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';
import { renderLlmsTxt } from '@dualmark/core';

const root = process.cwd();
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
  mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 }
  }).outputText, file);
  return mod.exports;
}

const { PUBLIC_TOOLS } = load(path.join(root, 'src/lib/tools.ts'));
const { WORKBENCH_GUIDES } = load(path.join(root, 'src/lib/tool-workbench-guides.ts'));

const SITE_URL = 'https://toolioz.com';

function getGuideForTool(tool) {
  const slug = tool.href.split('/').filter(Boolean).pop();
  return WORKBENCH_GUIDES[slug] || null;
}

// 1. Group tools for llms.txt
const categoryBuckets = {
  pdftools: {
    title: 'PDF Document Utilities (100% Client-Side, No File Uploads)',
    description: 'Local PDF manipulation using pdf-lib and pdfjs-dist. All processing occurs in the browser memory.',
    links: []
  },
  devtools: {
    title: 'Developer, Data & Subtitle Utilities',
    description: 'Formatters, encoders, converters (JSON, CSV, KML, GPX, XML, TypeScript), and WebVTT caption utilities.',
    links: []
  },
  finance: {
    title: 'Financial Engineering & Investment Calculators',
    description: 'Client-side calculators for SIP, compound interest, mortgage prepayment, and financial planning.',
    links: []
  },
  design: {
    title: 'Design, Canvas & Creative Utilities',
    description: 'In-browser graphics tools, retro dithering, 16:9 split triptychs, and drawing canvases.',
    links: []
  },
  utility: {
    title: 'Everyday Identity & Document Utilities',
    description: 'Marriage biodata builders, ATS resume generators, unit converters, and text utilities.',
    links: []
  }
};

for (const tool of PUBLIC_TOOLS) {
  const bucketKey = categoryBuckets[tool.category] ? tool.category : 'utility';
  categoryBuckets[bucketKey].links.push({
    title: tool.title,
    href: `${SITE_URL}${tool.href}`,
    description: tool.desc
  });
}

const llmsTxtContent = renderLlmsTxt({
  brandName: 'Toolioz — Developer Utilities, PDF Tools & Financial Calculators',
  description: 'Toolioz (https://toolioz.com) is a privacy-first web utility suite. All PDF manipulation, cryptographic hashing, data conversion, and financial calculations run 100% client-side in the user\'s browser using WebAssembly, Web Workers, and HTML5 Canvas. Zero user files, inputs, or personal documents are uploaded to or stored on servers.',
  sections: [
    categoryBuckets.pdftools,
    categoryBuckets.devtools,
    categoryBuckets.finance,
    categoryBuckets.design,
    categoryBuckets.utility,
    {
      title: 'Site Specifications & Agent Endpoints',
      description: 'Machine-readable manifests and alternate endpoints for AI assistants, LLMs, and research agents.',
      links: [
        { title: 'Full LLMs Documentation', href: `${SITE_URL}/llms-full.txt`, description: 'Comprehensive markdown knowledge base with formulas and workflows' },
        { title: 'Sitemap XML', href: `${SITE_URL}/sitemap.xml`, description: 'Canonical URL sitemap index' },
        { title: 'Privacy Policy', href: `${SITE_URL}/privacy-policy`, description: 'Privacy guarantees and client-side processing architecture' }
      ]
    }
  ]
});

fs.writeFileSync(path.join(root, 'public/llms.txt'), llmsTxtContent, 'utf8');
console.log('✓ public/llms.txt generated with @dualmark/core');

// 2. Generate llms-full.txt
const fullSections = [
  '# Toolioz — Comprehensive Machine-Readable Knowledge Base',
  '',
  '> Privacy-first client-side web utility platform. All operations execute strictly inside browser memory using Web Workers, HTML5 Canvas 2D, and WebAssembly. No server storage or file transmission occurs during tool execution.',
  '',
  '## Architecture & Privacy Model',
  '- **Zero Server Uploads**: PDF manipulation (splitting, merging, blank page removal, bookmarks, grayscale, booklet generation) is handled entirely by client-side JavaScript (`pdf-lib` and `pdfjs-dist`).',
  '- **Data Privacy**: Cryptographic hashing (BCrypt, SHA, MD5), data transformation (CSV, JSON, KML, GPX, XML, TypeScript), and JWT decoding never send user inputs to external endpoints.',
  '- **Formula Accuracy**: Mathematical calculations (SIP, Compound Interest, Loan Prepayment) implement standard financial engineering formulas without server roundtrips.',
  '',
  '---',
  '',
  '## Complete Catalog of Available Tools & Workflows',
  ''
];

for (const tool of PUBLIC_TOOLS) {
  const guide = getGuideForTool(tool);
  const toolUrl = `${SITE_URL}${tool.href}`;
  const mdUrl = `${SITE_URL}${tool.href}.md`;
  
  fullSections.push(`### ${tool.title}`);
  fullSections.push(`- **Canonical URL**: ${toolUrl}`);
  fullSections.push(`- **Markdown Endpoint**: ${mdUrl}`);
  fullSections.push(`- **Category**: ${tool.category}`);
  fullSections.push(`- **Description**: ${tool.desc}`);
  fullSections.push(`- **Processing Mode**: 100% Client-Side In-Browser`);
  
  if (guide) {
    fullSections.push('');
    fullSections.push('**Usage Steps**:');
    guide.steps.forEach((step, idx) => fullSections.push(`${idx + 1}. ${step}`));
    fullSections.push('');
    fullSections.push(`**Practical Example**: ${guide.example}`);
    fullSections.push('');
    fullSections.push(`**Constraints / Limitations**: ${guide.limitation}`);
  }
  
  fullSections.push('');
  fullSections.push('---');
  fullSections.push('');
}

fs.writeFileSync(path.join(root, 'public/llms-full.txt'), fullSections.join('\n'), 'utf8');
console.log('✓ public/llms-full.txt generated');

// 3. Generate static .md files for each tool in out/ (if out exists) and public/markdown-endpoints
const outDir = path.join(root, 'out');
let countMd = 0;

for (const tool of PUBLIC_TOOLS) {
  const guide = getGuideForTool(tool);
  const toolUrl = `${SITE_URL}${tool.href}`;
  
  const toolMd = [
    `# ${tool.title}`,
    '',
    `> ${tool.desc}`,
    '',
    `- **URL**: ${toolUrl}`,
    `- **Category**: ${tool.category}`,
    `- **Privacy**: 100% Client-Side In-Browser. No data or files are sent to any server.`,
    ''
  ];
  
  if (guide) {
    toolMd.push('## How to Use');
    guide.steps.forEach((step, idx) => toolMd.push(`${idx + 1}. ${step}`));
    toolMd.push('');
    toolMd.push('## Practical Example');
    toolMd.push(guide.example);
    toolMd.push('');
    toolMd.push('## Limitations');
    toolMd.push(guide.limitation);
    toolMd.push('');
  }
  
  toolMd.push('---');
  toolMd.push(`Toolioz — Free client-side tools and calculators. [View tool online](${toolUrl})`);
  
  const content = toolMd.join('\n');
  
  if (fs.existsSync(outDir)) {
    const relativeClean = tool.href.replace(/^\//, '');
    const targetFile = path.join(outDir, `${relativeClean}.md`);
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, content, 'utf8');
    countMd++;
  }
}

if (fs.existsSync(outDir)) {
  fs.copyFileSync(path.join(root, 'public/llms.txt'), path.join(outDir, 'llms.txt'));
  fs.copyFileSync(path.join(root, 'public/llms-full.txt'), path.join(outDir, 'llms-full.txt'));
  console.log(`✓ ${countMd} companion .md endpoints generated in out/`);
}
