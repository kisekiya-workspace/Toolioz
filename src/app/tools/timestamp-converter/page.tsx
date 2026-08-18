"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Button } from "@/components/sociials-ui/button";
import { Clock, Copy, Check, ArrowRightLeft } from "lucide-react";

export default function TimestampConverterPage() {
    const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
    const [dateString, setDateString] = useState("");
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const now = Math.floor(Date.now() / 1000);

    const parsedDate = (() => {
        const ts = parseInt(timestamp);
        if (isNaN(ts)) return null;
        // Handle both seconds and milliseconds
        const date = ts > 9999999999 ? new Date(ts) : new Date(ts * 1000);
        if (isNaN(date.getTime())) return null;
        return date;
    })();

    const dateToTimestamp = () => {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            setTimestamp(Math.floor(date.getTime() / 1000).toString());
        }
    };

    const copy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formats = parsedDate ? [
        { label: "ISO 8601", value: parsedDate.toISOString() },
        { label: "UTC String", value: parsedDate.toUTCString() },
        { label: "Local Date", value: parsedDate.toLocaleDateString() },
        { label: "Local Time", value: parsedDate.toLocaleTimeString() },
        { label: "Local DateTime", value: parsedDate.toLocaleString() },
        { label: "Unix (seconds)", value: Math.floor(parsedDate.getTime() / 1000).toString() },
        { label: "Unix (milliseconds)", value: parsedDate.getTime().toString() },
    ] : [];

    return (
        <div className="container px-6 py-12 max-w-4xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <Clock className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Timestamp Converter</h1>
                        <p className="text-muted-foreground">Convert between Unix timestamps and human-readable dates</p>
                    </div>
                </div>

                {/* Current Time */}
                <Card className="bg-muted/50">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Current Unix Timestamp</p>
                            <p className="text-2xl font-mono font-bold">{now}</p>
                        </div>
                        <Button variant="outline" onClick={() => setTimestamp(now.toString())}>
                            Use Current
                        </Button>
                    </CardContent>
                </Card>

                {/* Timestamp Input */}
                <Card>
                    <CardHeader>
                        <CardTitle>Unix Timestamp</CardTitle>
                        <CardDescription>Enter a Unix timestamp (seconds or milliseconds)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="text"
                            value={timestamp}
                            onChange={(e) => setTimestamp(e.target.value)}
                            placeholder="e.g., 1706300000"
                            className="font-mono text-lg"
                        />
                    </CardContent>
                </Card>

                {/* Date String Input */}
                <Card>
                    <CardHeader>
                        <CardTitle>Date String to Timestamp</CardTitle>
                        <CardDescription>Enter a date string to convert to Unix timestamp</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                        <Input
                            type="datetime-local"
                            value={dateString}
                            onChange={(e) => setDateString(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={dateToTimestamp}>
                            <ArrowRightLeft className="h-4 w-4 mr-2" /> Convert
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                {parsedDate && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Converted Formats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formats.map((format) => (
                                <div key={format.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{format.label}</p>
                                        <p className="font-mono">{format.value}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => copy(format.value, format.label)}
                                    >
                                        {copiedField === format.label ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {!parsedDate && timestamp && (
                    <Card className="border-destructive">
                        <CardContent>
                            <p className="text-destructive">Invalid timestamp</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
