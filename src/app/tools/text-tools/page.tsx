"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Badge } from "@/components/sociials-ui/badge";
import { Copy, Trash2, ArrowUpCircle, ArrowDownCircle, Type, Eraser, FileText } from "lucide-react";

export default function TextToolsPage() {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const trimmed = text.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const stats = {
        chars: text.length,
        charsNoSpaces: text.replace(/\s/g, "").length,
        words,
        sentences: trimmed === "" ? 0 : trimmed.split(/[.!?]+/).filter(Boolean).length,
        lines: trimmed === "" ? 0 : text.split(/\r\n|\r|\n/).length,
        paragraphs: trimmed === "" ? 0 : trimmed.split(/\n\s*\n/).filter((part) => part.trim()).length,
        readingMinutes: words === 0 ? 0 : Math.ceil(words / 200),
    };

    const transform = (type: string) => {
        switch (type) {
            case "upper": setText(text.toUpperCase()); break;
            case "lower": setText(text.toLowerCase()); break;
            case "title":
                setText(text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '));
                break;
            case "clean":
                setText(text.replace(/\s+/g, ' ').trim());
                break;
            case "clear": setText(""); break;
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const faq = [
        { q: "Is there a limit to how much text can be processed?", a: "There is no fixed limit. Processing runs on the device, including long documents." },
        { q: "Can this clean code or scraped text?", a: "Clean Spaces collapses repeated whitespace in code or text copied from a web page." },
        { q: "Is the text private?", a: "The text stays in the browser tab. It is not uploaded." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Text Transformer & Analyzer"
                description="Changes case, cleans extra spaces, and counts words, characters, sentences, paragraphs, and reading time."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
                {/* Main Editor */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="border-2 overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <FileText size={14} />
                                    Input Text
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={copyToClipboard}>
                                        <Copy size={14} />
                                        {copied ? "Copied!" : "Copy"}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-destructive hover:bg-destructive/10" onClick={() => transform("clear")}>
                                        <Trash2 size={14} />
                                        Clear
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                placeholder="Paste or type your text here..."
                                className="min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-none p-6 text-lg leading-relaxed font-mono"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-12 gap-2" onClick={() => transform("upper")}>
                            <ArrowUpCircle size={16} /> UPPERCASE
                        </Button>
                        <Button variant="outline" className="h-12 gap-2" onClick={() => transform("lower")}>
                            <ArrowDownCircle size={16} /> lowercase
                        </Button>
                        <Button variant="outline" className="h-12 gap-2" onClick={() => transform("title")}>
                            <Type size={16} /> Title Case
                        </Button>
                        <Button variant="outline" className="h-12 gap-2" onClick={() => transform("clean")}>
                            <Eraser size={16} /> Clean Spaces
                        </Button>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card className="border-2">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="p-1 bg-primary/10 rounded-md text-primary">📊</span>
                                Text Statistics
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Characters", val: stats.chars },
                                    { label: "No spaces", val: stats.charsNoSpaces },
                                    { label: "Words", val: stats.words },
                                    { label: "Sentences", val: stats.sentences },
                                    { label: "Lines", val: stats.lines },
                                    { label: "Paragraphs", val: stats.paragraphs },
                                    { label: "Reading time", val: `${stats.readingMinutes} min` }
                                ].map((s) => (
                                    <div key={s.label} className="flex justify-between items-center border-b pb-2 last:border-0">
                                        <span className="text-muted-foreground">{s.label}</span>
                                        <Badge variant="secondary" className="font-mono text-base px-3 py-1">
                                            {s.val}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border-2 border-primary/20">
                        <h4 className="font-bold text-primary mb-2">What the counters include</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The panel counts characters, characters without spaces, words, sentences, lines, paragraphs, and an estimated reading time at 200 words a minute.
                        </p>
                    </div>
                </div>
            </div>

            {/* SEO CONTENT SECTION */}
            <div className="max-w-4xl mx-auto space-y-4">
                <ToolContentSection title="Case changes and word counts">
                    <p>
                        Uppercase, lowercase, and title case rewrite the letters. Clean Spaces collapses repeated whitespace. The counts ignore leading and trailing space when splitting words.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div className="space-y-2">
                            <h4 className="font-bold">Word count</h4>
                            <p className="text-sm">
                                A word is a run of characters separated by whitespace. Extra spaces between words are not counted as extra words.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold">Clean Spaces</h4>
                            <p className="text-sm">
                                Clean Spaces replaces repeated spaces, tabs, and line-edge whitespace with a single space.
                            </p>
                        </div>
                    </div>
                </ToolContentSection>

                <ToolContentSection title="Where the text is processed">
                    <p>
                        Case changes and counts run in the browser tab. The text is not uploaded to Toolioz.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
