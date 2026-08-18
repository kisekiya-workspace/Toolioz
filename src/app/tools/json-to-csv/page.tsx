"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Button } from "@/components/sociials-ui/button";
import { Table, Copy, Check, Download, ArrowRight } from "lucide-react";

export default function JsonToCsvPage() {
    const [jsonInput, setJsonInput] = useState(`[
  { "name": "John", "age": 30, "city": "New York" },
  { "name": "Jane", "age": 25, "city": "London" },
  { "name": "Bob", "age": 35, "city": "Paris" }
]`);
    const [csvOutput, setCsvOutput] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const convertToCSV = () => {
        try {
            setError("");
            const data = JSON.parse(jsonInput);

            if (!Array.isArray(data)) {
                throw new Error("JSON must be an array of objects");
            }

            if (data.length === 0) {
                setCsvOutput("");
                return;
            }

            // Get all unique keys
            const headers = [...new Set(data.flatMap(obj => Object.keys(obj)))];

            // Create CSV rows
            const rows = data.map(obj =>
                headers.map(header => {
                    const value = obj[header];
                    if (value === null || value === undefined) return "";
                    if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return String(value);
                }).join(",")
            );

            const csv = [headers.join(","), ...rows].join("\n");
            setCsvOutput(csv);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setCsvOutput("");
        }
    };

    const copyCSV = () => {
        navigator.clipboard.writeText(csvOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadCSV = () => {
        const blob = new Blob([csvOutput], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "data.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container px-6 py-12 max-w-5xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <Table className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">JSON to CSV Converter</h1>
                        <p className="text-muted-foreground">Convert JSON arrays to CSV format</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* JSON Input */}
                    <Card>
                        <CardHeader>
                            <CardTitle>JSON Input</CardTitle>
                            <CardDescription>Paste your JSON array of objects</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={jsonInput}
                                onChange={(e) => setJsonInput(e.target.value)}
                                placeholder='[{ "key": "value" }]'
                                className="min-h-[350px] font-mono text-sm"
                            />
                            <Button onClick={convertToCSV} className="w-full">
                                Convert to CSV <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* CSV Output */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>CSV Output</CardTitle>
                                <CardDescription>Converted CSV data</CardDescription>
                            </div>
                            {csvOutput && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={copyCSV}>
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={downloadCSV}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={csvOutput}
                                readOnly
                                placeholder="CSV output will appear here..."
                                className="min-h-[350px] font-mono text-sm bg-muted"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
