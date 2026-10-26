'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { SEOSection } from '@/components/ui/SEOSection';

import { Check, Copy, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
interface QueryParam {
    id: string;
    key: string;
    value: string;
}

export default function UrlEncoderClient() {
    const [mode, setMode] = useState<'encode' | 'decode' | 'builder'>('builder');

    // Basic Encode/Decode State
    const [inputVal, setInputVal] = useState('');
    const [outputVal, setOutputVal] = useState('');

    // Builder State
    const [baseUrl, setBaseUrl] = useState('https://toolioz.com/api/v1/search');
    const [params, setParams] = useState<QueryParam[]>([
        { id: '1', key: 'q', value: 'url encoder' },
        { id: '2', key: 'sort', value: 'desc' },
    ]);

    const [copied, setCopied] = useState(false);

    // Dynamic URL Builder compute
    const builtUrl = useMemo(() => {
        try {
            // First decode base to avoid building on already encoded parts
            const safeBase = baseUrl.trim() || 'https://example.com';

            // Check if user accidentally pasted params in base URL
            const urlObj = new URL(safeBase);

            // Add grid params
            params.forEach(p => {
                if (p.key.trim()) {
                    urlObj.searchParams.append(p.key.trim(), p.value);
                }
            });
            return urlObj.toString();
        } catch (e) {
            return 'Invalid Base URL format';
        }
    }, [baseUrl, params]);

    const handleBasicInput = (val: string, currentMode: 'encode' | 'decode') => {
        setInputVal(val);
        try {
            if (currentMode === 'encode') {
                setOutputVal(encodeURIComponent(val));
            } else {
                setOutputVal(decodeURIComponent(val));
            }
        } catch (e) {
            setOutputVal('Error processing string');
        }
    };

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const addParam = () => {
        setParams([...params, { id: Date.now().toString(), key: '', value: '' }]);
    };

    const updateParam = (id: string, field: 'key' | 'value', val: string) => {
        setParams(params.map(p => p.id === id ? { ...p, [field]: val } : p));
    };

    const removeParam = (id: string) => {
        setParams(params.filter(p => p.id !== id));
    };

    // Auto-parse if user pastes a full URL into BaseURL input in builder mode
    const handleBaseUrlChange = (val: string) => {
        try {
            // Only try to parse if there's a question mark indicating a query string
            if (val.includes('?')) {
                const parsed = new URL(val);
                const newBase = parsed.origin + parsed.pathname;

                const newParams: QueryParam[] = [];
                parsed.searchParams.forEach((value, key) => {
                    newParams.push({ id: Date.now().toString() + Math.random(), key, value });
                });

                setBaseUrl(newBase);
                if (newParams.length > 0) {
                    setParams([...params, ...newParams]);
                }
                return;
            }
        } catch (e) {
            // Not a valid URL or just typing, ignore parsing error
        }
        setBaseUrl(val);
    };


    return (
        <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
            <div>
                <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-3 inline-flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                                Network & URI Tools
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
                            URL Encoder
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                            Percent-encoding writes an unsafe character as % plus two hex digits. This page encodes text, decodes it, and splits a URL into its parts.
                        </p>
                    </div>
                </header>

                <section className="container pb-12 pt-2 sm:pt-4">
                    <div className="mx-auto max-w-[1000px]">
                        <Card className="!p-6 md:!p-10">

                            <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
                                <button
                                    className={`cursor-pointer rounded-full border-2 border-transparent px-8 py-3 text-base font-bold transition-all hover:bg-opacity-80 ${mode === 'builder' ? 'border-[#3b82f6] bg-[rgba(59,130,246,0.1)] text-[#3b82f6]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}
                                    onClick={() => setMode('builder')}
                                >
                                    URL Builder & Parser
                                </button>
                                <button
                                    className={`cursor-pointer rounded-full border-2 border-transparent px-8 py-3 text-base font-bold transition-all hover:bg-opacity-80 ${mode === 'encode' ? 'border-[#3b82f6] bg-[rgba(59,130,246,0.1)] text-[#3b82f6]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}
                                    onClick={() => { setMode('encode'); handleBasicInput(inputVal, 'encode'); }}
                                >
                                    String Encode
                                </button>
                                <button
                                    className={`cursor-pointer rounded-full border-2 border-transparent px-8 py-3 text-base font-bold transition-all hover:bg-opacity-80 ${mode === 'decode' ? 'border-[#3b82f6] bg-[rgba(59,130,246,0.1)] text-[#3b82f6]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}
                                    onClick={() => { setMode('decode'); handleBasicInput(inputVal, 'decode'); }}
                                >
                                    String Decode
                                </button>
                            </div>

                            {mode === 'builder' ? (
                                <div className="flex flex-col gap-8">
                                    <div className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-base font-extrabold uppercase tracking-widest text-[var(--text-secondary)]">Base URL (Origin & Path)</h3>
                                        </div>
                                        <input
                                            type="text"
                                            className="mb-4 w-full rounded-sm border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3.5 font-['Fira_Code',monospace] text-[0.9375rem] text-[var(--text-primary)] outline-none transition-colors focus:border-[#3b82f6]"
                                            placeholder="https://example.com/api..."
                                            value={baseUrl}
                                            onChange={(e) => handleBaseUrlChange(e.target.value)}
                                        />

                                        <div className="mb-4 mt-6 flex items-center justify-between">
                                            <h3 className="text-base font-extrabold uppercase tracking-widest text-[var(--text-secondary)]">Query Parameters</h3>
                                            <button className="flex cursor-pointer items-center gap-2 rounded-full border-none bg-[rgba(16,185,129,0.1)] px-4 py-2 text-[0.8125rem] font-bold text-[#10b981] transition-colors hover:bg-[rgba(16,185,129,0.2)]" onClick={addParam}>
                                                <Plus size={16} /> Add Key
                                            </button>
                                        </div>

                                        <div>
                                            {params.length === 0 && <span className="mb-4 block italic text-[#64748b]">No parameters added yet.</span>}
                                            {params.map(param => (
                                                <div key={param.id} className="mb-4 grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_1fr_auto]">
                                                    <input
                                                        type="text"
                                                        className="col-span-2 w-full rounded-sm border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3.5 font-['Fira_Code',monospace] text-[0.9375rem] text-[var(--text-primary)] outline-none transition-colors focus:border-[#3b82f6] md:col-span-1"
                                                        placeholder="Key (e.g. search)"
                                                        value={param.key}
                                                        onChange={(e) => updateParam(param.id, 'key', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="col-span-1 w-full rounded-sm border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3.5 font-['Fira_Code',monospace] text-[0.9375rem] text-[var(--text-primary)] outline-none transition-colors focus:border-[#3b82f6]"
                                                        placeholder="Value (automatically encoded)"
                                                        value={param.value}
                                                        onChange={(e) => updateParam(param.id, 'value', e.target.value)}
                                                    />
                                                    <button
                                                        className="col-span-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-[rgba(239,68,68,0.1)] text-[#ef4444] transition-all hover:bg-[#ef4444] hover:text-white"
                                                        onClick={() => removeParam(param.id)}
                                                        title="Remove Parameter"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-base font-extrabold uppercase tracking-widest text-[var(--text-secondary)]">Final Generated & Encoded URL</h3>
                                            <button className="flex cursor-pointer items-center gap-2 border-none bg-none text-[0.8125rem] font-bold text-[var(--text-secondary)] transition-colors hover:text-[#3b82f6]" onClick={() => copyToClipboard(builtUrl)}>
                                                {copied ? <Check size={16} color="#3b82f6" /> : <Copy size={16} />}
                                                <span>{copied ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        </div>
                                        <div className="relative flex-1 break-all rounded-md border border-[var(--border)] bg-[#1e293b] p-6 font-['Fira_Code',monospace] text-[0.9375rem] leading-relaxed text-[#e2e8f0] min-h-[150px]">
                                            {builtUrl}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    <div className="flex flex-col">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-base font-extrabold uppercase tracking-widest text-[var(--text-secondary)]">Input {mode === 'encode' ? 'Text' : 'Encoded String'}</h3>
                                        </div>
                                        <textarea
                                            className="min-h-[200px] flex-1 resize-y rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] p-6 font-['Fira_Code',monospace] text-[0.9375rem] leading-relaxed text-[var(--text-primary)] outline-none transition-colors focus:border-[#3b82f6] md:min-h-[250px]"
                                            placeholder={mode === 'encode' ? 'Paste raw URI component or text...' : 'Paste encoded string...'}
                                            value={inputVal}
                                            onChange={(e) => handleBasicInput(e.target.value, mode)}
                                            spellCheck="false"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-base font-extrabold uppercase tracking-widest text-[var(--text-secondary)]">Output {mode === 'encode' ? 'Encoded' : 'Decoded Text'}</h3>
                                            <button className="flex cursor-pointer items-center gap-2 border-none bg-none text-[0.8125rem] font-bold text-[var(--text-secondary)] transition-colors hover:text-[#3b82f6]" onClick={() => copyToClipboard(outputVal)}>
                                                {copied ? <Check size={16} color="#3b82f6" /> : <Copy size={16} />}
                                                <span>{copied ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        </div>
                                        <div className="relative min-h-[200px] flex-1 break-all rounded-md border border-[var(--border)] bg-[#1e293b] p-6 font-['Fira_Code',monospace] text-[0.9375rem] leading-relaxed text-[#e2e8f0] md:min-h-[250px]">
                                            {outputVal || <span className="italic text-[#64748b]">Result will appear here...</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </Card>
                    </div>
                </section>

                <SEOSection
                    title="Visual URL Builder & Base64 Encoder Online"
                    description="Percent-encoding writes a character outside the URL-safe set as a percent sign plus two hex digits. This page encodes text, decodes it, and splits a URL into its parts."
                    howToUse={[
                        "Use the URL Builder mode to paste a full URL. It will automatically detect and parse out the query parameters (?key=value) into a manageable grid.",
                        "Add, edit or remove custom parameters; the tool handles URL Percent-Encoding for spaces and symbols natively.",
                        "Switch to String Encode or String Decode for raw string-based URI Component processing.",
                        "Click the copy button when your target URL is generated."
                    ]}
                    benefits={[
                        "Forget manual '?&=' syntax errors when crafting API endpoints by hand.",
                        "Prevents percent-encoding bugs when injecting symbols (spaces, commas, plusses) in the browser.",
                        "Encoding uses the URL and encodeURIComponent APIs in the page. The text is not uploaded.",
                        "Unified GUI for developers dealing with REST APIs, webhooks, and deep links."
                    ]}
                />

                <section className="container py-8 pb-24">
                    <Card className="border-0 bg-secondary p-8 sm:p-12">
                        <h2 className="mb-6 text-2xl font-extrabold text-foreground sm:text-3xl">What does a visual URL parser show?</h2>
                        <p className="mb-6 text-base leading-relaxed text-secondary-foreground/80">
                            A visual parser splits a URL into protocol, host, path, and query parameters so percent-encoded characters can be read as text before the link is sent.
                        </p>
                        <h2 className="mb-6 text-2xl font-extrabold text-foreground sm:text-3xl">What is percent-encoding?</h2>
                        <p className="mb-6 text-base leading-relaxed text-secondary-foreground/80">
                            Percent-encoding writes a character outside the URL-safe set as a percent sign plus two hex digits. %40 is @ and %20 is a space.
                        </p>
                    </Card>
                </section>
            </div>
            <Footer />
        </div>
    );
}
