"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Textarea } from "@/components/sociials-ui/textarea";
import { FileText, Copy, Check } from "lucide-react";
import { Button } from "@/components/sociials-ui/button";

export default function MarkdownEditorPage() {
    const [markdown, setMarkdown] = useState(`# Hello World

This is a **Markdown** editor with live preview.

## Features
- Real-time preview
- Supports all standard Markdown syntax
- Copy rendered HTML

### Code Example
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote.

[Visit Toolioz](https://toolioz.com)
`);
    const [copied, setCopied] = useState(false);

    const parseMarkdown = (text: string): string => {
        return text
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
            .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded my-4 overflow-x-auto"><code>$2</code></pre>')
            .replace(/`(.*?)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
            .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 pl-4 italic text-muted-foreground my-4">$1</blockquote>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>')
            .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
            .replace(/\n/gim, '<br />');
    };

    const copyHTML = () => {
        navigator.clipboard.writeText(parseMarkdown(markdown));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container px-6 py-12 max-w-6xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <FileText className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Markdown Editor</h1>
                        <p className="text-muted-foreground">Write and preview Markdown in real-time</p>
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Editor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                className="min-h-[500px] font-mono text-sm resize-none leading-relaxed"
                                placeholder="Write your Markdown here..."
                            />
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Preview</CardTitle>
                            <Button variant="outline" size="sm" onClick={copyHTML}>
                                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? "Copied!" : "Copy HTML"}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none min-h-[500px] p-6 border rounded-lg bg-muted/30"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
