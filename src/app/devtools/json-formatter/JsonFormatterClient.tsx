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
    answer: "Formatting and conversion run in this tab when the page is labelled local processing. The JSON is not uploaded to Toolioz. The website still loads scripts and analytics."
  },
  {
    question: "How is JSON converted to TypeScript or YAML?",
    answer: "YAML uses js-yaml with an indent of 2. TypeScript uses the json-to-ts package on the parsed value. Both run after JSON.parse succeeds. The text is not uploaded."
  },
  {
    question: "Why is a JSON value rejected?",
    answer: "JSON.parse rejects trailing commas, single quotes, and unquoted keys. The page shows that parser message. It does not draw a line highlight. The text is not uploaded."
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
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Developer Tools', url: '/devtools' },
          { name: 'JSON Formatter', url: '/devtools/json-formatter' },
        ]}
      />
      <div>
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-3 inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                  Data Formatting
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
                JSON Formatter
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                JSON is formatted with 2 or 4 spaces, minified, or written as YAML or TypeScript. Parsing stays in the browser.
              </p>
            </div>
          </header>

          <main className="container pb-12 pt-2 sm:pt-4">
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
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <button className="cursor-pointer rounded-md border border-[var(--border)] bg-[#1e293b] p-3 text-sm font-semibold text-white transition-all hover:not(:disabled):border-[#3b82f6] hover:not(:disabled):bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => formatJson(2)} disabled={!input}>Format (2 spaces)</button>
                  <button className="cursor-pointer rounded-md border border-[var(--border)] bg-[#1e293b] p-3 text-sm font-semibold text-white transition-all hover:not(:disabled):border-[#3b82f6] hover:not(:disabled):bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => formatJson(4)} disabled={!input}>Format (4 spaces)</button>
                  <button className="cursor-pointer rounded-md border border-[var(--border)] bg-[#1e293b] p-3 text-sm font-semibold text-white transition-all hover:not(:disabled):border-[#3b82f6] hover:not(:disabled):bg-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-50 col-span-2" onClick={minifyJson} disabled={!input}>Minify payload</button>
                </div>

                <span className="mb-3 block text-[0.8rem] font-extrabold uppercase text-[var(--text-secondary)]">Advanced Generics</span>
                <div className="grid grid-cols-2 gap-3">
                  <button className="cursor-pointer rounded-md border border-border bg-blue-500/10 p-3 text-sm font-semibold text-sky-400 transition-all disabled:cursor-not-allowed disabled:opacity-50" onClick={toYaml} disabled={!input}>Convert to YAML</button>
                  <button className="cursor-pointer rounded-md border border-border bg-blue-500/10 p-3 text-sm font-semibold text-sky-400 transition-all disabled:cursor-not-allowed disabled:opacity-50" onClick={toTypeScript} disabled={!input}>Generate TS Types</button>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="flex h-full flex-col !p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlignLeft size={20} className="text-[#3b82f6]" />
                  <h3 className={`text-lg font-extrabold uppercase tracking-widest ${error ? 'text-red-500' : 'text-inherit'}`}>{activeTab}</h3>
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
                    {output || '(Output appears here after the text is formatted)'}
                  </pre>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <SEOSection
        title="JSON formatter, YAML, and TypeScript"
        description="JSON.stringify pretty-prints with 2 or 4 spaces, or minifies with no indent. YAML uses js-yaml. TypeScript uses json-to-ts. A parse error shows the parser message."
        howToUse={[
          "Paste JSON into the input.",
          "Format with 2 spaces or 4 spaces, or minify. Those buttons pass a number to JSON.stringify, so the indent is spaces.",
          "YAML and TypeScript run only after JSON.parse succeeds.",
          "A rejected value shows the parser message. The page does not highlight a source line."
        ]}
        benefits={[
          "The text is not uploaded. The site still loads scripts and analytics.",
          "Pretty-print uses 2 or 4 spaces. Minify uses JSON.stringify with no indent.",
          "TypeScript interfaces come from the json-to-ts package and the parsed sample.",
          "The error text is the exception message from JSON.parse."
        ]}
      />
      <DirectAnswerBlock
        title="Format, validate, and convert JSON to TypeScript or YAML"
        answer={
          'This page pretty-prints JSON with 2 or 4 spaces, minifies it, and can emit YAML or TypeScript from a value that parses. The text is not uploaded. The site still loads scripts and analytics.'
        }
        keyTakeaways={[
          "Pasted JSON stays in the tab when the page is labelled local processing. Analytics for the website still load.",
          "TypeScript interfaces come from json-to-ts and the parsed sample.",
          "The YAML converter turns parsed JSON into YAML syntax.",
          "A parse error shows the JSON.parse message. The page does not highlight a line.",
        ]}
        categoryName="Developer Utilities"
      />
      <FAQSchema faqs={JSON_FAQS} />
      </div>
      <Footer />
    </div>
  );
}
