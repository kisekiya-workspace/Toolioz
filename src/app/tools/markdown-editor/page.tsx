"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { renderToStaticMarkup } from 'react-dom/server';
import { ToolHeader } from '@/components/sociials-tools/ToolHeader';
import { toast } from 'sonner';
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

    const copyHTML = async () => {
        try {
            const html = renderToStaticMarkup(<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>);
            await navigator.clipboard.writeText(html);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('HTML copied');
        } catch {
            toast.error('Clipboard access was blocked. You can still select and copy the preview text.');
        }
    };

    return (
        <div className="container px-6 py-12 max-w-6xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <ToolHeader title="Markdown Editor" description="Write Markdown with a live, safe preview and copy its rendered HTML." />

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Editor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                aria-label="Markdown source"
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
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h1: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2> }}>{markdown}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <section className="rounded-xl border border-border p-6 text-sm leading-6">
                    <h2 className="text-lg font-semibold">Write, preview, then export</h2>
                    <p className="mt-3 text-muted-foreground">Try # Heading, **bold**, a bullet list, or a fenced code block. The preview supports GitHub-style tables, task lists, and strikethrough. Copy HTML exports the rendered content, not this editor interface.</p>
                    <p className="mt-3 text-muted-foreground">Raw HTML is displayed as text, not executed. Unsafe link protocols are filtered. This is a Markdown renderer, not a script or HTML playground.</p>
                </section>
            </div>
        </div>
    );
}
