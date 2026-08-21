'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Copy, Download, Plus, Search, Trash2, WandSparkles } from 'lucide-react';
import yaml from 'js-yaml';
import type { NewToolDefinition } from '@/lib/new-tool-catalog';
import { ToolWorkbench, areaClass, downloadBlob, fieldClass, primaryButtonClass, secondaryButtonClass } from './ToolWorkbench';

type Pair = { first: string; second: string };
type SchemaKind = 'FAQPage' | 'HowTo' | 'Product';

const HTTP_CODES = [
  [100, 'Continue', 'Server received the request headers; the client may send the body.'], [101, 'Switching Protocols', 'Server is switching to the requested protocol.'],
  [200, 'OK', 'The request succeeded.'], [201, 'Created', 'The request succeeded and created a resource.'], [202, 'Accepted', 'The request was accepted for asynchronous processing.'], [204, 'No Content', 'The request succeeded without a response body.'], [206, 'Partial Content', 'The response contains the requested byte range.'],
  [301, 'Moved Permanently', 'The resource has a permanent new URL.'], [302, 'Found', 'The resource is temporarily available at another URL.'], [304, 'Not Modified', 'The cached representation is still valid.'], [307, 'Temporary Redirect', 'Temporary redirect that preserves the HTTP method.'], [308, 'Permanent Redirect', 'Permanent redirect that preserves the HTTP method.'],
  [400, 'Bad Request', 'The server could not understand the request.'], [401, 'Unauthorized', 'Authentication is required or invalid.'], [403, 'Forbidden', 'The server understood but refuses the request.'], [404, 'Not Found', 'The requested resource was not found.'], [405, 'Method Not Allowed', 'The HTTP method is unsupported for this resource.'], [408, 'Request Timeout', 'The server timed out waiting for the request.'], [409, 'Conflict', 'The request conflicts with the current resource state.'], [410, 'Gone', 'The resource is intentionally no longer available.'], [415, 'Unsupported Media Type', 'The request payload format is unsupported.'], [422, 'Unprocessable Content', 'The request is syntactically valid but semantically invalid.'], [429, 'Too Many Requests', 'The client exceeded a rate limit.'],
  [500, 'Internal Server Error', 'The server encountered an unexpected condition.'], [501, 'Not Implemented', 'The server does not support the required functionality.'], [502, 'Bad Gateway', 'A gateway received an invalid upstream response.'], [503, 'Service Unavailable', 'The server is temporarily unavailable.'], [504, 'Gateway Timeout', 'A gateway timed out waiting for an upstream response.'],
] as const;

const MIME_TYPES = [
  ['.aac', 'audio/aac'], ['.avif', 'image/avif'], ['.bin', 'application/octet-stream'], ['.bmp', 'image/bmp'], ['.css', 'text/css'], ['.csv', 'text/csv'], ['.doc', 'application/msword'], ['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], ['.eot', 'application/vnd.ms-fontobject'], ['.epub', 'application/epub+zip'], ['.gif', 'image/gif'], ['.gz', 'application/gzip'], ['.htm / .html', 'text/html'], ['.ico', 'image/x-icon'], ['.ics', 'text/calendar'], ['.jar', 'application/java-archive'], ['.jpeg / .jpg', 'image/jpeg'], ['.js / .mjs', 'text/javascript'], ['.json', 'application/json'], ['.jsonld', 'application/ld+json'], ['.mp3', 'audio/mpeg'], ['.mp4', 'video/mp4'], ['.mpeg', 'video/mpeg'], ['.odp', 'application/vnd.oasis.opendocument.presentation'], ['.ods', 'application/vnd.oasis.opendocument.spreadsheet'], ['.odt', 'application/vnd.oasis.opendocument.text'], ['.oga', 'audio/ogg'], ['.ogv', 'video/ogg'], ['.pdf', 'application/pdf'], ['.png', 'image/png'], ['.ppt', 'application/vnd.ms-powerpoint'], ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'], ['.rar', 'application/vnd.rar'], ['.rtf', 'application/rtf'], ['.svg', 'image/svg+xml'], ['.tar', 'application/x-tar'], ['.tif / .tiff', 'image/tiff'], ['.ts', 'video/mp2t'], ['.txt', 'text/plain'], ['.wav', 'audio/wav'], ['.webm', 'video/webm'], ['.webp', 'image/webp'], ['.woff', 'font/woff'], ['.woff2', 'font/woff2'], ['.xhtml', 'application/xhtml+xml'], ['.xls', 'application/vnd.ms-excel'], ['.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'], ['.xml', 'application/xml'], ['.zip', 'application/zip'],
] as const;

