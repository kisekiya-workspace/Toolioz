"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { FileCode, ArrowRight, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function HTMLMinifierPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const minify = () => {
        if (!input.trim()) return;

        // Basic HTML Minification Regex
        let minified = input
            .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
            .replace(/\s+/g, " ") // Collapse whitespace
            .replace(/>\s+</g, "><") // Remove space between tags
            .trim();

        setOutput(minified);
        toast.success("HTML Minified!");
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success("Copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const faq = [
        { q: "Does this affect SEO?", a: "Minified HTML loads faster, which is a positive ranking factor for SEO. It does not change the content or structure of your page." },
        { q: "Is strict XML content supported?", a: "This is primarily for standard HTML5. Use with caution for XML-strict documents like SVG if they rely on whitespace." },
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="HTML Minifier"
                description="Compress HTML code by removing unnecessary whitespace, comments, and newlines."
            />

            <div className="max-w-6xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold flex items-center gap-2"><FileCode size={18} /> Input HTML</span>
                        <span className="text-xs text-muted-foreground">{input.length} chars</span>
                    </div>
                    <Textarea
                        placeholder="<div class='foo'> ... </div>"
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
                        Minify HTML <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Clean Code, Faster Web">
                    <p>
                        Every byte counts. By stripping hundreds of unnecessary characters from your HTML template,
                        you can reduce the Time To First Byte (TTFB) and improve the overall performance of your website.
                    </p>
                </ToolContentSection>
                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
