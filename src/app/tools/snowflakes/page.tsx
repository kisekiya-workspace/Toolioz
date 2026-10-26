"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Search, Calendar, Clock, User } from "lucide-react";

export default function SnowflakeParserPage() {
    const [id, setId] = useState("");
    const [result, setResult] = useState<{ date: string; timestamp: number } | null>(null);
    const [error, setError] = useState("");

    const parseSnowflake = () => {
        setError("");
        setResult(null);

        if (!id) return;

        try {
            // Snowflake logic: (id >> 22) + 1420070400000
            const DISCORD_EPOCH = 1420070400000;
            const idBigInt = BigInt(id);

            if (idBigInt < BigInt('10000000000000000')) { // Basic length check (approx 17-19 chars)
                setError("That ID looks too short to be a valid Discord Snowflake.");
                return;
            }

            const timestamp = Number((idBigInt >> BigInt(22)) + BigInt(DISCORD_EPOCH));
            const date = new Date(timestamp);

            setResult({
                date: date.toLocaleString(),
                timestamp: timestamp
            });
        } catch (e) {
            setError("Invalid ID format. Please enter a numeric ID.");
        }
    };

    const faq = [
        { q: "What is a Snowflake ID?", a: "This page treats the id as a Discord snowflake. The time is (id >> 22) + 1420070400000, then shown with toLocaleString(). Worker, process, and increment bits are not displayed." },
        { q: "Does the page contact Discord?", a: "No. The page only does that arithmetic in the browser. It does not call Discord or read an account." },
        { q: "How do I find an ID?", a: "Turn on 'Developer Mode' in Discord Settings > Advanced, then right-click any user or message and select 'Copy ID'." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Discord Snowflake Parser"
                description="Reads a Discord snowflake and shows the time encoded in that id."
            />

            <div className="max-w-2xl mx-auto mb-16 space-y-8">
                <div className="flex gap-4">
                    <Input
                        placeholder="Paste Discord ID (e.g., 10394857...)"
                        className="h-14 text-lg"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <Button size="lg" className="h-14 px-8" onClick={parseSnowflake}>
                        <Search size={20} className="mr-2" /> Lookup
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center font-medium">
                        {error}
                    </div>
                )}

                {result && (
                    <Card className="border-2 animate-in fade-in slide-in-from-bottom-4">
                        <CardContent className="p-8 space-y-6">
                            <div className="text-center space-y-2">
                                <User className="h-12 w-12 mx-auto text-primary bg-primary/10 p-2 rounded-full mb-4" />
                                <h3 className="text-2xl font-bold">Creation Date Found</h3>
                                <p className="text-muted-foreground">ID: {id}</p>
                            </div>

                            <div className="grid gap-4 bg-muted/30 p-6 rounded-xl border">
                                <div className="flex items-center gap-4">
                                    <Calendar className="text-primary h-5 w-5" />
                                    <span className="font-mono text-lg">{result.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Clock className="text-primary h-5 w-5" />
                                    <span className="font-mono text-lg text-muted-foreground">{result.timestamp} (Unix Ms)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="What the parser reads">
                    <p>
                        Ever wondered when a Discord server was created or how old a user account is?
                        Because Discord stores a timestamp in a snowflake, this page can read that time. It shifts the id 22 bits and adds 1420070400000, then shows the result in the browser's local timezone. It does not call Discord.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="The Anatomy of a Snowflake ID">
                    <p>
                        Discord uses a custom ID format called "Snowflakes". These are 64-bit integers that are unique across the entire platform.
                        What makes them special is that they are time-ordered.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                        <li><strong>Bits 63-22</strong>: Timestamp (milliseconds since Discord Epoch - the first second of 2015).</li>
                        <li><strong>Bits 21-17</strong>: Internal worker ID.</li>
                        <li><strong>Bits 16-12</strong>: Internal process ID.</li>
                        <li><strong>Bits 11-0</strong>: Inline increment (sequence number).</li>
                    </ul>
                </ToolContentSection>

                <ToolContentSection title="Why Twitter & Discord use Snowflakes">
                    <p>
                        Discord documents snowflakes as 64-bit ids that include a timestamp. This page only decodes that timestamp. It does not check that an id is unique, and it does not generate one.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
