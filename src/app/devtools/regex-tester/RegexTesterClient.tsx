'use client';

import React, { useState, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { SEOSection } from '@/components/ui/SEOSection';

import { SearchCode, AlertCircle, Copy, Check } from 'lucide-react';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
export default function RegexTesterClient() {
    const [pattern, setPattern] = useState('([A-Z])\\w+');
    const [flags, setFlags] = useState('g');
    const [testString, setTestString] = useState('Hello world! testing RegExp tools is Fun.\nMatches Capitalized123.');
    const [replaceString, setReplaceString] = useState('-$1-');

    const [mode, setMode] = useState<'match' | 'replace' | 'code'>('match');

    // Derived States
    const [matches, setMatches] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [replacedOutput, setReplacedOutput] = useState<string>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!pattern) {
            setMatches([]);
            setReplacedOutput(testString);
            setError(null);
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const results = [];
            let match;

            if (mode === 'replace') {
                setReplacedOutput(testString.replace(regex, replaceString));
            }

            // Ensure global flag is set to get multiple matches, otherwise just run once
            if (regex.global) {
                while ((match = regex.exec(testString)) !== null) {
                    if (match.index === regex.lastIndex) regex.lastIndex++;
                    results.push({ value: match[0], index: match.index, groups: match.slice(1) });
                }
            } else {
                match = regex.exec(testString);
                if (match) results.push({ value: match[0], index: match.index, groups: match.slice(1) });
            }

            setMatches(results);
            setError(null);
        } catch (err: any) {
            setError(err.message);
            setMatches([]);
            setReplacedOutput('');
        }
    }, [pattern, flags, testString, replaceString, mode]);

    const toggleFlag = (flag: string) => {
        if (flags.includes(flag)) {
            setFlags(flags.replace(flag, ''));
        } else {
            setFlags(flags + flag);
        }
    };

    const copyCode = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateJsCode = () => {
        return `// JavaScript RegExp Code Snippet
const regex = /${pattern}/${flags};
const str = \`${testString.replace(/`/g, '\\`')}\`;
${mode === 'replace' ? `\nconst subst = \`${replaceString}\`;\nconst result = str.replace(regex, subst);\nconsole.log(result);` : `\nlet m;\nwhile ((m = regex.exec(str)) !== null) {\n    if (m.index === regex.lastIndex) { regex.lastIndex++; }\n    console.log(\`Found match, group 0: \${m[0]}\`);\n}`}`;
    };

    return (
        <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
            <div>
                <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-3 inline-flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                Pattern Matching
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
                            Regular Expression Tester
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                            A JavaScript regular expression is tested against sample text. Parentheses become capture groups, and $1 and $2 insert those groups into a replacement.
                        </p>
                    </div>
                </header>

                <section className="container pb-12 pt-2 sm:pt-4">
                    <div className="mx-auto max-w-[1000px]">
                        <Card className="!p-6 md:!p-10">

                            <div className="mb-6 flex gap-2 border-b-2 border-[var(--border)] pb-4">
                                <button className={`relative cursor-pointer border-none bg-transparent px-4 py-2 text-[0.9375rem] font-extrabold uppercase tracking-widest transition-colors hover:text-[#10b981] ${mode === 'match' ? 'text-[#10b981] after:absolute after:-bottom-[18px] after:left-0 after:right-0 after:h-0.5 after:bg-[#10b981]' : 'text-[var(--text-secondary)]'}`} onClick={() => setMode('match')}>Match mode</button>
                                <button className={`relative cursor-pointer border-none bg-transparent px-4 py-2 text-[0.9375rem] font-extrabold uppercase tracking-widest transition-colors hover:text-[#10b981] ${mode === 'replace' ? 'text-[#10b981] after:absolute after:-bottom-[18px] after:left-0 after:right-0 after:h-0.5 after:bg-[#10b981]' : 'text-[var(--text-secondary)]'}`} onClick={() => setMode('replace')}>Replace Formatter</button>
                                <button className={`relative cursor-pointer border-none bg-transparent px-4 py-2 text-[0.9375rem] font-extrabold uppercase tracking-widest transition-colors hover:text-[#10b981] ${mode === 'code' ? 'text-[#10b981] after:absolute after:-bottom-[18px] after:left-0 after:right-0 after:h-0.5 after:bg-[#10b981]' : 'text-[var(--text-secondary)]'}`} onClick={() => setMode('code')}>Code Generator</button>
                            </div>

                            <div className="mb-4 rounded-lg bg-[#1e293b] p-6">
                                <div className="flex flex-wrap items-center gap-2 rounded-md border border-white/10 bg-[#0f172a] px-4 py-2 focus-within:border-[#10b981]">
                                    <span className="font-['Fira_Code',monospace] text-2xl font-semibold text-[#94a3b8]">/</span>
                                    <input
                                        type="text"
                                        className="flex-1 bg-transparent font-['Fira_Code',monospace] text-xl font-bold text-[#10b981] outline-none"
                                        value={pattern}
                                        onChange={(e) => setPattern(e.target.value)}
                                        placeholder="Enter regular expression..."
                                        spellCheck={false}
                                    />
                                    <span className="font-['Fira_Code',monospace] text-2xl font-semibold text-[#94a3b8]">/</span>
                                    <input
                                        type="text"
                                        className="w-[60px] bg-transparent font-['Fira_Code',monospace] text-xl font-bold text-[#ec4899] outline-none"
                                        value={flags}
                                        onChange={(e) => setFlags(e.target.value)}
                                        placeholder="flags"
                                        spellCheck={false}
                                    />
                                </div>

                                {mode === 'replace' && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-white/10 bg-[#0f172a] px-4 py-2 focus-within:border-[#3b82f6]">
                                        <span className="mr-4 font-['Fira_Code',monospace] text-base font-semibold text-slate-500">Replace with: </span>
                                        <input
                                            type="text"
                                            className="flex-1 bg-transparent font-['Fira_Code',monospace] text-lg font-semibold text-[#3b82f6] outline-none"
                                            value={replaceString}
                                            onChange={(e) => setReplaceString(e.target.value)}
                                            placeholder="E.g. $1-$2"
                                            spellCheck={false}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mb-8 flex flex-wrap gap-3">
                                <button className={`cursor-pointer rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-all hover:border-[#10b981] ${flags.includes('g') ? 'border-[#10b981] bg-[rgba(16,185,129,0.1)] text-[#10b981]' : 'border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`} onClick={() => toggleFlag('g')}>Global (g)</button>
                                <button className={`cursor-pointer rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-all hover:border-[#10b981] ${flags.includes('i') ? 'border-[#10b981] bg-[rgba(16,185,129,0.1)] text-[#10b981]' : 'border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`} onClick={() => toggleFlag('i')}>Case Insensitive (i)</button>
                                <button className={`cursor-pointer rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-all hover:border-[#10b981] ${flags.includes('m') ? 'border-[#10b981] bg-[rgba(16,185,129,0.1)] text-[#10b981]' : 'border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`} onClick={() => toggleFlag('m')}>Multiline (m)</button>
                                <button className={`cursor-pointer rounded-full border px-4 py-2 text-[0.8125rem] font-semibold transition-all hover:border-[#10b981] ${flags.includes('s') ? 'border-[#10b981] bg-[rgba(16,185,129,0.1)] text-[#10b981]' : 'border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`} onClick={() => toggleFlag('s')}>Dot All (s)</button>
                            </div>

                            {error && (
                                <div className="mb-8 flex items-center gap-3 rounded-md bg-[rgba(239,68,68,0.1)] p-4 font-semibold text-[#ef4444]">
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {mode === 'code' ? (
                                <div className="m-0">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-extrabold">JavaScript Implementation Snippet</h3>
                                        <button className="flex cursor-pointer items-center gap-1 border-none bg-none text-sm font-semibold text-[var(--text-secondary)] hover:text-[#10b981]" onClick={() => copyCode(generateJsCode())}>
                                            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                                            {copied ? 'Copied' : 'Copy Code'}
                                        </button>
                                    </div>
                                    <pre className="w-full whitespace-pre-wrap break-all rounded-md bg-[#0f172a] p-6 font-['Fira_Code',monospace] text-[0.9375rem] leading-relaxed text-[#e2e8f0]">{generateJsCode()}</pre>
                                </div>
                            ) : (
                                <div className={`grid gap-8 ${mode === 'replace' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                                    <div className="m-0">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-lg font-extrabold">Test String Input</h3>
                                            <span className="rounded-full bg-[#10b981] px-3 py-1 text-xs font-bold uppercase text-white">
                                                {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                                            </span>
                                        </div>
                                        <textarea
                                            className="min-h-[200px] w-full resize-y rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] p-6 font-['Fira_Code',monospace] text-[0.9375rem] leading-relaxed text-[var(--text-primary)] outline-none focus:border-[#10b981]"
                                            value={testString}
                                            onChange={(e) => setTestString(e.target.value)}
                                            placeholder="Insert the text you want to test against your regex here..."
                                            spellCheck={false}
                                        />
                                    </div>

                                    {mode === 'replace' && (
                                        <div className="m-0">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h3 className="text-lg font-extrabold">Substitution Result</h3>
                                            </div>
                                            <div className="min-h-[200px] w-full whitespace-pre-wrap break-all rounded-md border border-[var(--border)] bg-[#1e293b] p-6 font-['Fira_Code',monospace] text-[0.9375rem] leading-relaxed text-[#e2e8f0]">
                                                {replacedOutput || <span className="opacity-50">(Empty result)</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {mode !== 'code' && matches.length > 0 && (
                                <div className="mt-8 border-t border-[var(--border)] pt-8">
                                    <h3 className="mb-4 text-lg font-extrabold">Match Extractions & Capture Groups</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                                        {matches.map((m, idx) => (
                                            <div key={idx} className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                                                <div className="mb-2 flex justify-between">
                                                    <span className="text-[0.8125rem] font-extrabold uppercase text-[#10b981]">Match {idx + 1}</span>
                                                    <span className="text-xs font-semibold text-[var(--text-tertiary)]">pos: {m.index}-{m.index + m.value.length}</span>
                                                </div>
                                                <div className="break-all rounded bg-[rgba(16,185,129,0.1)] p-2 font-['Fira_Code',monospace] text-[0.9375rem]">{m.value}</div>
                                                {m.groups.length > 0 && m.groups.some(Boolean) && (
                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        <span className="text-xs font-bold text-[var(--text-secondary)]">Groups ($1+):</span>
                                                        {m.groups.map((g: string, i: number) => g ? (
                                                            <span key={i} className="rounded border border-[#cbd5e1] bg-[#f1f5f9] px-2 py-1 font-['Fira_Code',monospace] text-xs font-semibold text-[#475569] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">${i + 1}: {g}</span>
                                                        ) : null)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </section>

                <SEOSection
                    title="How the regular expression tester works"
                    description="A JavaScript regular expression is tested against sample text in the page. Parentheses become capture groups, and a replacement string can insert those groups with $1 and $2."
                    howToUse={[
                        "The pattern and the flags g, i, m, and s are passed to new RegExp.",
                        "Replace mode calls String.replace. $1 and $2 insert capture groups.",
                        "The code button copies a JavaScript snippet. It does not emit Python or another language.",
                        "Each match lists the full match and the numbered groups."
                    ]}
                    benefits={[
                        "Replacement uses the browser String.replace.",
                        "The copied loop moves lastIndex when a match is empty.",
                        "Groups are the strings from the match array.",
                        "The test runs in the page. The page still loads site assets."
                    ]}
                />

                <section className="container py-8 pb-24">
                    <Card className="border-0 bg-secondary p-8 sm:p-12">
                        <h2 className="mb-6 text-2xl font-extrabold text-foreground sm:text-3xl">How does a regex replacement use captured groups?</h2>
                        <p className="mb-6 text-base leading-relaxed text-secondary-foreground/80">
                            Parentheses store part of a match as $1, $2, and so on. The replacement string writes those groups into the result, which is how a pattern can rearrange text instead of only finding it.
                        </p>
                        <h2 className="mb-6 text-2xl font-extrabold text-foreground sm:text-3xl">Why does the exported loop advance lastIndex?</h2>
                        <p className="mb-6 text-base leading-relaxed text-secondary-foreground/80">
                            A global RegExp.exec loop must move lastIndex after every match. The generated snippet does that, which avoids the empty-match loop a hand-written exec loop can hit.
                        </p>
                    </Card>
                </section>
            </div>
            <Footer />
        </div>
    );
}
