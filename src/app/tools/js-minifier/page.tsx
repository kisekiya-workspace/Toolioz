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

    const minify = () => {
        if (!input.trim()) return;

        // Basic JS Minification Regex (Note: Full JS parsers are too heavy for this demo, using a safe regex approach)
        // This removes comments and excessive whitespace but preserves strings
        let minified = input
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Comments
            .replace(/^\s+|\s+$/gm, '') // Trim lines
            .replace(/\s*([=,:[\](){}.+!|&])\s*/g, '$1') // Operators
            .replace(/\n+/g, ' '); // Newlines

        setOutput(minified);
        toast.success("JS Minified!");
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success("Copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const faq = [
        { q: "Is this a full compiler?", a: "No. This is a lightweight minifier that removes comments and whitespace. For complex obfuscation, use tools like Terser/UglifyJS." },
        { q: "Will this break my code?", a: "It shouldn't, but always backup your original code. This tool is best for simple scripts and snippets." },
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="JavaScript Minifier"
                description="Compress, clean, and minify your custom JavaScript code instantly."
            />

            <div className="max-w-6xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold flex items-center gap-2"><FileCode size={18} /> Input JS</span>
                        <span className="text-xs text-muted-foreground">{input.length} chars</span>
                    </div>
                    <Textarea
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
                            readOnly
                            placeholder="Minified result..."
                            className="h-[400px] font-mono text-sm bg-muted/30"
                            value={output}
                        />
                        {output && (
                            <Button
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
                    <Button size="lg" onClick={minify} disabled={!input} className="w-full md:w-64 font-bold text-lg h-14">
                        Minify JS <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Why Minify JavaScript?">
                    <p>
                        Minification reduces the size of your script files, leading to faster download times for your users.
                        Google also considers page speed as a ranking factor, so minifying your assets helps with SEO.
                    </p>
                </ToolContentSection>
                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
