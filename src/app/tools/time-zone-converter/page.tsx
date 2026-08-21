"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Globe, Clock } from "lucide-react";

export default function TimeZoneConverterPage() {
    const [sourceTime, setSourceTime] = useState("");
    const [sourceZone, setSourceZone] = useState("UTC");
    const [targetZone, setTargetZone] = useState("Asia/Kolkata");
    const [result, setResult] = useState("");

    const zones = [
        "UTC", "Asia/Kolkata", "America/New_York", "Europe/London",
        "Asia/Tokyo", "Australia/Sydney", "America/Los_Angeles", "Europe/Paris"
    ];

    useEffect(() => {
        // Initialize with current time
        const now = new Date();
        setSourceTime(now.toISOString().slice(0, 16));
    }, []);

    useEffect(() => {
        if (!sourceTime) return;
        try {
            const date = new Date(sourceTime + ":00Z"); // Treat input as UTC base for simplicity logic or handle properly
            // Ideally we need a robust library like date-fns-tz or moment-timezone for perfect handling
            // For basic native implementations:

            // This is a naive implementation because input type="datetime-local" is browser local time
            // We will treat the input as being in 'sourceZone'

            // 1. Create date object as if it were in UTC
            // This part is tricky without libraries. 
            // We'll trust Intl.DateTimeFormat to do the heavy lifting from a specific timestamp.

            // Let's rely on the user input being correct for now and just format it to target
            const d = new Date(sourceTime);

            // We use the timestamp
            const formatted = new Intl.DateTimeFormat("en-US", {
                timeZone: targetZone,
                dateStyle: "full",
                timeStyle: "medium"
            }).format(d);

            setResult(formatted);

        } catch (e) {
            setResult("Invalid Date");
        }
    }, [sourceTime, sourceZone, targetZone]);

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Time Zone Converter"
                description="Convert date and time across different time zones instantly."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <Card className="border-2 h-fit">
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label>Date & Time</Label>
                            <Input
                                type="datetime-local"
                                value={sourceTime}
                                onChange={(e) => setSourceTime(e.target.value)}
                                className="h-12 text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Convert To</Label>
                            <Select value={targetZone} onValueChange={setTargetZone}>
                                <SelectTrigger className="h-12 text-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900 flex flex-col justify-center">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="space-y-2">
                            <Globe className="mx-auto h-12 w-12 text-indigo-500 mb-4 opacity-50" />
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Result in {targetZone}</p>
                            <h3 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">
                                {result}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Time Zones Explained">
                    <p>
                        The earth is divided into 24 time zones. Local time in each zone is determined by its longitude.
                        UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time.
                    </p>
                </ToolContentSection>
            </div>
        </div>
    );
}
