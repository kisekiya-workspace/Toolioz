"use client";

import { useState, useEffect, useRef } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Button } from "@/components/sociials-ui/button";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { Input } from "@/components/sociials-ui/input";
import { Play, Pause, RotateCcw, Flag, Bell } from "lucide-react";
import useSound from "use-sound";

export default function StopwatchPage() {
    // Stopwatch State
    const [swTime, setSwTime] = useState(0);
    const [swRunning, setSwRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);

    // Timer State
    const [tmTime, setTmTime] = useState(300000); // Current display time
    const [tmInitial, setTmInitial] = useState(300000); // Reset value
    const [tmRunning, setTmRunning] = useState(false);

    // Refs for Timing Logic (Delta Timing)
    const swStartTimeRef = useRef<number | null>(null);
    const tmEndTimeRef = useRef<number | null>(null);

    const swInterval = useRef<NodeJS.Timeout | null>(null);
    const tmInterval = useRef<NodeJS.Timeout | null>(null);

    // Sound Hook
    const [playAlarm] = useSound('/alarm.mp3');

    // Stopwatch Delta Logic
    useEffect(() => {
        if (swRunning) {
            swStartTimeRef.current = Date.now() - swTime;
            swInterval.current = setInterval(() => {
                if (swStartTimeRef.current !== null) {
                    setSwTime(Date.now() - swStartTimeRef.current);
                }
            }, 10);
        } else {
            if (swInterval.current) clearInterval(swInterval.current);
            swStartTimeRef.current = null;
        }
        return () => {
            if (swInterval.current) clearInterval(swInterval.current);
        };
    }, [swRunning]);

    // Timer Delta Logic
    useEffect(() => {
        if (tmRunning) {
            tmEndTimeRef.current = Date.now() + tmTime;
            tmInterval.current = setInterval(() => {
                if (tmEndTimeRef.current !== null) {
                    const remaining = tmEndTimeRef.current - Date.now();

                    if (remaining <= 0) {
                        setTmTime(0);
                        setTmRunning(false);
                        tmEndTimeRef.current = null;

                        // Play Sound via use-sound
                        playAlarm();

                        if (tmInterval.current) clearInterval(tmInterval.current);
                    } else {
                        setTmTime(remaining);
                    }
                }
            }, 10);
        } else {
            if (tmInterval.current) clearInterval(tmInterval.current);
            tmEndTimeRef.current = null;
        }
        return () => {
            if (tmInterval.current) clearInterval(tmInterval.current);
        };
    }, [tmRunning, playAlarm]);

    const formatTime = (ms: number) => {
        if (ms < 0) ms = 0;
        const hours = Math.floor(ms / 3600000);
        const min = Math.floor((ms % 3600000) / 60000);
        const sec = Math.floor((ms % 60000) / 1000);
        const cent = Math.floor((ms % 1000) / 10);

        if (hours > 0) {
            return `${hours}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
        }
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${cent.toString().padStart(2, '0')}`;
    };

    const handleTimerInput = (val: string) => {
        const min = parseInt(val);
        if (isNaN(min)) return;

        const newTime = min * 60000;
        setTmInitial(newTime);
        setTmTime(newTime);
        setTmRunning(false);
        tmEndTimeRef.current = null;
    };

    const setPresetTimer = (minutes: number) => {
        const newTime = minutes * 60000;
        setTmInitial(newTime);
        setTmTime(newTime);
        setTmRunning(false);
        tmEndTimeRef.current = null;
    };

    const handleResetStopwatch = () => {
        setSwRunning(false);
        setSwTime(0);
        setLaps([]);
        swStartTimeRef.current = null;
    };

    const handleResetTimer = () => {
        setTmRunning(false);
        setTmTime(tmInitial);
        tmEndTimeRef.current = null;
    };

    const faq = [
        { q: "Does this work in the background?", a: "Yes! We use delta-timing which relies on your system clock. Even if the browser sleeps, the time will correct itself immediately when you return." },
        { q: "Is it accurate?", a: "Yes, it uses the system clock for high precision down to the millisecond." },
        { q: "Can I save my laps?", a: "Currently, laps are temporary and will be cleared if you refresh the page." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Stopwatch & Timer"
                description="A precise, browser-based chronograph for tracking time, setting alarms, and measuring laps."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                <Card className="lg:col-span-2 border-2 shadow-xl">
                    <CardContent className="p-8">
                        <Tabs defaultValue="stopwatch" className="space-y-8">
                            <TabsList className="grid w-full grid-cols-2 h-12">
                                <TabsTrigger value="stopwatch" className="text-lg">Stopwatch</TabsTrigger>
                                <TabsTrigger value="timer" className="text-lg">Timer</TabsTrigger>
                            </TabsList>

                            {/* Stopwatch Tab */}
                            <TabsContent value="stopwatch" className="space-y-8">
                                <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed">
                                    <div className="text-6xl md:text-8xl font-mono font-bold tracking-wider tabular-nums">
                                        {formatTime(swTime)}
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <Button
                                        size="lg"
                                        className={`h-16 w-32 text-xl font-bold ${swRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
                                        onClick={() => setSwRunning(!swRunning)}
                                    >
                                        {swRunning ? <><Pause className="mr-2" /> Pause</> : <><Play className="mr-2" /> Start</>}
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="h-16 w-32 text-xl font-bold"
                                        onClick={handleResetStopwatch}
                                    >
                                        <RotateCcw className="mr-2" /> Reset
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-16 w-32 text-xl font-bold"
                                        onClick={() => setLaps(prev => [swTime, ...prev])}
                                        disabled={!swRunning}
                                    >
                                        <Flag className="mr-2" /> Lap
                                    </Button>
                                </div>

                                {laps.length > 0 && (
                                    <div className="border rounded-xl overflow-hidden">
                                        <div className="bg-muted p-3 font-semibold grid grid-cols-3 text-center">
                                            <span>Lap</span>
                                            <span>Time</span>
                                            <span>Total</span>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {laps.map((lap, i) => (
                                                <div key={i} className="p-3 border-t grid grid-cols-3 text-center font-mono">
                                                    <span className="text-muted-foreground">#{laps.length - i}</span>
                                                    <span>{formatTime(i === laps.length - 1 ? lap : lap - laps[i + 1])}</span>
                                                    <span>{formatTime(lap)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Timer Tab */}
                            <TabsContent value="timer" className="space-y-8">
                                <div className={`text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed relative transition-colors duration-500 ${tmTime === 0 && !tmRunning && tmInitial !== tmTime ? 'bg-red-100 border-red-300 dark:bg-red-950/20 dark:border-red-900' : ''}`}>
                                    <div className="absolute top-4 right-4">
                                        <Bell className={`h-6 w-6 ${tmTime === 0 && !tmRunning && tmInitial !== tmTime ? 'text-red-500 animate-bounce' : 'text-muted-foreground'}`} />
                                    </div>
                                    <div className={`text-6xl md:text-8xl font-mono font-bold tracking-wider tabular-nums ${tmTime <= 10000 && tmTime > 0 ? 'text-red-500 animate-pulse' : ''}`}>
                                        {formatTime(tmTime)}
                                    </div>
                                </div>

                                {/* Custom Input & Presets */}
                                <div className="space-y-6">
                                    <div className="max-w-xs mx-auto flex items-center gap-4">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            className="h-12 text-center text-lg"
                                            value={Math.floor(tmInitial / 60000).toString()}
                                            onChange={(e) => handleTimerInput(e.target.value)}
                                            disabled={tmRunning}
                                        />
                                        <span className="font-bold text-muted-foreground">Minutes</span>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-2">
                                        {[1, 5, 10, 25, 30, 60].map((min) => (
                                            <Button
                                                key={min}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPresetTimer(min)}
                                                disabled={tmRunning}
                                            >
                                                {min}m
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4">
                                    <Button
                                        size="lg"
                                        className={`h-16 w-32 text-xl font-bold ${tmRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
                                        onClick={() => {
                                            if (tmTime === 0 && !tmRunning) setTmTime(tmInitial);
                                            setTmRunning(!tmRunning);
                                        }}
                                    >
                                        {tmRunning ? <><Pause className="mr-2" /> Pause</> : <><Play className="mr-2" /> Start</>}
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="h-16 w-32 text-xl font-bold"
                                        onClick={handleResetTimer}
                                    >
                                        <RotateCcw className="mr-2" /> Reset
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Info Panel */}
                <div className="space-y-6">
                    <Card className="border-2 shadow-md bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
                        <CardContent className="p-6">
                            <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                                <Play size={18} /> Pro Tip
                            </h3>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                Need to time a presentation? Use the Timer mode and set it to your allotted time. The counter turns red when you have less than 10 seconds remaining!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Precision Timing for Everyone">
                    <p>
                        Whether you are tracking workout intervals, cooking the perfect egg, or managing a Pomodoro work session,
                        having a reliable timer is essential. Our tool combines a millisecond-precise stopwatch with a customizable countdown timer.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="Technical Deep Dive: How Web Timers Work">
                    <p>
                        In the early days of the web, JavaScript timers (like `setTimeout` and `setInterval`) were notoriously unreliable.
                        They would drift significantly over time because the browser's main thread would get blocked by other tasks (like rendering images or handling scrolling).
                    </p>
                    <h4 className="font-bold mt-4">The Solution: Delta Timing</h4>
                    <p>
                        This tool uses a technique called "Delta Timing." Instead of relying on the interval to fire exactly every 10 milliseconds,
                        we capture a timestamp (`Date.now()`) when you click "Start." Then, on every frame update, we calculate the exact difference
                        between the current time and the start time. This ensures that even if your computer lags, the timer remains scientifically accurate.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="A Brief History of the Stopwatch">
                    <p>
                        The need to measure short intervals of time dates back to the 18th century. The first "chronograph" was invented by Louis Moinet
                        in 1816 for tracking astronomical objects. It was so precise it could measure time down to 1/60th of a second—a feat unmatched for decades.
                    </p>
                    <p>
                        Digital stopwatches revolutionized sports in the 1970s. By replacing mechanical gears with quartz crystals, accuracy jumped to 1/1000th of a second,
                        changing the way Olympic records were recorded forever.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
