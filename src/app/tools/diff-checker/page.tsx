"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Button } from "@/components/sociials-ui/button";
import { GitCompare, ArrowRight } from "lucide-react";

export default function DiffCheckerPage() {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");

    const diff = useMemo(() => {
        if (!text1 && !text2) return null;

        const lines1 = text1.split("\n");
        const lines2 = text2.split("\n");
        const maxLines = Math.max(lines1.length, lines2.length);

        const result: { line1: string; line2: string; status: "same" | "removed" | "added" | "changed" }[] = [];

        for (let i = 0; i < maxLines; i++) {
            const l1 = lines1[i] || "";
            const l2 = lines2[i] || "";

            if (l1 === l2) {
                result.push({ line1: l1, line2: l2, status: "same" });
            } else if (!l1 && l2) {
                result.push({ line1: "", line2: l2, status: "added" });
            } else if (l1 && !l2) {
                result.push({ line1: l1, line2: "", status: "removed" });
            } else {
                result.push({ line1: l1, line2: l2, status: "changed" });
            }
        }

        return result;
    }, [text1, text2]);

    const stats = useMemo(() => {
        if (!diff) return { same: 0, added: 0, removed: 0, changed: 0 };
        return {
            same: diff.filter(d => d.status === "same").length,
            added: diff.filter(d => d.status === "added").length,
            removed: diff.filter(d => d.status === "removed").length,
            changed: diff.filter(d => d.status === "changed").length,
        };
    }, [diff]);

    const clearAll = () => {
        setText1("");
        setText2("");
    };

    const swapTexts = () => {
        const temp = text1;
        setText1(text2);
        setText2(temp);
    };

    return (
        <div className="container px-6 py-12 max-w-6xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <GitCompare className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Diff Checker</h1>
                        <p className="text-muted-foreground">Compare two texts and find differences</p>
                    </div>
                </div>

                {/* Input Areas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Original Text</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={text1}
                                onChange={(e) => setText1(e.target.value)}
                                placeholder="Paste original text here..."
                                className="min-h-[250px] font-mono text-sm"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Modified Text</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={text2}
                                onChange={(e) => setText2(e.target.value)}
                                placeholder="Paste modified text here..."
                                className="min-h-[250px] font-mono text-sm"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={swapTexts}>
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Swap
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                        Clear All
                    </Button>
                </div>

                {/* Stats */}
                {diff && (text1 || text2) && (
                    <div className="grid grid-cols-4 gap-4">
                        <Card className="bg-muted/50">
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold">{stats.same}</div>
                                <div className="text-sm text-muted-foreground">Same</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-500/10 border-green-500/30">
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.added}</div>
                                <div className="text-sm text-muted-foreground">Added</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-red-500/10 border-red-500/30">
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold text-red-600">{stats.removed}</div>
                                <div className="text-sm text-muted-foreground">Removed</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-yellow-500/10 border-yellow-500/30">
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">{stats.changed}</div>
                                <div className="text-sm text-muted-foreground">Changed</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Diff Output */}
                {diff && (text1 || text2) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Comparison Result</CardTitle>
                            <CardDescription>Line-by-line comparison</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-2 bg-muted text-sm font-medium">
                                    <div className="p-3 border-r">Original</div>
                                    <div className="p-3">Modified</div>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {diff.map((line, i) => (
                                        <div
                                            key={i}
                                            className={`grid grid-cols-2 text-sm font-mono border-t ${line.status === "same" ? "" :
                                                    line.status === "added" ? "bg-green-500/10" :
                                                        line.status === "removed" ? "bg-red-500/10" :
                                                            "bg-yellow-500/10"
                                                }`}
                                        >
                                            <div className={`p-2 border-r min-h-[2rem] ${line.status === "removed" ? "bg-red-500/20" : ""}`}>
                                                <span className="text-muted-foreground mr-2 select-none">{i + 1}</span>
                                                {line.line1}
                                            </div>
                                            <div className={`p-2 min-h-[2rem] ${line.status === "added" ? "bg-green-500/20" : ""}`}>
                                                <span className="text-muted-foreground mr-2 select-none">{i + 1}</span>
                                                {line.line2}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
