"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { Badge } from "@/components/sociials-ui/badge";

export default function JwtDecoderPage() {
    const [token, setToken] = useState("");
    const [decodedHeader, setDecodedHeader] = useState<any>(null);
    const [decodedPayload, setDecodedPayload] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDecode = (input: string) => {
        setToken(input);
        setError(null);
        setDecodedHeader(null);
        setDecodedPayload(null);

        if (!input.trim()) return;

        try {
            const decoded = jwtDecode(input);
            const header = jwtDecode(input, { header: true });
            setDecodedPayload(decoded);
            setDecodedHeader(header);
        } catch (err) {
            setError("Invalid JWT Token format");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(JSON.stringify(text, null, 2));
        toast.success("JSON copied to clipboard!");
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-6xl">
            <ToolHeader
                title="JWT Decoder"
                description="Decode JSON Web Tokens to inspect their payload and header securely."
            />

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                <div className="space-y-6">
                    <Card className="border-0 shadow-lg ring-1 ring-border/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-lg">Encoded Token</h3>
                                <Button size="sm" variant="ghost" onClick={() => setToken("")}>Clear</Button>
                            </div>
                            <Textarea
                                placeholder="Paste your JWT here (e.g. eyJhbGci...)"
                                value={token}
                                onChange={(e) => handleDecode(e.target.value)}
                                className="min-h-[300px] font-mono text-sm resize-none bg-muted/20"
                            />
                            {error && (
                                <div className="flex items-center gap-2 text-destructive text-sm font-medium p-3 bg-destructive/10 rounded-lg">
                                    <AlertTriangle className="h-4 w-4" /> {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-0 shadow-lg ring-1 ring-border/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-lg">Header</h3>
                                {decodedHeader && (
                                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(decodedHeader)}>
                                        <Copy className="h-3 w-3 mr-2" /> Copy
                                    </Button>
                                )}
                            </div>
                            <div className="relative min-h-[100px] max-h-[200px] overflow-auto bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm">
                                {decodedHeader ? (
                                    <pre>{JSON.stringify(decodedHeader, null, 2)}</pre>
                                ) : (
                                    <span className="text-slate-500 italic">Waiting for input...</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <h3 className="font-semibold text-lg">Payload</h3>
                                {decodedPayload && (
                                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(decodedPayload)}>
                                        <Copy className="h-3 w-3 mr-2" /> Copy
                                    </Button>
                                )}
                            </div>
                            <div className="relative min-h-[200px] overflow-auto bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm">
                                {decodedPayload ? (
                                    <pre>{JSON.stringify(decodedPayload, null, 2)}</pre>
                                ) : (
                                    <span className="text-slate-500 italic">Waiting for input...</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
