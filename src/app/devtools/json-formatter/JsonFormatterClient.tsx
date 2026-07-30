'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Code, Copy, Trash2, AlignLeft, Check, AlertCircle } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';

import yaml from 'js-yaml';
import JsonToTS from 'json-to-ts';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
const JSON_FAQS = [
  {
    question: "Is my JSON data safe when using this online formatter?",
    answer: "Yes, 100%. Toolioz processes all JSON formatting, validation, and TypeScript conversion entirely client-side inside your browser. No data is ever uploaded to any external server."
  },
  {
    question: "How do I convert JSON to TypeScript interface or YAML?",
    answer: "Paste your JSON data into the input box and click the 'JSON to TS' or 'JSON to YAML' toggle buttons to automatically generate ready-to-use TypeScript interfaces and YAML config files."
  },
  {
    question: "Why is my JSON invalid?",
    answer: "Common JSON syntax errors include missing trailing commas, unquoted property keys, single quotes instead of double quotes, and unmatched brackets. Our tool highlights the exact line and error message."
  }
];

export default function JsonFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('Result');

  const executeTransform = (transformFn: (parsed: any) => string, modeName: string) => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      const res = transformFn(parsed);
      setOutput(res);
      setError(null);
      setActiveTab(modeName);
    } catch (e: any) {
      setError(e.message || "Invalid JSON syntax");
      setOutput('');
      setActiveTab('Error');
    }
  };

  const formatJson = (indent: number) => {
    executeTransform((parsed) => JSON.stringify(parsed, null, indent), 'Beautified JSON');
  };

  const minifyJson = () => {
    executeTransform((parsed) => JSON.stringify(parsed), 'Minified JSON');
  };

  const toYaml = () => {
    executeTransform((parsed) => yaml.dump(parsed, { indent: 2, lineWidth: -1 }), 'YAML Format');
  };

  const toTypeScript = () => {
    executeTransform((parsed) => {
      const interfaces = JsonToTS(parsed);
      return interfaces.join('\n\n');
    }, 'TypeScript Interfaces');
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
    setActiveTab('Result');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Developer Tools', url: '/devtools' },
          { name: 'JSON Formatter', url: '/devtools/json-formatter' },
        ]}
      />
      <header className="bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_50%)] py-16 text-center md:py-24">
        <div className="container">
          <h1 className="mb-4 text-4xl font-black md:text-6xl">Advanced JSON <span className="text-[#3b82f6]">Transformer</span></h1>
          <p className="text-lg text-[var(--text-secondary)]">Format, validate, and convert JSON payloads to YAML and TS Interfaces in real-time.</p>
        </div>
      </header>

      <main className="container section">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <Card className="flex h-full flex-col !p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code size={20} className="text-[#3b82f6]" />
                  <h3 className="text-lg font-extrabold uppercase tracking-widest">Raw JSON Input</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-[var(--text-secondary)]">
                    <Trash2 size={16} /> Clear
                  </Button>
                </div>
              </div>
              <textarea
                className="mb-6 min-h-[350px] w-full flex-1 resize-none break-all rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] p-6 font-mono text-[0.9375rem] leading-relaxed text-[var(--text-primary)] outline-none transition-colors focus:border-[#3b82f6]"
                placeholder='Paste your JSON array or object here (e.g. {"name": "Toolioz", "type": "Toolbox"})'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck="false"
              />

              <div className="rounded-md border border-[rgba(255,255,255,0.05)] bg-[#0f172a] p-6">
                <span className="mb-3 block text-[0.8rem] font-extrabold uppercase text-[var(--text-secondary)]">Formatting</span>
                <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '1rem' }}>
                  <button className="cursor-pointer rounded-md border border-[var(--border)] bg-[#1e293b] p-3 text-sm font-semibold text-white transition-all hover:not(:disabled):border-[#3b82f6] hover:not(:disabled):bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => formatJson(2)} disabled={!input}>Format (2 Tabs)</button>
                  <button className="cursor-pointer rounded-md border border-[var(--border)] bg-[#1e293b] p-3 text-sm font-semibold text-white transition-all hover:not(:disabled):border-[#3b82f6] hover:not(:disabled):bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => formatJson(4)} disabled={!input}>Format (4 Tabs)</button>
                  <button className="cursor-pointer rounded-md border border-[var(--border)] bg-[#1e293b] p-3 text-sm font-semibold text-white transition-all hover:not(:disabled):border-[#3b82f6] hover:not(:disabled):bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50 col-span-2" onClick={minifyJson} disabled={!input}>Minify payload</button>
                </div>

                <span className="mb-3 block text-[0.8rem] font-extrabold uppercase text-[var(--text-secondary)]">Advanced Generics</span>
                <div className="grid grid-cols-2 gap-3">
                  <button className="cursor-pointer rounded-md border border-[var(--border)] bg-[#1e293b] p-3 text-sm font-semibold text-white transition-all hover:not(:disabled):border-[#3b82f6] hover:not(:disabled):bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50" onClick={toYaml} disabled={!input} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>Convert to YAML</button>
                  <button className="cursor-pointer rounded-md border border-[var(--border)] bg-[#1e293b] p-3 text-sm font-semibold text-white transition-all hover:not(:disabled):border-[#3b82f6] hover:not(:disabled):bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50" onClick={toTypeScript} disabled={!input} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>Generate TS Types</button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="flex h-full flex-col !p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlignLeft size={20} className="text-[#3b82f6]" />
                  <h3 className="text-lg font-extrabold uppercase tracking-widest" style={{ color: error ? '#ef4444' : 'inherit' }}>{activeTab}</h3>
                </div>
                <div className="flex gap-2">
                  {output && (
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="text-[var(--text-secondary)]">
                      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      {copied ? 'Copied Content' : 'Copy Output'}
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col">
                {error ? (
                  <div className="flex min-h-[480px] gap-4 rounded-md bg-[rgba(239,68,68,0.1)] p-6 text-[0.9375rem] text-[#b91c1c]">
                    <AlertCircle size={20} />
                    <div>
                      <strong>Syntax Error parsing JSON:</strong>
                      <p className="mt-2 font-mono font-semibold">{error}</p>
                    </div>
                  </div>
                ) : (
                  <pre className="m-0 min-h-[480px] flex-1 overflow-x-auto whitespace-pre-wrap rounded-md bg-[#1e293b] p-6 font-mono text-[0.9375rem] leading-relaxed text-[#e2e8f0]">
                    {output || '(Output will appear here after you paste and format)'}
                  </pre>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <SEOSection
        title="Live JSON Formatter, YAML Converter & TS Generics"
        description="A blazing fast, private utility tool to format, beautify, validate, and minify massive JSON files. Automatically convert your endpoints to structural YAML or generate strict Typescript interfaces instantly."
        howToUse={[
          "Paste your raw, messy JSON string directly into the left input window.",
          "Use formatting tools to immediately beautify the JSON with specific 2 or 4 indentations, or squish it utilizing the Minify button.",
          "Use the Advanced Generics panel to effortlessly translate the JSON structure into perfectly nested YAML or explicit TypeScript Interfaces.",
          "Watch for instant syntax errors in the outcome window to trace missing commas or brackets before pushing your code to production."
        ]}
        benefits={[
          "100% Client-Side Privacy: Your payloads are analyzed deeply via local computation power. Nothing is ever saved or routed externally.",
          "Cross-Structural Compiling: Automatically traverse and generate 1:1 mapped TypeScript Types and configurations from unpredictable JSON logic.",
          "Blazing Speed: Render and format several megabytes of complex JSON structures securely inside the browser environment.",
          "Error Tracing: Highlights exactly where the JSON payload failed execution constraints, improving developer QA speeds."
        ]}
      />
      <DirectAnswerBlock
        title="How to format, validate, and convert JSON to TypeScript or YAML online free?"
        answer="Toolioz JSON Formatter is a 100% browser-local tool that prettifies (2 or 4 spaces), minifies, and validates raw JSON text with line-number error reporting. It also instantly converts valid JSON payloads into strongly typed TypeScript interface definitions (`json-to-ts`) or YAML configuration files without uploading data to remote servers."
        keyTakeaways={[
          "100% Client-Side Processing — Zero API calls or server logs; sensitive API payloads stay private.",
          "TypeScript Interface Generator — Automatically infers nested types, array interfaces, and optional fields.",
          "YAML Converter — Transform API responses or config JSON directly into valid YAML syntax.",
          "Line-Specific Validation — Pinpoints exact bracket, comma, or quotes parse errors in real-time."
        ]}
        categoryName="Developer Utilities"
      />
      <FAQSchema faqs={JSON_FAQS} />
    </div>
  );
}
