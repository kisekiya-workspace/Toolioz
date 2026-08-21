'use client';

import React, { useMemo, useState } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeftRight, Check, Copy, TerminalSquare, AlertCircle } from 'lucide-react';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';

type OutputMode = 'fetch' | 'axios' | 'python';

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
  hasJsonBody: boolean;
}

function tokenizeCurl(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '\\' && next) {
      if (!quote && /\s/.test(next)) {
        i += 1;
        continue;
      }
      current += next;
      i += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      if (quote === char) {
        quote = null;
        continue;
      }
      if (!quote) {
        quote = char;
        continue;
      }
    }

    if (!quote && /\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current) tokens.push(current);
  return tokens;
}

function looksLikeJson(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return false;

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

function parseHeader(rawHeader: string): [string, string] | null {
  const separatorIndex = rawHeader.indexOf(':');
  if (separatorIndex <= 0) return null;

  const key = rawHeader.slice(0, separatorIndex).trim();
  const value = rawHeader.slice(separatorIndex + 1).trim();
  if (!key) return null;

  return [key, value];
}

function parseCurlCommand(input: string): ParsedCurl {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Paste a cURL command to convert.');

  const tokens = tokenizeCurl(trimmed);
  if (tokens.length === 0) throw new Error('Could not parse the command.');

  const firstToken = tokens[0].toLowerCase();
  const isCurlCommand = firstToken === 'curl' || firstToken.endsWith('curl.exe');
  if (!isCurlCommand) throw new Error('Command must start with `curl`.');

  let method = 'GET';
  let url = '';
  let explicitMethod = false;
  const headers: Record<string, string> = {};
  const bodyParts: string[] = [];

  const readNext = (index: number): string => {
    const value = tokens[index + 1];
    if (!value) throw new Error(`Missing value for ${tokens[index]}.`);
    return value;
  };

  for (let i = 1; i < tokens.length; i += 1) {
    const token = tokens[i];

    switch (token) {
      case '-X':
      case '--request': {
        method = readNext(i).toUpperCase();
        explicitMethod = true;
        i += 1;
        break;
      }
      case '-H':
      case '--header': {
        const parsedHeader = parseHeader(readNext(i));
        if (parsedHeader) {
          const [key, value] = parsedHeader;
          headers[key] = value;
        }
        i += 1;
        break;
      }
      case '--url': {
        url = readNext(i);
        i += 1;
        break;
      }
      case '-d':
      case '--data':
      case '--data-raw':
      case '--data-binary':
      case '--data-urlencode': {
        bodyParts.push(readNext(i));
        i += 1;
        break;
      }
      case '-I':
      case '--head': {
        method = 'HEAD';
        explicitMethod = true;
        break;
      }
      case '--get': {
        method = 'GET';
        explicitMethod = true;
        break;
      }
      case '--compressed':
      case '--insecure':
      case '--location':
      case '-L':
      case '--silent':
      case '-s':
      case '--include':
      case '-i':
      case '--http1.1':
      case '--http2':
      case '--retry':
      case '--retry-all-errors':
      case '--connect-timeout':
      case '--max-time':
        break;
      default: {
        if (!token.startsWith('-') && !url) {
          url = token;
        }
      }
    }
  }

  if (!url) throw new Error('No URL found in the cURL command.');

  const body = bodyParts.length > 0 ? bodyParts.join('&') : null;
  if (body && method === 'GET' && !explicitMethod) {
    method = 'POST';
  }

  const contentTypeKey = Object.keys(headers).find(
    (key) => key.toLowerCase() === 'content-type',
  );
  const contentType = contentTypeKey ? headers[contentTypeKey].toLowerCase() : '';
  const hasJsonBody = Boolean(
    body && (contentType.includes('application/json') || looksLikeJson(body)),
  );

  return { method, url, headers, body, hasJsonBody };
}

function tryParseJson(value: string | null): unknown | null {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function formatJsObject(obj: Record<string, string>, indent = 2): string {
  const spaces = ' '.repeat(indent);
  const entries = Object.entries(obj);
  if (entries.length === 0) return '{}';

  const rows = entries.map(
    ([key, value]) => `${spaces}${JSON.stringify(key)}: ${JSON.stringify(value)}`,
  );
  return `{\n${rows.join(',\n')}\n}`;
}

function toPythonLiteral(value: unknown, indent = 0): string {
  const spaces = ' '.repeat(indent);
  if (value === null) return 'None';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'None';
  if (typeof value === 'string') return JSON.stringify(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const rows = value.map((item) => `${' '.repeat(indent + 2)}${toPythonLiteral(item, indent + 2)}`);
    return `[\n${rows.join(',\n')}\n${spaces}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    const rows = entries.map(
      ([key, itemValue]) =>
        `${' '.repeat(indent + 2)}${JSON.stringify(key)}: ${toPythonLiteral(itemValue, indent + 2)}`,
    );
    return `{\n${rows.join(',\n')}\n${spaces}}`;
  }

  return 'None';
}

function buildFetchSnippet(parsed: ParsedCurl, jsonBody: unknown | null): string {
  const lines: string[] = [];

  if (jsonBody !== null) {
    lines.push(`const payload = ${JSON.stringify(jsonBody, null, 2)};`, '');
  }

  lines.push(`const response = await fetch(${JSON.stringify(parsed.url)}, {`);
  lines.push(`  method: ${JSON.stringify(parsed.method)},`);

  if (Object.keys(parsed.headers).length > 0) {
    lines.push(`  headers: ${formatJsObject(parsed.headers, 4).replace(/\n/g, '\n  ')},`);
  }

  if (parsed.body) {
    if (jsonBody !== null) {
      lines.push('  body: JSON.stringify(payload),');
    } else {
      lines.push(`  body: ${JSON.stringify(parsed.body)},`);
    }
  }

  lines.push('});', '', 'const result = await response.json();', 'console.log(result);');
  return lines.join('\n');
}

function buildAxiosSnippet(parsed: ParsedCurl, jsonBody: unknown | null): string {
  const lines: string[] = ['import axios from "axios";', ''];

  if (jsonBody !== null) {
    lines.push(`const payload = ${JSON.stringify(jsonBody, null, 2)};`, '');
  }

  lines.push('const response = await axios({');
  lines.push(`  method: ${JSON.stringify(parsed.method.toLowerCase())},`);
  lines.push(`  url: ${JSON.stringify(parsed.url)},`);

  if (Object.keys(parsed.headers).length > 0) {
    lines.push(`  headers: ${formatJsObject(parsed.headers, 4).replace(/\n/g, '\n  ')},`);
  }

  if (parsed.body) {
    lines.push(`  data: ${jsonBody !== null ? 'payload' : JSON.stringify(parsed.body)},`);
  }

  lines.push('});', '', 'console.log(response.data);');
  return lines.join('\n');
}

function buildPythonSnippet(parsed: ParsedCurl, jsonBody: unknown | null): string {
  const lines: string[] = ['import requests', ''];
  lines.push(`url = ${JSON.stringify(parsed.url)}`);
  lines.push(`headers = ${toPythonLiteral(parsed.headers)}`);

  if (parsed.body) {
    if (jsonBody !== null) {
      lines.push(`payload = ${toPythonLiteral(jsonBody)}`);
      lines.push(
        `response = requests.request(${JSON.stringify(parsed.method)}, url, headers=headers, json=payload)`,
      );
    } else {
      lines.push(`payload = ${JSON.stringify(parsed.body)}`);
      lines.push(
        `response = requests.request(${JSON.stringify(parsed.method)}, url, headers=headers, data=payload)`,
      );
    }
  } else {
    lines.push(`response = requests.request(${JSON.stringify(parsed.method)}, url, headers=headers)`);
  }

  lines.push('', 'print(response.status_code)', 'print(response.text)');
  return lines.join('\n');
}

export default function CurlConverterClient() {
  const [input, setInput] = useState(
    "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' -H 'Authorization: Bearer <token>' -d '{\"name\":\"Alex\",\"role\":\"admin\"}'",
  );
  const [mode, setMode] = useState<OutputMode>('fetch');
  const [parsed, setParsed] = useState<ParsedCurl | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const jsonBody = useMemo(() => tryParseJson(parsed?.body ?? null), [parsed]);

  const output = useMemo(() => {
    if (!parsed) return '';
    if (mode === 'axios') return buildAxiosSnippet(parsed, parsed.hasJsonBody ? jsonBody : null);
    if (mode === 'python') return buildPythonSnippet(parsed, parsed.hasJsonBody ? jsonBody : null);
    return buildFetchSnippet(parsed, parsed.hasJsonBody ? jsonBody : null);
  }, [jsonBody, mode, parsed]);

  const convert = () => {
    try {
      const next = parseCurlCommand(input);
      setParsed(next);
      setError(null);
    } catch (conversionError) {
      setParsed(null);
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : 'Unable to parse this cURL command.',
      );
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const clearAll = () => {
    setInput('');
    setParsed(null);
    setError(null);
    setMode('fetch');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <div>
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                API & Network Utilities
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              cURL Converter
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Convert terminal-ready cURL commands into production snippets for Fetch, Axios, and Python requests.
            </p>
          </div>
        </header>

        <section className="container pb-12 pt-2 sm:pt-4">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card className="min-w-0 !p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2.5">
                <h2 className="inline-flex items-center gap-2 text-base font-extrabold">
                  <TerminalSquare size={18} /> Paste cURL
                </h2>
              </div>
              <textarea
                className="min-h-[320px] w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4 font-mono text-[0.9rem] text-[var(--text-primary)] focus:border-[#1d4ed8] focus:outline-none"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                spellCheck={false}
              />
              <div className="mt-4 flex w-full flex-wrap gap-2.5 md:w-auto">
                <Button onClick={convert}>
                  <ArrowLeftRight size={16} />
                  Convert
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Reset
                </Button>
              </div>
              {error && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] px-3 py-2.5 text-[0.9rem] text-[#b91c1c]">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </Card>

            <Card className="min-w-0 !p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-2.5">
                <h2 className="inline-flex items-center gap-2 text-base font-extrabold">Generated Code</h2>
                <button className="inline-flex cursor-pointer whitespace-nowrap items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-[0.8rem] font-bold text-[var(--text-secondary)] disabled:cursor-not-allowed disabled:opacity-55 bg-transparent" onClick={copyOutput} disabled={!output}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  className={`cursor-pointer rounded-full border border-[var(--border)] px-3 py-1.5 text-[0.8rem] font-bold text-[var(--text-secondary)] bg-transparent ${mode === 'fetch' ? 'border-[#1d4ed8] bg-[rgba(29,78,216,0.1)] text-[#1d4ed8]' : ''}`}
                  onClick={() => setMode('fetch')}
                >
                  Fetch
                </button>
                <button
                  className={`cursor-pointer rounded-full border border-[var(--border)] px-3 py-1.5 text-[0.8rem] font-bold text-[var(--text-secondary)] bg-transparent ${mode === 'axios' ? 'border-[#1d4ed8] bg-[rgba(29,78,216,0.1)] text-[#1d4ed8]' : ''}`}
                  onClick={() => setMode('axios')}
                >
                  Axios
                </button>
                <button
                  className={`cursor-pointer rounded-full border border-[var(--border)] px-3 py-1.5 text-[0.8rem] font-bold text-[var(--text-secondary)] bg-transparent ${mode === 'python' ? 'border-[#1d4ed8] bg-[rgba(29,78,216,0.1)] text-[#1d4ed8]' : ''}`}
                  onClick={() => setMode('python')}
                >
                  Python
                </button>
              </div>
              <pre className="max-h-[320px] min-h-[320px] overflow-auto whitespace-pre rounded-xl border border-[var(--border)] bg-[#0b1022] p-4 text-[0.83rem] leading-[1.55] text-[#dbeafe]">{output || 'Run conversion to generate code.'}</pre>
            </Card>
          </div>

          {parsed && (
            <Card className="mt-4 !p-4">
              <h3 className="mb-[0.7rem] text-base">Parsed Request</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <span className="block text-xs text-[var(--text-tertiary)]">Method</span>
                  <strong className="block break-words text-[0.9rem] text-[var(--text-primary)]">{parsed.method}</strong>
                </div>
                <div>
                  <span className="block text-xs text-[var(--text-tertiary)]">URL</span>
                  <strong className="block break-words text-[0.9rem] text-[var(--text-primary)] break-all">{parsed.url}</strong>
                </div>
                <div>
                  <span className="block text-xs text-[var(--text-tertiary)]">Headers</span>
                  <strong className="block break-words text-[0.9rem] text-[var(--text-primary)]">{Object.keys(parsed.headers).length}</strong>
                </div>
                <div>
                  <span className="block text-xs text-[var(--text-tertiary)]">Body</span>
                  <strong className="block break-words text-[0.9rem] text-[var(--text-primary)]">{parsed.body ? 'Included' : 'None'}</strong>
                </div>
              </div>
            </Card>
          )}
        </section>

        <SEOSection
          title="cURL Converter"
          description="Convert cURL commands into framework-ready snippets for JavaScript and Python without manual translation mistakes."
          howToUse={[
            'Paste a complete curl command including headers and data flags.',
            'Click Convert to parse method, URL, headers, and payload.',
            'Switch output tabs for Fetch, Axios, or Python requests.',
            'Copy and drop the generated code into your project.',
          ]}
          benefits={[
            'Reduces copy/paste errors when moving from terminal to app code.',
            'Supports JSON payloads and regular request bodies.',
            'Keeps all processing local in your browser.',
            'Speeds up API integration and debugging loops.',
          ]}
        />

        <section className="container section" style={{ paddingTop: 0 }}>
          <RelatedTools currentToolId="curl-converter" categoryId="devtools" />
        </section>
      </div>
      <Footer />
    </div>
  );
}
