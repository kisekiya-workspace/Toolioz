"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Textarea } from "@/components/sociials-ui/textarea";
import { AlignLeft } from "lucide-react";

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
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <AlignLeft className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Word Counter</h1>
                        <p className="text-muted-foreground">Count words, characters, sentences, and more</p>
                    </div>
                </div>

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
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste or type your text here..."
                            className="min-h-[400px] resize-none text-base leading-relaxed"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
