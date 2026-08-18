"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { CheckCircle, AlertCircle, Copy, Minimize2, Maximize2, FileJson } from "lucide-react";
import { toast } from "sonner";

export default function JsonFormatterPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);

    const formatJson = (minify = false) => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
            setError(null);
            toast.success(minify ? "JSON Minified!" : "JSON Prettified!");
        } catch (e: any) {
            setError(e.message);
            setOutput("");
            toast.error("Invalid JSON");
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success("Copied to clipboard");
    };

    const faq = [
        { q: "What is JSON?", a: "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate." },
        { q: "Why use a formatter?", a: "Raw JSON from APIs often comes minified (single line). A formatter makes it readable (pretty-printed) for debugging." },
        { q: "Is my data safe?", a: "Yes. All validation and formatting happens in your browser. No data is sent to any backend." },
        { q: "What's the difference between prettify and minify?", a: "Prettify adds indentation and line breaks for readability. Minify removes all whitespace to reduce file size for production." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JSON Formatter & Validator",
        "operatingSystem": "All",
        "applicationCategory": "DeveloperApplication",
        "description": "Professional JSON beautifier, minifier, and validator for developers. Format, validate, and debug JSON instantly.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    const guideSections = [
        {
            title: "What is JSON and Why Does It Matter?",
            content: (
                <div className="space-y-4">
                    <p>
                        <strong>JSON (JavaScript Object Notation)</strong> is the lingua franca of modern web development. It's the standard format for transmitting data between a server and web application, used by virtually every REST API. Understanding JSON is essential for any developer working with web technologies, mobile apps, or data processing.
                    </p>
                    <p>
                        JSON's popularity stems from its simplicity: it uses a human-readable text format consisting of key-value pairs and ordered lists. Unlike XML, it's lightweight and doesn't require complex parsing libraries.
                    </p>
                </div>
            )
        },
        {
            title: "When to Prettify vs. Minify",
            content: (
                <div className="space-y-4">
                    <p><strong>Prettify (Beautify)</strong> is used during development and debugging. It adds indentation, line breaks, and spacing to make the JSON structure easy to read and understand.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Debugging API responses</li>
                        <li>Reviewing configuration files</li>
                        <li>Sharing code samples with teammates</li>
                    </ul>
                    <p><strong>Minify</strong> is used for production deployment. It removes all unnecessary whitespace to reduce file size, which speeds up data transfer and saves bandwidth.</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Optimizing API responses</li>
                        <li>Reducing storage costs</li>
                        <li>Faster network transfers</li>
                    </ul>
                </div>
            )
        },
        {
            title: "Privacy & Security",
            content: (
                <p>
                    Our JSON Formatter runs entirely in your browser using client-side JavaScript. Unlike online tools that send your data to a server, your JSON content <strong>never leaves your device</strong>. This makes it safe for handling sensitive data like API keys, configuration files, and user data.
                </p>
            )
        }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="JSON Formatter & Validator"
                description="Beautify, minify, and validate your JSON data instantly. A developer's best friend for debugging APIs."
            />

            <AdContainer slot="json-top" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {/* Input */}
                <Card className="h-full border-2 shadow-md">
                    <CardContent className="p-0 flex flex-col h-full min-h-[500px]">
                        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                            <span className="font-semibold text-sm flex items-center gap-2">
                                <FileJson size={16} />
                                Input JSON
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => setInput("")}>Clear</Button>
                        </div>
                        <Textarea
                            placeholder="Paste your chaotic JSON here..."
                            className="flex-1 border-0 rounded-none resize-none p-4 font-mono text-sm focus-visible:ring-0"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </CardContent>
                </Card>

                {/* Output */}
                <Card className={`h-full border-2 shadow-md ${error ? 'border-destructive/50' : ''}`}>
                    <CardContent className="p-0 flex flex-col h-full min-h-[500px]">
                        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                            <span className="font-semibold text-sm flex items-center gap-2">
                                {error ? <AlertCircle size={16} className="text-destructive" /> : <CheckCircle size={16} className="text-green-500" />}
                                {error ? "Error" : "Output"}
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => formatJson(false)}>
                                    <Maximize2 size={14} /> Prettify
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => formatJson(true)}>
                                    <Minimize2 size={14} /> Minify
                                </Button>
                                <Button variant="default" size="sm" className="h-8 gap-1.5" onClick={copyToClipboard} disabled={!output}>
                                    <Copy size={14} /> Copy
                                </Button>
                            </div>
                        </div>

                        {error ? (
                            <div className="p-6 text-destructive font-mono text-sm whitespace-pre-wrap bg-destructive/5 flex-1">
                                {error}
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                className="flex-1 border-0 rounded-none resize-none p-4 font-mono text-sm focus-visible:ring-0 bg-muted/10 text-primary"
                                value={output}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <ToolGuide
                title="JSON Formatting"
                sections={guideSections}
                faqs={faq}
            />

            <AdContainer slot="json-bottom" />
        </div>
    );
}