function prettyXml(xml: string) {
  const parsed = new DOMParser().parseFromString(xml, 'application/xml');
  const parserError = parsed.querySelector('parsererror');
  if (parserError) throw new Error(parserError.textContent?.replace(/\s+/g, ' ').trim() || 'Invalid XML.');
  const serialized = new XMLSerializer().serializeToString(parsed).replace(/>\s*</g, '><');
  let indent = 0;
  return serialized.replace(/(<[^>]+>)/g, '$1\n').trim().split('\n').map((line) => {
    if (/^<\//.test(line)) indent = Math.max(0, indent - 1);
    const result = `${'  '.repeat(indent)}${line}`;
    if (/^<[^!?/][^>]*[^/]?>$/.test(line) && !line.includes('</')) indent += 1;
    return result;
  }).join('\n');
}

function schemaScript(value: object) {
  return `<script type="application/ld+json">\n${JSON.stringify(value, null, 2).replace(/</g, '\\u003c')}\n</script>`;
}

export default function DeveloperUtilityClient({ tool }: { tool: NewToolDefinition }) {
  const mode = tool.mode;
  const [input, setInput] = useState(mode === 'yaml-json' ? 'name: Toolioz\nprivate: true\ntags:\n  - converter\n  - browser' : mode === 'xml' ? '<catalog><tool id="1">Formatter</tool></catalog>' : '{\n  "name": "Toolioz",\n  "active": true\n}');
  const [secondInput, setSecondInput] = useState('{\n  "$schema": "https://json-schema.org/draft/2020-12/schema",\n  "type": "object",\n  "required": ["name"],\n  "properties": { "name": { "type": "string" }, "active": { "type": "boolean" } }\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<'yaml-json' | 'json-yaml'>('yaml-json');
  const [baseUrl, setBaseUrl] = useState('https://example.com/landing-page');
  const [utm, setUtm] = useState({ source: 'newsletter', medium: 'email', campaign: 'summer_launch', term: '', content: '' });
  const [userAgent, setUserAgent] = useState('*');
  const [disallow, setDisallow] = useState('/admin\n/private');
  const [allow, setAllow] = useState('');
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const [pairs, setPairs] = useState<Pair[]>(mode.includes('hreflang') ? [{ first: 'en', second: 'https://example.com/en/page' }, { first: 'fr', second: 'https://example.com/fr/page' }] : [{ first: 'What is this tool?', second: 'It creates valid JSON-LD in your browser.' }]);
  const initialKind: SchemaKind = mode === 'howto-schema' ? 'HowTo' : mode === 'product-schema' ? 'Product' : 'FAQPage';
  const [schemaKind, setSchemaKind] = useState<SchemaKind>(initialKind);
  const [schemaFields, setSchemaFields] = useState({ name: 'How to use Toolioz', description: 'A short step-by-step guide.', image: '', brand: 'Toolioz', sku: 'SKU-001', price: '49.99', currency: 'USD', availability: 'https://schema.org/InStock', url: 'https://example.com/product' });

  const lookupRows = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (mode === 'http-status') return HTTP_CODES.filter((row) => row.join(' ').toLowerCase().includes(normalized));
    return MIME_TYPES.filter((row) => row.join(' ').toLowerCase().includes(normalized));
  }, [mode, query]);

  function setPair(index: number, key: keyof Pair, value: string) { setPairs((current) => current.map((pair, i) => i === index ? { ...pair, [key]: value } : pair)); }
  function copyOutput() { if (output) navigator.clipboard.writeText(output); }

  async function run() {
    setError('');
    try {
      if (mode === 'yaml-json') {
        setOutput(direction === 'yaml-json' ? JSON.stringify(yaml.load(input), null, 2) : yaml.dump(JSON.parse(input), { noRefs: true, lineWidth: 100 }));
      } else if (mode === 'xml') {
        setOutput(prettyXml(input));
      } else if (mode === 'json-schema') {
        const [{ default: Ajv }, data, schema] = await Promise.all([import('ajv/dist/2020'), Promise.resolve(JSON.parse(input)), Promise.resolve(JSON.parse(secondInput))]);
        const ajv = new Ajv({ allErrors: true, strict: false });
        const validate = ajv.compile(schema);
        const valid = validate(data);
        setOutput(valid ? '✓ Valid — the JSON data matches the schema.' : (validate.errors || []).map((item) => `${item.instancePath || '/'} ${item.message || 'is invalid'}`).join('\n'));
      } else if (mode === 'utm') {
        const url = new URL(baseUrl);
        const values = [['utm_source', utm.source], ['utm_medium', utm.medium], ['utm_campaign', utm.campaign], ['utm_term', utm.term], ['utm_content', utm.content]];
        values.forEach(([key, value]) => { if (value.trim()) url.searchParams.set(key, value.trim()); else url.searchParams.delete(key); });
        if (!utm.source || !utm.medium || !utm.campaign) throw new Error('Source, medium, and campaign are required.');
        setOutput(url.toString());
      } else if (mode === 'robots') {
        const lines = [`User-agent: ${userAgent || '*'}`, ...allow.split('\n').map((v) => v.trim()).filter(Boolean).map((v) => `Allow: ${v.startsWith('/') ? v : `/${v}`}`), ...disallow.split('\n').map((v) => v.trim()).filter(Boolean).map((v) => `Disallow: ${v.startsWith('/') ? v : `/${v}`}`)];
        if (sitemap.trim()) { new URL(sitemap); lines.push('', `Sitemap: ${sitemap.trim()}`); }
        setOutput(lines.join('\n'));
      } else if (mode === 'hreflang') {
        const valid = pairs.filter((pair) => pair.first.trim() && pair.second.trim());
        if (valid.length < 2) throw new Error('Add at least two language/URL alternatives.');
        valid.forEach((pair) => new URL(pair.second));
        setOutput(valid.map((pair) => `<link rel="alternate" hreflang="${pair.first.trim()}" href="${pair.second.trim()}" />`).join('\n'));
      } else if (mode.includes('schema')) {
        const kind = mode === 'schema' ? schemaKind : initialKind;
        let value: object;
        if (kind === 'FAQPage') {
          const questions = pairs.filter((pair) => pair.first.trim() && pair.second.trim());
          if (!questions.length) throw new Error('Add at least one complete question and answer.');
          value = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions.map((pair) => ({ '@type': 'Question', name: pair.first.trim(), acceptedAnswer: { '@type': 'Answer', text: pair.second.trim() } })) };
        } else if (kind === 'HowTo') {
          const steps = pairs.filter((pair) => pair.second.trim());
          if (!schemaFields.name.trim() || !steps.length) throw new Error('Add a guide name and at least one step.');
          value = { '@context': 'https://schema.org', '@type': 'HowTo', name: schemaFields.name.trim(), description: schemaFields.description.trim() || undefined, image: schemaFields.image.trim() || undefined, step: steps.map((pair, index) => ({ '@type': 'HowToStep', position: index + 1, name: pair.first.trim() || `Step ${index + 1}`, text: pair.second.trim() })) };
        } else {
          if (!schemaFields.name || !schemaFields.price || !schemaFields.currency) throw new Error('Product name, price, and currency are required.');
          value = { '@context': 'https://schema.org', '@type': 'Product', name: schemaFields.name.trim(), description: schemaFields.description.trim() || undefined, image: schemaFields.image.trim() || undefined, sku: schemaFields.sku.trim() || undefined, brand: schemaFields.brand.trim() ? { '@type': 'Brand', name: schemaFields.brand.trim() } : undefined, offers: { '@type': 'Offer', url: schemaFields.url.trim() || undefined, priceCurrency: schemaFields.currency.trim().toUpperCase(), price: schemaFields.price.trim(), availability: schemaFields.availability } };
        }
        setOutput(schemaScript(value));
      }
    } catch (cause) { setOutput(''); setError(cause instanceof Error ? cause.message : 'The input is invalid.'); }
  }

  if (mode === 'http-status' || mode === 'mime') return <ToolWorkbench tool={tool}><div className="space-y-5"><div className="rounded-2xl bg-[var(--tool-accent)] p-4"><label className="relative block"><Search className="absolute left-4 top-3.5 text-[var(--tool-accent)]" size={19} /><input className={`${fieldClass} border-white pl-11`} placeholder={mode === 'http-status' ? 'Search 404, redirect, timeout…' : 'Search .pdf, image/jpeg, font…'} value={query} onChange={(e) => setQuery(e.target.value)} /></label><p className="mt-3 text-sm font-semibold text-white/80">{lookupRows.length} matching reference entries</p></div><div className="overflow-hidden rounded-2xl border border-[var(--tool-border)]"><table className="w-full text-left text-sm"><thead className="bg-[var(--tool-soft)] text-[var(--tool-accent-dark)]"><tr><th className="px-4 py-3">{mode === 'http-status' ? 'Code' : 'Extension'}</th><th className="px-4 py-3">{mode === 'http-status' ? 'Name' : 'MIME type'}</th>{mode === 'http-status' && <th className="hidden px-4 py-3 md:table-cell">Meaning</th>}</tr></thead><tbody>{lookupRows.map((row) => <tr key={String(row[0])} className="border-t border-slate-100 hover:bg-[var(--tool-soft)]"><td className="px-4 py-3 font-bold text-[var(--tool-accent-dark)]">{row[0]}</td><td className="break-all px-4 py-3 font-semibold text-slate-800">{row[1]}</td>{mode === 'http-status' && <td className="hidden px-4 py-3 text-slate-600 md:table-cell">{row[2]}</td>}</tr>)}</tbody></table></div></div></ToolWorkbench>;

  const pairLabels = mode === 'hreflang' ? ['Language code', 'Canonical URL'] : schemaKind === 'FAQPage' ? ['Question', 'Answer'] : ['Step name', 'Instruction'];
  return <ToolWorkbench tool={tool}><div className="space-y-6">
    {mode === 'yaml-json' && <div className="flex flex-wrap gap-2"><button className={direction === 'yaml-json' ? primaryButtonClass : secondaryButtonClass} onClick={() => setDirection('yaml-json')}>YAML → JSON</button><button className={direction === 'json-yaml' ? primaryButtonClass : secondaryButtonClass} onClick={() => setDirection('json-yaml')}>JSON → YAML</button></div>}
    {(mode === 'yaml-json' || mode === 'xml') && <label className="block text-sm font-bold">Input<textarea className={`${areaClass} mt-2`} value={input} onChange={(e) => setInput(e.target.value)} /></label>}
    {mode === 'json-schema' && <div className="grid gap-5 lg:grid-cols-2"><label className="text-sm font-bold">JSON data<textarea className={`${areaClass} mt-2`} value={input} onChange={(e) => setInput(e.target.value)} /></label><label className="text-sm font-bold">JSON Schema<textarea className={`${areaClass} mt-2`} value={secondInput} onChange={(e) => setSecondInput(e.target.value)} /></label></div>}
    {mode === 'utm' && <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold sm:col-span-2">Landing page URL<input className={`${fieldClass} mt-2`} value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} /></label>{Object.entries(utm).map(([key, value]) => <label key={key} className="text-sm font-bold capitalize">UTM {key}<input className={`${fieldClass} mt-2`} value={value} onChange={(e) => setUtm((current) => ({ ...current, [key]: e.target.value }))} /></label>)}</div>}
    {mode === 'robots' && <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">User-agent<input className={`${fieldClass} mt-2`} value={userAgent} onChange={(e) => setUserAgent(e.target.value)} /></label><label className="text-sm font-bold">Sitemap URL<input className={`${fieldClass} mt-2`} value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></label><label className="text-sm font-bold">Disallow paths (one per line)<textarea className={`${areaClass} mt-2 min-h-36`} value={disallow} onChange={(e) => setDisallow(e.target.value)} /></label><label className="text-sm font-bold">Allow paths (one per line)<textarea className={`${areaClass} mt-2 min-h-36`} value={allow} onChange={(e) => setAllow(e.target.value)} /></label></div>}
    {mode === 'schema' && <label className="block max-w-sm text-sm font-bold">Schema type<select className={`${fieldClass} mt-2`} value={schemaKind} onChange={(e) => { setSchemaKind(e.target.value as SchemaKind); setOutput(''); }}>{['FAQPage','HowTo','Product'].map((value) => <option key={value}>{value}</option>)}</select></label>}
    {mode.includes('schema') && (schemaKind === 'HowTo' || initialKind === 'HowTo' || schemaKind === 'Product' || initialKind === 'Product') && <div className="grid gap-4 sm:grid-cols-2">{Object.entries(schemaFields).filter(([key]) => (schemaKind === 'Product' || initialKind === 'Product') ? true : ['name','description','image'].includes(key)).map(([key, value]) => <label key={key} className="text-sm font-bold capitalize">{key}<input className={`${fieldClass} mt-2`} value={value} onChange={(e) => setSchemaFields((current) => ({ ...current, [key]: e.target.value }))} /></label>)}</div>}
    {(mode === 'hreflang' || mode.includes('schema') && (schemaKind !== 'Product' && initialKind !== 'Product')) && <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-lg font-black text-slate-900">{mode === 'hreflang' ? 'Language alternatives' : schemaKind === 'FAQPage' ? 'Questions and answers' : 'Steps'}</h2><button className={secondaryButtonClass} onClick={() => setPairs((current) => [...current, { first: '', second: '' }])}><Plus size={16} />Add row</button></div>{pairs.map((pair, index) => <div key={index} className="grid gap-2 rounded-2xl border border-[var(--tool-border)] bg-[var(--tool-soft)] p-3 sm:grid-cols-[1fr_2fr_auto]"><input aria-label={pairLabels[0]} placeholder={pairLabels[0]} className={fieldClass} value={pair.first} onChange={(e) => setPair(index, 'first', e.target.value)} /><input aria-label={pairLabels[1]} placeholder={pairLabels[1]} className={fieldClass} value={pair.second} onChange={(e) => setPair(index, 'second', e.target.value)} /><button className="rounded-xl p-3 text-rose-600 hover:bg-rose-50" aria-label="Remove row" onClick={() => setPairs((current) => current.filter((_, i) => i !== index))}><Trash2 size={18} /></button></div>)}</div>}
    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
    <button className={primaryButtonClass} onClick={run}><WandSparkles size={18} />{mode === 'json-schema' ? 'Validate JSON' : 'Generate result'}</button>
    {output && <div className="overflow-hidden rounded-2xl border border-[var(--tool-border)]"><div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--tool-accent)] px-4 py-3 text-white"><div className="flex items-center gap-2 font-bold">{mode === 'json-schema' && output.startsWith('✓') ? <CheckCircle2 size={18} /> : <WandSparkles size={18} />}Result ready</div><div className="flex flex-wrap gap-2"><button className="rounded-lg bg-white/15 px-3 py-2 text-sm font-bold hover:bg-white/25" onClick={copyOutput}><Copy className="mr-1 inline" size={16} />Copy</button><button className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[var(--tool-accent-dark)] hover:bg-[var(--tool-soft)]" onClick={() => downloadBlob(output, `${tool.slug}.${mode === 'robots' ? 'txt' : mode === 'xml' ? 'xml' : 'txt'}`, 'text/plain;charset=utf-8')}><Download className="mr-1 inline" size={16} />Download</button></div></div><textarea readOnly className={`${areaClass} min-h-64 !rounded-none !border-0 !bg-[var(--tool-soft)]`} value={output} /></div>}
  </div></ToolWorkbench>;
}
