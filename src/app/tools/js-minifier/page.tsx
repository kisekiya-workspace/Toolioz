"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { FileCode, ArrowRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function JSMinifierPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const minify = async () => {
        if (!input.trim()) return;
        setBusy(true);
        setError('');
        try {
            const { minify: parseAndMinify } = await import('terser');
            const result = await parseAndMinify(input, { compress: false, mangle: false, format: { comments: 'some' } });
            setOutput(result.code ?? '');
            toast.success('JavaScript minified');
        } catch (cause) {
            setOutput('');
            const message = cause instanceof Error ? cause.message : 'Unable to parse JavaScript';
            setError(message);
            toast.error(message);
        } finally {
            setBusy(false);
        }
    };

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            toast.success('Copied!');
            setTimeout(() => setCopied(false), 2000);
        } catch { toast.error('Clipboard access was blocked. Select and copy the output manually.'); }
    };

    const faq = [
        { q: "What engine does this use?", a: "Terser parses the JavaScript in the browser. Formatting is removed. Names are not mangled, and compression transforms stay off. License comments are kept." },
        { q: "Should the result be tested?", a: "Yes. Keep the original source and run the usual tests. This page does not transpile TypeScript or JSX, and it does not run the input." },
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="JavaScript Minifier"
                description="Minifies JavaScript by stripping comments and extra whitespace while keeping the program valid."
            />

            <div className="max-w-6xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold flex items-center gap-2"><FileCode size={18} /> Input JS</span>
                        <span className="text-xs text-muted-foreground">{input.length} chars</span>
                    </div>
                    <Textarea
                        aria-label="Input JavaScript"
                        placeholder="const foo = 'bar';"
                        className="h-[400px] font-mono text-sm leading-relaxed"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center h-7">
                        <span className="font-semibold flex items-center gap-2"><FileCode size={18} /> Minified Output</span>
                        {output && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                                saved {((1 - output.length / input.length) * 100).toFixed(0)}%
                            </span>
                        )}
                    </div>
                    <div className="relative">
                        <Textarea
                            aria-label="Minified JavaScript"
                            readOnly
                            placeholder="Minified result..."
                            className="h-[400px] font-mono text-sm bg-muted/30"
                            value={output}
                        />
                        {output && (
                            <Button
                                aria-label="Copy minified JavaScript"
                                size="icon"
                                variant="secondary"
                                className="absolute top-4 right-4"
                                onClick={copy}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 flex justify-center pt-4">
                    <Button size="lg" onClick={minify} disabled={!input.trim() || busy} className="w-full md:w-64 font-bold text-lg h-14">
                        {busy ? 'Minifying…' : 'Minify JS'} <ArrowRight className="ml-2" />
                    </Button>
                </div>
                {error && <p role="alert" className="lg:col-span-2 text-sm text-red-700 dark:text-red-400">{error}</p>}
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Why Minify JavaScript?">
                    <p>
                        Minification reduces the size of your script files, leading to faster download times for your users.
                        Paste plain JavaScript, select Minify JS, then copy the result. A syntax error is shown instead of generating a broken output. Smaller source files can reduce transfer size, but minification alone does not guarantee better rankings or a faster page.
                    </p>
                </ToolContentSection>
                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
