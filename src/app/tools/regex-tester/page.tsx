"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Badge } from "@/components/sociials-ui/badge";
import { ScrollArea } from "@/components/sociials-ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/sociials-ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { AlertCircle, ChevronRight, Share2 } from "lucide-react";
import { RegexVisualizer } from "@/components/sociials-tools/regex-tester/RegexVisualizer";

export default function RegexTesterPage() {
    const [regexStr, setRegexStr] = useState("");
    const [flags, setFlags] = useState("gm");
    const [testString, setTestString] = useState("Hello world! Contact us at test@example.com or support@site.org.\nCall us at (555) 123-4567.");
    const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
    const [error, setError] = useState("");

    // Analyze Regex
    useEffect(() => {
        try {
            setError("");
            if (!regexStr) {
                setMatches([]);
                return;
            }
            const regex = new RegExp(regexStr, flags);
            const newMatches = Array.from(testString.matchAll(regex));
            setMatches(newMatches);
        } catch (e) {
            setError((e as Error).message);
            setMatches([]);
        }
    }, [regexStr, flags, testString]);

    const highlightText = () => {
        if (!regexStr || error) return testString;

        try {
            const regex = new RegExp(regexStr, flags);
            let lastIndex = 0;
            const elements = [];
            const currentMatches = Array.from(testString.matchAll(regex));

            if (currentMatches.length === 0) return testString;

            currentMatches.forEach((match, i) => {
                const matchIndex = match.index!;
                const matchText = match[0];

                if (matchIndex > lastIndex) {
                    elements.push(testString.slice(lastIndex, matchIndex));
                }

                elements.push(
                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground rounded px-0.5 border-b-2 border-yellow-500" title={`Match ${i + 1}`}>
                        {matchText}
                    </mark>
                );

                lastIndex = matchIndex + matchText.length;
            });

            if (lastIndex < testString.length) {
                elements.push(testString.slice(lastIndex));
            }

            return elements;

        } catch (e) {
            return testString;
        }
    };

    const loadPattern = (pattern: string, flagsVal: string = "gm") => {
        setRegexStr(pattern);
        setFlags(flagsVal);
    };

    return (
        <div className="container px-4 py-8 m-auto max-w-[1400px]">
            <ToolHeader
                title="Regex Tester & Debugger"
                description="Test expressions, analyze matches, and visualize patterns with railroad diagrams."
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 pb-12">

                {/* Left: Cheat Sheet */}
                <div className="xl:col-span-1 space-y-6 order-2 xl:order-1">
                    <Card className="h-[600px] xl:h-[800px] flex flex-col border-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Cheat Sheet</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 p-0">
                            <ScrollArea className="h-full px-4">
                                <Accordion type="single" collapsible defaultValue="character-classes" className="w-full">
                                    <AccordionItem value="character-classes">
                                        <AccordionTrigger>Character Classes</AccordionTrigger>
                                        <AccordionContent className="space-y-2 text-sm">
                                            <CheatItem code="." desc="Any character excerpt newline" />
                                            <CheatItem code="\w" desc="Word character [a-zA-Z0-9_]" />
                                            <CheatItem code="\d" desc="Digit [0-9]" />
                                            <CheatItem code="\s" desc="Whitespace" />
                                            <CheatItem code="[abc]" desc="Any of a, b, or c" />
                                            <CheatItem code="[^abc]" desc="Not a, b, or c" />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="anchors">
                                        <AccordionTrigger>Anchors</AccordionTrigger>
                                        <AccordionContent className="space-y-2 text-sm">
                                            <CheatItem code="^" desc="Start of string/line" />
                                            <CheatItem code="$" desc="End of string/line" />
                                            <CheatItem code="\b" desc="Word boundary" />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="quantifiers">
                                        <AccordionTrigger>Quantifiers</AccordionTrigger>
                                        <AccordionContent className="space-y-2 text-sm">
                                            <CheatItem code="*" desc="0 or more" />
                                            <CheatItem code="+" desc="1 or more" />
                                            <CheatItem code="?" desc="0 or 1" />
                                            <CheatItem code="{3}" desc="Exactly 3" />
                                            <CheatItem code="{3,}" desc="3 or more" />
                                            <CheatItem code="{3,6}" desc="Between 3 and 6" />
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="groups">
                                        <AccordionTrigger>Groups & Lookaround</AccordionTrigger>
                                        <AccordionContent className="space-y-2 text-sm">
                                            <CheatItem code="(abc)" desc="Capture group" />
                                            <CheatItem code="(?:abc)" desc="Non-capturing group" />
                                            <CheatItem code="(?=abc)" desc="Positive lookahead" />
                                            <CheatItem code="(?!abc)" desc="Negative lookahead" />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Center: Editor */}
                <div className="xl:col-span-2 space-y-6 order-1 xl:order-2">
                    <Card className="border-2 shadow-md">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Regular Expression</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
                                        <Input
                                            value={regexStr}
                                            onChange={(e) => setRegexStr(e.target.value)}
                                            placeholder="pattern (e.g. ^[a-z]+$)"
                                            className="pl-6 pr-2 font-mono text-lg h-12"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
                                    </div>
                                    <div className="w-24">
                                        <Input
                                            value={flags}
                                            onChange={(e) => setFlags(e.target.value)}
                                            placeholder="gims"
                                            className="font-mono text-lg h-12 text-center"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded-md border border-red-200 dark:border-red-900">
                                    <AlertCircle size={16} />
                                    <span className="font-mono text-sm">{error}</span>
                                </div>
                            )}

                            {/* TABS: Match vs Visualize */}
                            <Tabs defaultValue="test" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="test">Test String</TabsTrigger>
                                    <TabsTrigger value="visualize" className="flex gap-2 items-center"><Share2 size={14} className="rotate-90" /> Railroad Diagram</TabsTrigger>
                                </TabsList>

                                <TabsContent value="test" className="space-y-2 mt-4">
                                    <div className="relative">
                                        <Textarea
                                            value={testString}
                                            onChange={(e) => setTestString(e.target.value)}
                                            placeholder="Paste your test string here..."
                                            className="font-mono text-lg min-h-[150px] leading-relaxed resize-y z-10 relative bg-transparent"
                                            style={{ color: 'transparent', caretColor: 'currentColor' }}
                                        />
                                        <div className="absolute inset-0 p-3 font-mono text-lg leading-relaxed whitespace-pre-wrap break-all pointer-events-none border border-transparent overflow-hidden text-muted-foreground/40 hidden">
                                            {/* Hidden overlay logic placeholder */}
                                        </div>
                                        <Textarea
                                            value={testString}
                                            onChange={(e) => setTestString(e.target.value)}
                                            placeholder="Paste your test string here..."
                                            className="font-mono text-lg min-h-[150px] leading-relaxed resize-y absolute inset-0 bg-background"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="visualize" className="mt-4">
                                    <RegexVisualizer regexStr={regexStr} />
                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                        Diagram generated automatically from your pattern.
                                    </p>
                                </TabsContent>
                            </Tabs>

                        </CardContent>
                    </Card>

                    {/* Match Results (Only show on Test tab conceptually, but we keep it visible or maybe stick to below?) */}
                    {/* Actually, it makes sense to always show matches if test string is relevant. */}

                    <Card className="border-2 shadow-md">
                        <CardHeader className="pb-3 border-b">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Match Preview</CardTitle>
                                <Badge variant={matches.length > 0 ? "default" : "secondary"}>
                                    {matches.length} Match{matches.length !== 1 ? "es" : ""}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="font-mono text-lg leading-relaxed whitespace-pre-wrap break-all">
                                {highlightText()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Library & Details */}
                <div className="xl:col-span-1 space-y-6 order-3">
                    <Card className="border-2 max-h-[400px] flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Common Patterns</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto">
                            <div className="grid divide-y">
                                <PatternItem name="Email Address" pattern="[\w-\.]+@([\w-]+\.)+[\w-]{2,4}" onClick={loadPattern} />
                                <PatternItem name="IPv4 Address" pattern="\b(?:\d{1,3}\.){3}\d{1,3}\b" onClick={loadPattern} />
                                <PatternItem name="Date (YYYY-MM-DD)" pattern="\d{4}-\d{2}-\d{2}" onClick={loadPattern} />
                                <PatternItem name="URL" pattern="https?:\/\/[\w\-\.]+(?:\.[\w\-\.]+)+" onClick={loadPattern} />
                                <PatternItem name="HTML Tag" pattern="<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)" onClick={loadPattern} />
                                <PatternItem name="Hex Color" pattern="#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})" onClick={loadPattern} />
                            </div>
                        </CardContent>
                    </Card>

                    {matches.length > 0 && (
                        <Card className="border-2 border-primary/20">
                            <CardHeader className="pb-2 bg-muted/20">
                                <CardTitle className="text-lg">Match Inspector</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[300px]">
                                    <div className="divide-y">
                                        {matches.map((match, i) => (
                                            <div key={i} className="p-4 hover:bg-muted/50 transition">
                                                <div className="flex justify-between items-baseline mb-2">
                                                    <span className="font-semibold text-sm">Match {i + 1}</span>
                                                    <span className="font-mono text-xs text-muted-foreground">Index: {match.index}</span>
                                                </div>
                                                <div className="font-mono text-sm bg-background p-2 rounded border mb-2 break-all">
                                                    {match[0]}
                                                </div>
                                                {match.length > 1 && (
                                                    <div className="space-y-1 mt-2 pl-2 border-l-2">
                                                        {Array.from(match).slice(1).map((group, groupIdx) => (
                                                            <div key={groupIdx} className="text-xs grid grid-cols-[auto_1fr] gap-2">
                                                                <span className="text-muted-foreground">Group {groupIdx + 1}:</span>
                                                                <span className="font-mono font-medium">{group || <span className="italic text-muted-foreground/50">undefined</span>}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <ToolContentSection title="About Regular Expressions">
                <p>
                    Regular expressions (regex) are sequences of characters that define a search pattern.
                    They are widely used for string searching and manipulation. This tester processes regex in real-time
                    using JavaScript's native engine.
                </p>
                <h3 className="text-lg font-semibold mt-4">Railroad Diagrams</h3>
                <p>
                    The "Railroad Diagram" view visualizes your regex pattern as a flow chart. Read it from left to right.
                    Lines that split represent "OR" choices, and loops represent repeated characters.
                </p>
            </ToolContentSection>
        </div>
    );
}

function CheatItem({ code, desc }: { code: string, desc: string }) {
    return (
        <div className="grid grid-cols-[60px_1fr] items-center gap-2 group cursor-pointer hover:bg-muted/50 p-1 rounded"
            onClick={() => navigator.clipboard.writeText(code)}
            title="Click to copy"
        >
            <code className="text-primary font-bold bg-muted px-1.5 py-0.5 rounded text-center group-hover:bg-background transition">{code}</code>
            <span className="text-muted-foreground">{desc}</span>
        </div>
    );
}

function PatternItem({ name, pattern, onClick }: { name: string, pattern: string, onClick: (p: string) => void }) {
    return (
        <button
            onClick={() => onClick(pattern)}
            className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition text-sm group"
        >
            <span className="font-medium group-hover:text-primary transition">{name}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
