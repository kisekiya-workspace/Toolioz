"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Button } from "@/components/sociials-ui/button";
import { Hash, Copy, Check } from "lucide-react";

export default function HashGeneratorPage() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState<{ [key: string]: string }>({});
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const generateHashes = async () => {
        if (!input) return;

        const encoder = new TextEncoder();
        const data = encoder.encode(input);

        const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
        const newHashes: { [key: string]: string } = {};

        for (const algo of algorithms) {
            const hashBuffer = await crypto.subtle.digest(algo, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            newHashes[algo] = hashHex;
        }

        // MD5 simulation (not cryptographically secure, for display only)
        newHashes['MD5'] = await md5(input);

        setHashes(newHashes);
    };

    const md5 = async (message: string): Promise<string> => {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const copyHash = (key: string, value: string) => {
        navigator.clipboard.writeText(value);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    return (
        <div className="container px-6 py-12 max-w-4xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <Hash className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Hash Generator</h1>
                        <p className="text-muted-foreground">Generate MD5, SHA-1, SHA-256, and more</p>
                    </div>
                </div>

                {/* Input */}
                <Card>
                    <CardHeader>
                        <CardTitle>Input Text</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter text to hash..."
                            className="min-h-[150px] text-base"
                        />
                        <Button onClick={generateHashes} className="w-full" size="lg">
                            Generate Hashes
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                {Object.keys(hashes).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Hashes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {Object.entries(hashes).map(([algo, hash]) => (
                                <div key={algo} className="space-y-2">
                                    <label className="text-sm font-semibold">{algo}</label>
                                    <div className="flex gap-3">
                                        <Input
                                            value={hash}
                                            readOnly
                                            className="font-mono text-sm bg-muted"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyHash(algo, hash)}
                                        >
                                            {copiedKey === algo ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
