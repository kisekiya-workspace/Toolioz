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

    const stats = {
        chars: text.length,
        words: text.trim() === "" ? 0 : text.trim().split(/\s+/).length,
        sentences: text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length,
        lines: text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).length,
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
        { q: "Is there a limit to how much text I can process?", a: "No practical limit. Since the processing happens on your device, it can handle even very large documents (hundreds of pages) instantly." },
        { q: "Can I use this for coding text?", a: "Yes, the 'Clean Spaces' function is especially useful for cleaning up messy code or formatting scraped text from the web." },
        { q: "Is my text private?", a: "100%. Your text is never sent to our servers. It stays in your browser's memory until you close the tab." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Text Transformer & Analyzer"
                description="A versatile set of tools to clean, format, and analyze your text. Perfect for writers, developers, and students."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
                {/* Main Editor */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="border-2 shadow-lg overflow-hidden">
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
                    <Card className="border-2 shadow-md">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                <span className="p-1 bg-primary/10 rounded-md text-primary">📊</span>
                                Text Statistics
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Characters", val: stats.chars },
                                    { label: "Words", val: stats.words },
                                    { label: "Sentences", val: stats.sentences },
                                    { label: "Lines", val: stats.lines }
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
                        <h4 className="font-bold text-primary mb-2 italic underline underline-offset-4">Why use this?</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Use this tool to prepare content for social media, clean up messy transcriptions,
                            or analyze the length of your essays and articles instantly.
                        </p>
                    </div>
                </div>
            </div>

            {/* SEO CONTENT SECTION */}
            <div className="max-w-4xl mx-auto space-y-4">
                <ToolContentSection title="Professional Text Transformation Tool">
                    <p>
                        In the digital age, text formatting can be a tedious task. Our Text Transformer simplifies this by providing
                        one-click solutions for common editing needs. Whether you need to convert all-caps headlines into readable
                        lowercase letters or want to capitalize every word for a formal title, our tool handles it with precision.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div className="space-y-2">
                            <h4 className="font-bold">Accurate Word Counting</h4>
                            <p className="text-sm">
                                Perfect for students and freelance writers who need to meet strict word count requirements.
                                Our algorithm filters out extra spaces to provide an exact count of words, characters, and sentences.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold">Text Sanitization</h4>
                            <p className="text-sm">
                                The 'Clean Spaces' feature removes double spaces, leading/trailing whitespace, and tabs,
                                leaving you with a perfectly formatted block of text ready for publication.
                            </p>
                        </div>
                    </div>
                </ToolContentSection>

                <ToolContentSection title="Privacy Matters">
                    <p>
                        Unlike many online "case converters" that log your input for data training or analytics,
                        <strong>ToolBox treats your data as sacred.</strong> All processing is done via your browser's local JavaScript engine.
                        When you type in our editor, the text never leaves your device's memory. This is the ultimate tool for
                        processing sensitive documents or personal notes with complete peace of mind.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
