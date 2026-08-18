"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Copy, Trash2, Play } from "lucide-react";
import { toast } from "sonner";
import { format } from "sql-formatter";

export default function SqlFormatterPage() {
    const [input, setInput] = useState("SELECT * FROM users WHERE id = 1");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("sql");
    const [error, setError] = useState<string | null>(null);

    const handleFormat = () => {
        try {
            setError(null);
            const formatted = format(input, {
                language: language as any,
                tabWidth: 2,
                keywordCase: 'upper',
            });
            setOutput(formatted);
        } catch (err: any) {
            setError(err.message || "Failed to format SQL");
            toast.error("Invalid SQL syntax");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        toast.success("SQL copied to clipboard!");
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-6xl">
            <ToolHeader
                title="SQL Formatter"
                description="Beautify and format your SQL queries for better readability."
            />

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Input SQL</h3>
                        <div className="flex gap-2">
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sql">Standard SQL</SelectItem>
                                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                    <SelectItem value="mysql">MySQL</SelectItem>
                                    <SelectItem value="plsql">PL/SQL</SelectItem>
                                    <SelectItem value="bigquery">BigQuery</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button size="sm" variant="ghost" onClick={() => setInput("")}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="SELECT * FROM table..."
                        className="h-[400px] font-mono text-sm"
                    />
                    <Button onClick={handleFormat} className="w-full font-bold">
                        <Play className="w-4 h-4 mr-2" /> Format Query
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center h-8">
                        <h3 className="font-semibold">Formatted Output</h3>
                        {output && (
                            <Button size="sm" variant="outline" onClick={copyToClipboard} className="h-8">
                                <Copy className="h-3 w-3 mr-2" /> Copy
                            </Button>
                        )}
                    </div>
                    <div className="relative h-[400px] bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm overflow-auto border border-slate-800">
                        {error ? (
                            <div className="text-red-400">{error}</div>
                        ) : output ? (
                            <pre>{output}</pre>
                        ) : (
                            <div className="text-slate-500 italic">Formatted result will appear here...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
