"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { FileCode, ArrowRight, Copy, Check, Info } from "lucide-react";
import { toast } from "sonner";

export default function CSSMinifierPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const minify = () => {
        if (!input.trim()) return;

        let minified = input
            .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
            .replace(/\s+/g, " ") // Collapse whitespace
            .replace(/\s*([:;{}])\s*/g, "$1") // Remove space around chars
            .replace(/;}/g, "}") // Remove last semicolon
            .trim();

        setOutput(minified);
        toast.success("CSS Minified!");
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const faq = [
        { q: "Why minify CSS?", a: "Minification removes unnecessary characters like spaces, comments, and newlines. This reduces the file size, making your website load faster." },
        { q: "Is this safe?", a: "Yes, this tool strictly removes formatting bytes. It does not alter your actual styles or logic." },
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="CSS Minifier"
                description="Compress your CSS code to reduce file size and improve page load speed."
            />

            <div className="max-w-6xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold flex items-center gap-2"><FileCode size={18} /> Input CSS</span>
                        <span className="text-xs text-muted-foreground">{input.length} chars</span>
                    </div>
                    <Textarea
                        placeholder="Paste your raw CSS here..."
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
                                className="absolute top-4 right-4 shadow-sm"
                                onClick={copy}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 flex justify-center pt-4">
                    <Button size="lg" onClick={minify} disabled={!input} className="w-full md:w-64 font-bold text-lg h-14">
                        Minify CSS <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="How it works">
                    <p>
                        Our CSS minifier parses your code and intelligently strips out:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Comments (/* ... */)</li>
                        <li>New line characters</li>
                        <li>Extra whitespace characters</li>
                        <li>Unnecessary semicolons</li>
                    </ul>
                </ToolContentSection>
                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
