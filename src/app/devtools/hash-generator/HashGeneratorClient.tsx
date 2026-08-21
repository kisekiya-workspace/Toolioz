'use client';

import React, { useState, useCallback } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Hash,
  Copy,
  Check,
  FileUp,
  Trash2,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';
import { SEOSection } from '@/components/ui/SEOSection';
import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';


type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

interface HashResult {
  algorithm: Algorithm;
  hash: string;
}

const ALGORITHMS: Algorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

const FAQS = [
  {
    question: 'Does this tool upload my data to a server?',
    answer:
      'No. All hashing is performed entirely in your browser using the Web Crypto API. Your data never leaves your device.',
  },
  {
    question: 'What hash algorithms are supported?',
    answer:
      'SHA-1, SHA-256, SHA-384, and SHA-512 are supported. These are all part of the SHA-2 family (except SHA-1) and are provided natively by the Web Crypto API.',
  },
  {
    question: 'Can I hash files as well as text?',
    answer:
      'Yes! You can paste text directly or upload any file. The tool hashes the raw bytes of the file.',
  },
  {
    question: 'Is SHA-1 secure?',
    answer:
      'SHA-1 is considered cryptographically weak and should not be used for security-critical applications like certificate signing. Use SHA-256 or SHA-512 instead.',
  },
];

export default function HashGeneratorClient() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<HashResult[]>([]);
  const [selectedAlgos, setSelectedAlgos] = useState<Algorithm[]>(['SHA-256']);
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null);
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);

  const computeHash = useCallback(
    async (data: ArrayBuffer, algo: Algorithm): Promise<string> => {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    },
    [],
  );

  const generateHashes = useCallback(async () => {
    const data =
      mode === 'file' && fileBytes
        ? fileBytes
        : new TextEncoder().encode(input).buffer;

    const hashResults: HashResult[] = [];
    for (const algo of selectedAlgos) {
      const hash = await computeHash(data, algo);
      hashResults.push({ algorithm: algo, hash });
    }
    setResults(hashResults);
  }, [input, selectedAlgos, computeHash, mode, fileBytes]);

  const toggleAlgo = (algo: Algorithm) => {
    setSelectedAlgos((prev) =>
      prev.includes(algo) ? prev.filter((a) => a !== algo) : [...prev, algo],
    );
  };

  const copyHash = async (hash: string, algo: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedAlgo(algo);
    setTimeout(() => setCopiedAlgo(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMode('file');
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    setFileBytes(buffer);
  };

  const clearAll = () => {
    setInput('');
    setResults([]);
    setFileName(null);
    setFileBytes(null);
    setMode('text');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <div>
        <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                Cryptographic Hashing
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
              Hash Generator
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files — 100% client-side using the Web Crypto API.
            </p>
          </div>
        </header>

        <section className="container pb-12 pt-2 sm:pt-4">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            {/* Input Panel */}
            <Card className="flex flex-col !p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-primary)]">Input</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)]">
                    <FileUp size={14} />
                    Upload File
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button className="flex cursor-pointer items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[0.8125rem] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--primary)]" onClick={clearAll}>
                    <Trash2 size={14} />
                    Clear
                  </button>
                </div>
              </div>

              {mode === 'file' && fileName ? (
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <FileUp
                    size={32}
                    style={{ color: 'var(--primary)', marginBottom: '0.5rem', marginLeft: 'auto', marginRight: 'auto' }}
                  />
                  <p style={{ fontWeight: 700 }}>{fileName}</p>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                    File loaded — ready to hash
                  </p>
                </div>
              ) : (
                <textarea
                  className="min-h-[180px] w-full resize-y rounded-md border-none bg-[var(--bg-secondary)] p-4 font-mono text-[0.9375rem] text-[var(--text-primary)] outline-none focus:bg-[rgba(37,99,235,0.02)]"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setMode('text');
                  }}
                  placeholder="Enter text to hash..."
                  spellCheck={false}
                />
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <p
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text-tertiary)',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Algorithms
                </p>
                <div className="flex flex-wrap gap-3">
                  {ALGORITHMS.map((algo) => (
                    <button
                      key={algo}
                      className={`cursor-pointer rounded-full border-2 border-[var(--border)] px-4 py-2 text-[0.8125rem] font-bold transition-colors hover:border-[var(--primary)] ${
                        selectedAlgos.includes(algo) ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]' : 'bg-transparent text-[var(--text-secondary)]'
                      }`}
                      onClick={() => toggleAlgo(algo)}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={generateHashes}
                disabled={
                  selectedAlgos.length === 0 ||
                  (mode === 'text' && !input.trim()) ||
                  (mode === 'file' && !fileBytes)
                }
                style={{ marginTop: '1.5rem' }}
              >
                <Hash size={20} style={{ marginRight: '8px' }} />
                Generate Hashes
              </Button>
            </Card>

            {/* Output Panel */}
            <Card className="flex flex-col !p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-primary)]">Hash Output</h3>
              </div>

              {results.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center text-[var(--text-tertiary)]">
                  <Hash size={40} className="mb-4" />
                  <p>Hash results will appear here</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {results.map((r) => (
                    <div key={r.algorithm} className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">{r.algorithm}</span>
                      <div className="flex items-center gap-3 break-all rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 font-mono text-[0.8125rem] text-[var(--text-primary)]">
                        <code className="flex-1 leading-relaxed">{r.hash}</code>
                        <button
                          className="shrink-0 rounded p-1 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                          onClick={() => copyHash(r.hash, r.algorithm)}
                          title="Copy hash"
                        >
                          {copiedAlgo === r.algorithm ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="container section" style={{ paddingTop: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Lock size={24} style={{ color: '#3b82f6', marginBottom: '0.75rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>100% Private</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Uses Web Crypto API — your data never leaves the browser.
              </p>
            </Card>
            <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Zap size={24} style={{ color: '#f59e0b', marginBottom: '0.75rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Instant Results</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Hardware-accelerated crypto for sub-millisecond hashing.
              </p>
            </Card>
            <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
              <ShieldCheck size={24} style={{ color: '#10b981', marginBottom: '0.75rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>File Support</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Hash any file type — verify downloads, check integrity.
              </p>
            </Card>
          </div>
        </section>

        <SEOSection
          title="Hash Generator: SHA-256, SHA-512 & More"
          description="Generate cryptographic hashes from text or files using browser-native Web Crypto API. Supports SHA-1, SHA-256, SHA-384, and SHA-512. Perfect for verifying file integrity, generating checksums, and security workflows."
          howToUse={[
            'Enter text in the input box or upload a file.',
            'Select one or more hash algorithms.',
            'Click Generate Hashes to compute all selected digests.',
            'Copy any hash value with one click.',
          ]}
          benefits={[
            'All processing happens locally — your data is never uploaded.',
            'Uses the browser Web Crypto API for maximum performance.',
            'Supports hashing of arbitrary files for integrity verification.',
            'Multiple algorithms can be computed simultaneously.',
          ]}
        />

        <FAQSchema faqs={FAQS} />

        <section className="container section" style={{ paddingTop: 0 }}>
          <RelatedTools currentToolId="hash-generator" categoryId="devtools" />
        </section>
      </div>
      <Footer />
    </div>
  );
}
