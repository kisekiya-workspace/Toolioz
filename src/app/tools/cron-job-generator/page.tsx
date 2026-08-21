"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Badge } from "@/components/sociials-ui/badge";
import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import cronstrue from 'cronstrue';
import { CronVisualizer } from "@/components/sociials-tools/cron-job-generator/CronVisualizer";

export default function CronGeneratorPage() {
    const [cron, setCron] = useState("*/15 * * * *");
    const [humanReadable, setHumanReadable] = useState("");
    const [error, setError] = useState("");

    // Calculate Description
    useEffect(() => {
        if (!cron) {
            setHumanReadable("");
            setError("");
            return;
        }

        try {
            const desc = cronstrue.toString(cron);
            setHumanReadable(desc);
            setError("");
        } catch (e: any) {
            setHumanReadable("");
            // Cronstrue throws string errors sometimes
            setError(typeof e === 'string' ? e : "Invalid Cron Expression");
        }
    }, [cron]);

    const loadPreset = (val: string) => {
        setCron(val);
    };

    return (
        <div className="container px-4 py-8 m-auto max-w-[1200px]">
            <ToolHeader
                title="Cron Job Generator"
                description="Interpret cron schedules, visualize next run times, and generate expressions."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                {/* Result & Visualizer */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-2">
                        <CardHeader className="pb-4">
                            <CardTitle>Schedule Editor</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Cron Expression</label>
                                <div className="relative">
                                    <Input
                                        value={cron}
                                        onChange={(e) => setCron(e.target.value)}
                                        placeholder="* * * * *"
                                        className="font-mono text-2xl h-16 tracking-widest text-center"
                                    />
                                    {humanReadable && !error && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                                            <CheckCircle2 size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground font-mono px-4">
                                    <span>min</span>
                                    <span>hour</span>
                                    <span>day(mo)</span>
                                    <span>month</span>
                                    <span>day(wk)</span>
                                </div>
                            </div>

                            {/* Human Readable Output */}
                            <div className={`p-4 rounded-lg flex items-center gap-3 border ${error ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900' : 'bg-primary/5 border-primary/20 text-primary'}`}>
                                {error ? <AlertCircle size={20} /> : <span className="text-xl">Op</span>}
                                <span className="text-lg font-medium">
                                    {error || humanReadable || "Enter a valid expression"}
                                </span>
                            </div>

                            {/* Visualization Timeline */}
                            {!error && humanReadable && (
                                <div className="pt-4 border-t">
                                    <CronVisualizer cronExpression={cron} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Cheatsheet */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Common Schedules</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto max-h-[600px]">
                            <div className="divide-y">
                                <PresetItem label="Every Minute" cron="* * * * *" onClick={loadPreset} />
                                <PresetItem label="Every 5 Minutes" cron="*/5 * * * *" onClick={loadPreset} />
                                <PresetItem label="Every 15 Minutes" cron="*/15 * * * *" onClick={loadPreset} />
                                <PresetItem label="Every Hour" cron="0 * * * *" onClick={loadPreset} />
                                <PresetItem label="Every Day at Midnight" cron="0 0 * * *" onClick={loadPreset} />
                                <PresetItem label="Every Day at 2am" cron="0 2 * * *" onClick={loadPreset} />
                                <PresetItem label="Every Monday" cron="0 0 * * 1" onClick={loadPreset} />
                                <PresetItem label="Every Month (1st)" cron="0 0 1 * *" onClick={loadPreset} />
                                <PresetItem label="Every Year (Jan 1st)" cron="0 0 1 1 *" onClick={loadPreset} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ToolContentSection title="About Cron Expressions">
                <p>
                    Cron is a time-based job scheduler in Unix-like computer operating systems.
                    Users who set up and maintain software environments use cron to schedule jobs (commands or shell scripts)
                    to run periodically at fixed times, dates, or intervals.
                </p>
                <div className="grid grid-cols-5 gap-2 mt-4 font-mono text-center text-sm">
                    <div className="bg-muted p-2 rounded">
                        <div className="font-bold">*</div>
                        <div className="text-xs text-muted-foreground mt-1">Minute</div>
                        <div className="text-[10px] opacity-70">0-59</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                        <div className="font-bold">*</div>
                        <div className="text-xs text-muted-foreground mt-1">Hour</div>
                        <div className="text-[10px] opacity-70">0-23</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                        <div className="font-bold">*</div>
                        <div className="text-xs text-muted-foreground mt-1">Day</div>
                        <div className="text-[10px] opacity-70">1-31</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                        <div className="font-bold">*</div>
                        <div className="text-xs text-muted-foreground mt-1">Month</div>
                        <div className="text-[10px] opacity-70">1-12</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                        <div className="font-bold">*</div>
                        <div className="text-xs text-muted-foreground mt-1">Week</div>
                        <div className="text-[10px] opacity-70">0-6</div>
                    </div>
                </div>
            </ToolContentSection>
        </div>
    );
}

function PresetItem({ label, cron, onClick }: { label: string, cron: string, onClick: (v: string) => void }) {
    return (
        <button
            onClick={() => onClick(cron)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition group text-left"
        >
            <div>
                <div className="font-medium">{label}</div>
                <code className="text-xs text-primary bg-primary/10 px-1 py-0.5 rounded">{cron}</code>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
