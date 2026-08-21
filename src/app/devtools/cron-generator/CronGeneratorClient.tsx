'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { SEOSection } from '@/components/ui/SEOSection';
import { CalendarClock, Copy, Check, Info, Settings2, Clock, CalendarDays, Calendar as CalendarIcon, Hash } from 'lucide-react';
import { CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue';

type CronMode = 'every' | 'step' | 'specific' | 'range';

interface SegmentState {
    mode: CronMode;
    stepValue: number;
    specificValues: number[];
    rangeStart: number;
    rangeEnd: number;
}

const defaultSegment = (min: number, max: number): SegmentState => ({
    mode: 'every',
    stepValue: 1,
    specificValues: [min],
    rangeStart: min,
    rangeEnd: max,
});

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const parseNumber = (val: string, isMonth: boolean, isWeek: boolean): number => {
    const v = val.toLowerCase();
    if (isWeek) {
        const idx = weekNames.findIndex(n => n.toLowerCase().startsWith(v.slice(0, 3)));
        if (idx !== -1) return idx;
    }
    if (isMonth) {
        const idx = monthNames.findIndex(n => n.toLowerCase() === v.slice(0, 3));
        if (idx !== -1) return idx + 1;
    }
    return parseInt(val);
};

const parseSegment = (val: string, min: number, max: number, isMonth = false, isWeek = false): SegmentState => {
    const def = defaultSegment(min, max);
    if (!val || val === '*') return def;

    if (val.startsWith('*/')) {
        return { ...def, mode: 'step', stepValue: parseInt(val.substring(2)) || 1 };
    }
    if (val.includes('-')) {
        const [s, e] = val.split('-');
        return { ...def, mode: 'range', rangeStart: parseNumber(s, isMonth, isWeek) || min, rangeEnd: parseNumber(e, isMonth, isWeek) || max };
    }
    if (val.includes(',') || !isNaN(parseNumber(val, isMonth, isWeek))) {
        const nums = val.split(',').map(n => parseNumber(n, isMonth, isWeek)).filter(n => !isNaN(n));
        return { ...def, mode: 'specific', specificValues: nums.length > 0 ? nums : [min] };
    }
    return def;
};

const generateSegment = (state: SegmentState): string => {
    switch (state.mode) {
        case 'every': return '*';
        case 'step': return `*/${state.stepValue}`;
        case 'range': return `${state.rangeStart}-${state.rangeEnd}`;
        case 'specific': return state.specificValues.length > 0 ? [...state.specificValues].sort((a, b) => a - b).join(',') : '*';
        default: return '*';
    }
};

const SegmentBuilder = ({
    title, state, onChange, min, max, labels
}: {
    title: string; state: SegmentState; onChange: (s: SegmentState) => void; min: number; max: number; labels?: string[]
}) => {
    const setMode = (mode: CronMode) => onChange({ ...state, mode });
    
    const toggleSpecific = (val: number) => {
        const newVals = state.specificValues.includes(val)
            ? state.specificValues.filter(v => v !== val)
            : [...state.specificValues, val];
        onChange({ ...state, specificValues: newVals });
    };

    const getLabel = (val: number) => {
        if (labels) {
            // week is 0-indexed mapped to 0-6 or 1-7. If labels are 7 items, val-min maps correctly?
            return labels[val - min] || val.toString();
        }
        return val.toString().padStart(2, '0');
    };

    const gridItems = [];
    for (let i = min; i <= max; i++) gridItems.push(i);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-wrap gap-3">
                {(['every', 'step', 'specific', 'range'] as CronMode[]).map(m => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`rounded-full px-5 py-2.5 text-[0.9rem] font-bold capitalize transition-all duration-200 ${
                            state.mode === m 
                                ? 'bg-[#8b5cf6] text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]' 
                                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[rgba(139,92,246,0.1)] hover:text-[#8b5cf6] border border-[var(--border)]'
                        }`}
                    >
                        {m === 'specific' ? 'Specific (Select)' : m === 'step' ? 'Interval' : m}
                    </button>
                ))}
            </div>

            <div className="min-h-[200px] rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-sm">
                {state.mode === 'every' && (
                    <div className="flex h-full items-center justify-center text-center text-[var(--text-secondary)] font-medium">
                        Executes on every valid {title.toLowerCase()}.
                    </div>
                )}

                {state.mode === 'step' && (
                    <div className="flex h-full flex-col items-center justify-center gap-4">
                        <label className="font-bold text-[var(--text-primary)]">Execute every N {title.toLowerCase()}s:</label>
                        <div className="flex items-center gap-3">
                            <input 
                                type="number" 
                                min={1} max={max} 
                                value={state.stepValue}
                                onChange={e => onChange({ ...state, stepValue: parseInt(e.target.value) || 1 })}
                                className="w-24 rounded-lg border-2 border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-center text-xl font-bold text-[#8b5cf6] outline-none focus:border-[#8b5cf6]"
                            />
                            <span className="font-semibold text-[var(--text-secondary)]">{title.toLowerCase()}s</span>
                        </div>
                    </div>
                )}

                {state.mode === 'range' && (
                    <div className="flex h-full flex-col items-center justify-center gap-4">
                        <label className="font-bold text-[var(--text-primary)]">Execute between:</label>
                        <div className="flex items-center gap-4">
                            <select 
                                value={state.rangeStart}
                                onChange={e => onChange({ ...state, rangeStart: parseInt(e.target.value) })}
                                className="rounded-lg border-2 border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-lg font-bold text-[#8b5cf6] outline-none focus:border-[#8b5cf6]"
                            >
                                {gridItems.map(i => <option key={i} value={i}>{getLabel(i)}</option>)}
                            </select>
                            <span className="font-bold text-[var(--text-secondary)]">and</span>
                            <select 
                                value={state.rangeEnd}
                                onChange={e => onChange({ ...state, rangeEnd: parseInt(e.target.value) })}
                                className="rounded-lg border-2 border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 text-lg font-bold text-[#8b5cf6] outline-none focus:border-[#8b5cf6]"
                            >
                                {gridItems.map(i => <option key={i} value={i}>{getLabel(i)}</option>)}
                            </select>
                        </div>
                    </div>
                )}

                {state.mode === 'specific' && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {gridItems.map(i => {
                            const selected = state.specificValues.includes(i);
                            return (
                                <button
                                    key={i}
                                    onClick={() => toggleSpecific(i)}
                                    className={`flex h-12 w-full items-center justify-center rounded-lg text-sm font-bold transition-all duration-150 ${
                                        selected 
                                            ? 'bg-[#8b5cf6] text-white shadow-md scale-105' 
                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[rgba(139,92,246,0.1)] hover:text-[#8b5cf6] border border-[var(--border)]'
                                    }`}
                                >
                                    {getLabel(i)}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function CronGeneratorClient() {
    const [activeTab, setActiveTab] = useState<'minute' | 'hour' | 'day' | 'month' | 'week'>('minute');
    const [cronString, setCronString] = useState('*/15 * * * *');
    const [copied, setCopied] = useState(false);

    const [builderState, setBuilderState] = useState<{
        minute: SegmentState; hour: SegmentState; day: SegmentState; month: SegmentState; week: SegmentState;
    }>({
        minute: parseSegment('*/15', 0, 59),
        hour: parseSegment('*', 0, 23),
        day: parseSegment('*', 1, 31),
        month: parseSegment('*', 1, 12, true),
        week: parseSegment('*', 0, 6, false, true),
    });

    const [translation, setTranslation] = useState('');
    const [nextDates, setNextDates] = useState<{ date: string, time: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [syncingFromText, setSyncingFromText] = useState(false);

    // Sync Text -> Builder
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCronString(val);
        setSyncingFromText(true);
        const parts = val.trim().split(/\s+/);
        if (parts.length === 5) {
            setBuilderState({
                minute: parseSegment(parts[0], 0, 59),
                hour: parseSegment(parts[1], 0, 23),
                day: parseSegment(parts[2], 1, 31),
                month: parseSegment(parts[3], 1, 12, true),
                week: parseSegment(parts[4], 0, 6, false, true),
            });
        }
    };

    // Sync Builder -> Text
    const updateBuilderSegment = (segment: keyof typeof builderState, state: SegmentState) => {
        const newState = { ...builderState, [segment]: state };
        setBuilderState(newState);
        setSyncingFromText(false);
        const newCron = `${generateSegment(newState.minute)} ${generateSegment(newState.hour)} ${generateSegment(newState.day)} ${generateSegment(newState.month)} ${generateSegment(newState.week)}`;
        setCronString(newCron);
    };

    // Calculate details
    useEffect(() => {
        try {
            if (!cronString.trim() || cronString.trim().split(/\s+/).length < 5) {
                throw new Error('Incomplete cron expression');
            }

            const humanText = cronstrue.toString(cronString, { verbose: true });
            const interval = CronExpressionParser.parse(cronString);
            const dates = [];
            for (let i = 0; i < 5; i++) {
                const obj = interval.next().toDate();
                dates.push({
                    date: obj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                    time: obj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                });
            }

            setTranslation(humanText);
            setNextDates(dates);
            setError(null);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Invalid cron expression';
            setTranslation('--');
            setNextDates([]);
            setError(message);
        }
    }, [cronString]);

    const copyToClipboard = () => {
        if (error) return;
        navigator.clipboard.writeText(cronString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const setPreset = (val: string) => {
        setCronString(val);
        const e = { target: { value: val } } as React.ChangeEvent<HTMLInputElement>;
        handleTextChange(e);
    };

    const tabs = [
        { id: 'minute', icon: <Clock size={16} />, label: 'Minute' },
        { id: 'hour', icon: <Clock size={16} />, label: 'Hour' },
        { id: 'day', icon: <CalendarIcon size={16} />, label: 'Day' },
        { id: 'month', icon: <CalendarDays size={16} />, label: 'Month' },
        { id: 'week', icon: <CalendarClock size={16} />, label: 'Week' },
    ] as const;

    return (
        <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
            <div>
                <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-3 inline-flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50/80 px-3 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300">
                                Automation & Scheduling
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
                            Advanced Cron Builder
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                            Visually construct valid cron schedules, parse expressions into plain English, and preview execution timelines safely in your browser.
                        </p>
                    </div>
                </header>

                <section className="container pb-12 pt-2 sm:pt-4">
                    <div className="mx-auto max-w-[1200px]">
                        
                        {/* Massive Display & Input */}
                        <Card className="!p-6 md:!p-10 mb-8 border-2 border-[#8b5cf6]/20 bg-[var(--bg-secondary)] shadow-xl shadow-[#8b5cf6]/5">
                            <div className="flex flex-col xl:flex-row gap-8 items-center justify-between">
                                <div className="flex-1 w-full">
                                    <label className="text-[0.8rem] font-black uppercase tracking-widest text-[#8b5cf6] mb-3 block">Raw Cron Expression</label>
                                    <input
                                        type="text"
                                        value={cronString}
                                        onChange={handleTextChange}
                                        className="w-full bg-white dark:bg-[#1e293b] rounded-xl border border-[var(--border)] px-6 py-4 font-mono text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold tracking-widest text-[var(--text-primary)] outline-none focus:border-[#8b5cf6] focus:ring-4 focus:ring-[#8b5cf6]/20 transition-all"
                                        spellCheck="false"
                                    />
                                    {error ? (
                                        <div className="mt-4 text-[0.95rem] font-bold text-[#ef4444] bg-[#ef4444]/10 p-4 rounded-lg inline-flex items-center gap-2">
                                            <Info size={18} /> {error}
                                        </div>
                                    ) : (
                                        <div className="mt-4 inline-flex items-center gap-3 max-w-fit rounded-lg bg-[#8b5cf6]/10 px-5 py-3 text-[1.1rem] font-bold text-[#8b5cf6]">
                                            <Settings2 size={20} />
                                            &quot;{translation}&quot;
                                        </div>
                                    )}
                                </div>
                                <button className="w-full xl:w-auto shrink-0 cursor-pointer flex justify-center items-center gap-3 rounded-xl border-none bg-[#8b5cf6] px-8 py-5 text-[1.1rem] font-extrabold text-white transition-all duration-200 hover:bg-[#7c3aed] hover:shadow-lg hover:-translate-y-1 active:translate-y-0" onClick={copyToClipboard} disabled={!!error}>
                                    {copied ? <Check size={24} /> : <Copy size={24} />}
                                    <span>{copied ? 'Copied to Clipboard' : 'Copy Expression'}</span>
                                </button>
                            </div>
                        </Card>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                            
                            {/* Visual Builder */}
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden shadow-sm">
                                <div className="flex overflow-x-auto border-b border-[var(--border)] bg-[var(--bg-primary)] p-2 gap-2 custom-scrollbar">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-bold transition-all duration-200 ${
                                                activeTab === tab.id
                                                    ? 'bg-[#8b5cf6] text-white shadow-md'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                                            }`}
                                        >
                                            {tab.icon} {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-6 md:p-8">
                                    {activeTab === 'minute' && <SegmentBuilder title="Minute" min={0} max={59} state={builderState.minute} onChange={s => updateBuilderSegment('minute', s)} />}
                                    {activeTab === 'hour' && <SegmentBuilder title="Hour" min={0} max={23} state={builderState.hour} onChange={s => updateBuilderSegment('hour', s)} />}
                                    {activeTab === 'day' && <SegmentBuilder title="Day of Month" min={1} max={31} state={builderState.day} onChange={s => updateBuilderSegment('day', s)} />}
                                    {activeTab === 'month' && <SegmentBuilder title="Month" min={1} max={12} labels={monthNames} state={builderState.month} onChange={s => updateBuilderSegment('month', s)} />}
                                    {activeTab === 'week' && <SegmentBuilder title="Day of Week" min={0} max={6} labels={weekNames} state={builderState.week} onChange={s => updateBuilderSegment('week', s)} />}
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="flex flex-col gap-8">
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-sm">
                                    <h3 className="mb-6 flex items-center gap-3 text-[1.1rem] font-extrabold text-[var(--text-primary)]">
                                        <CalendarClock size={22} className="text-[#8b5cf6]" />
                                        Next 5 Executions
                                    </h3>
                                    {error ? (
                                        <div className="text-[#ef4444] text-[0.95rem] font-medium bg-[#ef4444]/5 p-4 rounded-lg">
                                            Fix the cron syntax to preview upcoming executions.
                                        </div>
                                    ) : (
                                        <div className="ml-2 flex flex-col gap-2 border-l-[3px] border-[#8b5cf6]/30 pl-5 relative before:absolute before:top-0 before:-left-[3px] before:bottom-0 before:w-[3px] before:bg-gradient-to-b before:from-[#8b5cf6] before:to-transparent">
                                            {nextDates.map((nd, idx) => (
                                                <div key={idx} className="relative py-3 before:absolute before:-left-[1.6rem] before:top-1/2 before:h-[14px] before:w-[14px] before:-translate-y-1/2 before:rounded-full before:border-[3px] before:border-[#8b5cf6] before:bg-[var(--bg-secondary)] first:before:bg-[#8b5cf6] first:before:shadow-[0_0_12px_rgba(139,92,246,0.5)] transition-all hover:translate-x-1">
                                                    <div className="text-[1rem] font-extrabold text-[var(--text-primary)]">{nd.date}</div>
                                                    <div className="mt-1 flex items-center gap-2 font-mono text-[0.85rem] font-bold text-[#8b5cf6] bg-[#8b5cf6]/10 w-fit px-2 py-0.5 rounded-md"><Clock size={12}/> {nd.time}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-sm">
                                    <h4 className="mb-5 text-[1.1rem] font-extrabold text-[var(--text-primary)] flex items-center gap-2"><Hash size={20} className="text-[#8b5cf6]"/> Quick Presets</h4>
                                    <div className="flex flex-wrap gap-2.5">
                                        {[
                                            { label: 'Midnight Daily', val: '0 0 * * *' },
                                            { label: 'Every 5 Minutes', val: '*/5 * * * *' },
                                            { label: 'Top of Hour', val: '0 * * * *' },
                                            { label: 'Mon-Fri 9AM', val: '0 9 * * 1-5' },
                                            { label: '1st of Month', val: '0 0 1 * *' },
                                            { label: 'Every Sunday', val: '0 0 * * 0' },
                                        ].map(preset => (
                                            <button 
                                                key={preset.label}
                                                onClick={() => setPreset(preset.val)} 
                                                className="cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-[0.85rem] font-bold text-[var(--text-secondary)] transition-all hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/5 hover:text-[#8b5cf6] active:scale-95"
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <SEOSection
                    title="Online Cron Schedule Predictor & Advanced Parser"
                    description="Visually build cron schedules, decipher complex cron expressions into human readable English, and generate a 5-iteration execution schedule natively in your browser to debug automated background jobs confidently."
                    howToUse={[
                        "Use the Visual Builder tabs to select the exact minute, hour, day, month, and weekday your job should run.",
                        "Alternatively, paste your raw cron expression directly into the massive purple input header (e.g. '0 22 * * 1-5').",
                        "Instantly see the plain English translation of exactly what the expression will do (e.g. 'At 10:00 PM, Monday through Friday').",
                        "Review the 'Next 5 Executions' timeline to confirm timezones and logic don't disrupt your triggers.",
                        "Copy the generated expression to paste into your server, CI/CD pipeline, or Kubernetes cronjob."
                    ]}
                    benefits={[
                        "Visual Builder: Stop guessing syntax. Click buttons and let the generator write the asterisks and slashes for you.",
                        "Timeline Validation: Avoid catastrophic duplicate executions by verifying the absolute runtime timeline ahead of deployment.",
                        "Human Readable Translation: Instantly converts arbitrary stars and slashes into detailed English logic.",
                        "Native Execution: Uses advanced math libraries entirely in the browser, safeguarding privacy via zero-server communication."
                    ]}
                />
            </div>
            <Footer />
        </div>
    );
}
