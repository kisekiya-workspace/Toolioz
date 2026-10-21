"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Textarea } from "@/components/sociials-ui/textarea";
import { ToolHeader } from '@/components/sociials-tools/ToolHeader';

export default function WordCounterPage() {
    const [text, setText] = useState("");

    const stats = useMemo(() => {
        const trimmed = text.trim();
        if (!trimmed) {
            return { characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, readingTime: 0 };
        }

        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = trimmed.split(/\s+/).filter(w => w.length > 0).length;
        const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = trimmed.split(/\n\n+/).filter(p => p.trim().length > 0).length;
        const readingTime = Math.ceil(words / 200);

        return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTime };
    }, [text]);

    return (
        <div className="container px-6 py-12 max-w-4xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <ToolHeader title="Word Counter" description="Count words, characters, sentences, and paragraphs as you type, with an estimated reading time." />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: "Characters", value: stats.characters },
                        { label: "No Spaces", value: stats.charactersNoSpaces },
                        { label: "Words", value: stats.words },
                        { label: "Sentences", value: stats.sentences },
                        { label: "Paragraphs", value: stats.paragraphs },
                        { label: "Read Time", value: `${stats.readingTime} min` },
                    ].map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Text Input */}
                <Card>
                    <CardHeader>
                        <CardTitle>Enter Your Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            aria-label="Text to count"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste or type your text here..."
                            className="min-h-[400px] resize-none text-base leading-relaxed"
                        />
                    </CardContent>
                </Card>
                <section className="rounded-xl border border-border p-6 text-sm leading-6">
                    <h2 className="text-lg font-semibold">How the counts work</h2>
                    <p className="mt-3 text-muted-foreground">Paste or type your text to update every count automatically. For example, “Hello world!” counts as two words and one sentence. Words are separated by whitespace; paragraphs are separated by blank lines. Reading time assumes 200 words per minute.</p>
                    <p className="mt-3 text-muted-foreground">These are practical estimates, not language-aware analysis: abbreviations and punctuation can affect sentence counts, and languages without spaces need a different word-segmentation method.</p>
                </section>
            </div>
        </div>
    );
}
