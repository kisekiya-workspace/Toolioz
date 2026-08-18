"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Button } from "@/components/sociials-ui/button";
import { Label } from "@/components/sociials-ui/label";
import { Cake, Calendar } from "lucide-react";

export default function AgeCalculatorPage() {
    const [dob, setDob] = useState("");
    const [result, setResult] = useState<{
        age: { years: number; months: number; days: number };
        nextBirthday: { months: number; days: number; dayOfWeek: string; date: string };
        summary: {
            months: string;
            weeks: string;
            days: string;
            hours: string;
            minutes: string;
            seconds: string;
        };
        dayOfBirth: string;
    } | null>(null);

    const calculateAge = () => {
        if (!dob) return;
        const [y, m, d] = dob.split('-').map(Number);
        const birthDate = new Date(y, m - 1, d); // Local midnight
        const today = new Date();

        // Basic Age
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        // Day of Birth
        const dayOfBirth = birthDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Next Birthday
        const currentYear = today.getFullYear();
        let nextBirthdayDate = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

        if (nextBirthdayDate < today && (nextBirthdayDate.getDate() !== today.getDate() || nextBirthdayDate.getMonth() !== today.getMonth())) {
            nextBirthdayDate.setFullYear(currentYear + 1);
        } else if (nextBirthdayDate.getDate() === today.getDate() && nextBirthdayDate.getMonth() === today.getMonth()) {
            if (days === 0 && months === 0) {
                nextBirthdayDate.setFullYear(currentYear + 1);
            }
        }

        let nbMonths = nextBirthdayDate.getMonth() - today.getMonth();
        let nbDays = nextBirthdayDate.getDate() - today.getDate();

        if (nbDays < 0) {
            nbMonths--;
            nbDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (nbMonths < 0) {
            nbMonths += 12;
        }

        const nextBirthdayDayOfWeek = nextBirthdayDate.toLocaleDateString('en-US', { weekday: 'long' });
        const nextBirthdayDateString = nextBirthdayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });


        // Detailed Summary
        const diff = today.getTime() - birthDate.getTime();

        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = years * 12 + months;

        setResult({
            age: { years, months, days },
            nextBirthday: {
                months: nbMonths,
                days: nbDays,
                dayOfWeek: nextBirthdayDayOfWeek,
                date: nextBirthdayDateString
            },
            summary: {
                months: totalMonths.toLocaleString(),
                weeks: totalWeeks.toLocaleString(),
                days: totalDays.toLocaleString(),
                hours: totalHours.toLocaleString(),
                minutes: totalMinutes.toLocaleString(),
                seconds: totalSeconds.toLocaleString(),
            },
            dayOfBirth
        });
    };

    const faq = [
        { q: "How is age calculated?", a: "We subtract your birth date from the current date, adjusting for leap years and different month lengths." },
        { q: "Is this accurate?", a: "Yes, it calculates your exact age down to the day based on your browser's local time." },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Age Calculator",
        "operatingSystem": "All",
        "applicationCategory": "Utility",
        "description": "Professional age calculator tool to find exact age in years, months, days, and even minutes.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    const guideSections = [
        {
            title: "Why Use an Age Calculator?",
            content: (
                <p>
                    Understanding your exact age is important for various legal, medical, and personal reasons. While most of us know our age in years, calculating the exact number of months and days can be challenging, especially considering leap years and the varying number of days in each month. Our **professional age calculator** automates this process with 100% precision.
                </p>
            )
        },
        {
            title: "How to Calculate Age Manually",
            content: (
                <div className="space-y-4">
                    <p>To calculate age manually, follow these steps:</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Identify the **Birth Date** and the **Current Date**.</li>
                        <li>Subtract the birth year from the current year.</li>
                        <li>Adjust based on the month and day. If the current month is earlier than the birth month, or if it's the same month but the current day is earlier than the birth day, subtract one year.</li>
                    </ol>
                    <p>Or, simply use our tool for an instant, error-free result!</p>
                </div>
            )
        },
        {
            title: "Privacy & Security",
            content: (
                <p>
                    At Toolioz, we take your privacy seriously. Unlike other online tools, our Age Calculator runs entirely on your local device using **Client-Side JavaScript**. Your date of birth is never sent to our servers, nor is it stored in any database. You can even use this tool offline once the page is loaded.
                </p>
            )
        }
    ];

    return (
        <div className="container px-4 sm:px-6 py-8 sm:py-12 m-auto max-w-6xl">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="Age Calculator"
                description="Calculate your exact age in years, months, and days. Find out exactly how old you are."
            />

            <AdContainer slot="1234567890" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

                {/* Input Section */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-2 shadow-lg">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold">Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="h-14 text-lg"
                                />
                            </div>
                            <Button size="lg" className="w-full h-14 text-lg font-bold" onClick={calculateAge} disabled={!dob}>
                                Calculate Age
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Result Summary - Mobile First Stack */}
                    {result && (
                        <Card className="border-2 shadow-md bg-slate-50 dark:bg-slate-900/50">
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Day of Birth</div>
                                    <div className="text-2xl font-bold">{result.dayOfBirth}</div>
                                </div>
                                <div className="w-full h-px bg-border"></div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Next Birthday</div>
                                    <div className="text-xl font-bold">{result.nextBirthday.date}</div>
                                    <div className="text-muted-foreground">{result.nextBirthday.months} months, {result.nextBirthday.days} days remaining</div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Main Result Section */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-2 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                        <CardContent className="p-6 sm:p-10 text-center relative z-10">
                            {!result ? (
                                <div className="text-muted-foreground opacity-50 space-y-6">
                                    <Cake size={80} className="mx-auto stroke-1" />
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-medium">Waiting for your birthday...</h3>
                                        <p>Enter your birth date to reveal detailed insights</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-10 animate-in zoom-in-95 fade-in duration-500">
                                    <div>
                                        <p className="text-sm sm:text-base font-bold text-muted-foreground uppercase tracking-wider mb-4">You are currently</p>
                                        <div className="inline-flex items-baseline justify-center gap-x-3 gap-y-1 flex-wrap">
                                            <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                                {result.age.years}
                                            </span>
                                            <span className="text-2xl sm:text-3xl text-foreground font-medium">years old</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
                                        <div className="bg-background/60 dark:bg-background/20 backdrop-blur-sm rounded-xl p-4 border shadow-sm">
                                            <div className="text-2xl sm:text-3xl font-bold text-foreground">{result.age.months}</div>
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">Months</div>
                                        </div>
                                        <div className="bg-background/60 dark:bg-background/20 backdrop-blur-sm rounded-xl p-4 border shadow-sm">
                                            <div className="text-2xl sm:text-3xl font-bold text-foreground">{result.age.days}</div>
                                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">Days</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Detailed Stats Grid */}
                    {result && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { label: "Total Months", value: result.summary.months },
                                { label: "Total Weeks", value: result.summary.weeks },
                                { label: "Total Days", value: result.summary.days },
                                { label: "Total Hours", value: result.summary.hours },
                                { label: "Total Minutes", value: result.summary.minutes },
                                { label: "Total Seconds", value: result.summary.seconds },
                            ].map((stat, i) => (
                                <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 sm:p-6 text-center space-y-1">
                                        <div className="text-lg sm:text-2xl font-bold break-all">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ToolGuide
                title="Age Calculator"
                sections={guideSections}
                faqs={faq}
            />

            <AdContainer slot="0987654321" />
        </div>
    );
}
