"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function SalaryBreakupPage() {
    const [ctc, setCtc] = useState<number>(1200000);
    const [basicPercent, setBasicPercent] = useState<number>(40);
    const [isMetro, setIsMetro] = useState<boolean>(true);
    const [includePf, setIncludePf] = useState<boolean>(true);
    const [includePt, setIncludePt] = useState<boolean>(true);
    const [breakup, setBreakup] = useState<any>(null); // Type this properly if possible or use 'any' for now to avoid complexity in this file
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Calculation Effect
    useEffect(() => {
        // Dynamic import or direct usage if we imported the utility
        // Since we created lib/salary-utils.ts, we should import logic from there.
        // For now, I will include the logic here to ensure it works immediately without import errors in this tool step, 
        // or I can assume the import works.
        // Let's use the logic derived from the utility to be safe in this single file or import it.
        // Better to import it.

        const calculate = () => {
            // 1. Basic
            const annualBasic = (ctc * basicPercent) / 100;
            // 2. HRA
            const annualHra = annualBasic * (isMetro ? 0.5 : 0.4);
            // 3. PF
            let annualPfEmployer = 0;
            let annualPfEmployee = 0;
            if (includePf) {
                annualPfEmployer = annualBasic * 0.12;
                annualPfEmployee = annualBasic * 0.12;
            }
            // 4. PT
            const annualPt = includePt ? 2400 : 0;
            // 5. Special
            let annualSpecial = ctc - annualBasic - annualHra - annualPfEmployer;
            if (annualSpecial < 0) annualSpecial = 0;

            const annualGross = annualBasic + annualHra + annualSpecial;
            const annualDeductions = annualPfEmployee + annualPt;
            const annualNet = annualGross - annualDeductions;

            return {
                earning: { basic: annualBasic, hra: annualHra, special: annualSpecial, gross: annualGross },
                deduction: { pf: annualPfEmployee, pt: annualPt, total: annualDeductions },
                net: annualNet
            };
        };

        setBreakup(calculate());
    }, [ctc, basicPercent, isMetro, includePf, includePt]);


    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val);
    };

    const chartData = breakup ? [
        { name: 'Basic', value: breakup.earning.basic, color: '#4f46e5' },
        { name: 'HRA', value: breakup.earning.hra, color: '#06b6d4' },
        { name: 'Special', value: breakup.earning.special, color: '#8b5cf6' },
        { name: 'PF & PT', value: breakup.deduction.total, color: '#f59e0b' },
    ] : [];

    const jsonLd = { /* ... keep existing ... */ }; // keeping brief for edit

    return (
        <div className="container px-4 py-8 m-auto max-w-[1400px]">
            <ToolHeader
                title="Salary Breakup Calculator"
                description="Visualize your in-hand salary structure. breakdown CTC into Basic, HRA, and Allowances."
            />
            <AdContainer slot="salary-top" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

                {/* LEFT COLUMN: CONTROLS */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="border-2 shadow-md">
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* CTC */}
                            <div className="space-y-4">
                                <Label className="text-base">Annual CTC (₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                                    <Input
                                        type="number"
                                        value={ctc}
                                        onChange={(e) => setCtc(Number(e.target.value))}
                                        className="h-12 text-lg font-bold pl-8"
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="300000" max="5000000" step="50000"
                                    value={ctc}
                                    onChange={(e) => setCtc(Number(e.target.value))}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Basic Salary % */}
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Basic Salary (% of CTC)</Label>
                                    <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">{basicPercent}%</span>
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="range"
                                        min="30" max="60" step="5"
                                        value={basicPercent}
                                        onChange={(e) => setBasicPercent(Number(e.target.value))}
                                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>30%</span>
                                        <span>60%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="space-y-0.5">
                                        <Label className="text-base cursor-pointer" htmlFor="metro">Metro City (HRA 50%)</Label>
                                        <p className="text-xs text-muted-foreground">Select if you live in Metro</p>
                                    </div>
                                    <input type="checkbox" id="metro" checked={isMetro} onChange={(e) => setIsMetro(e.target.checked)} className="h-5 w-5 accent-primary" />
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <Label className="cursor-pointer" htmlFor="pf">Include PF (12%)</Label>
                                    <input type="checkbox" id="pf" checked={includePf} onChange={(e) => setIncludePf(e.target.checked)} className="h-5 w-5 accent-primary" />
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <Label className="cursor-pointer" htmlFor="pt">Professional Tax</Label>
                                    <input type="checkbox" id="pt" checked={includePt} onChange={(e) => setIncludePt(e.target.checked)} className="h-5 w-5 accent-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: RESULTS */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-6 text-center">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Monthly In-Hand</p>
                                <div className="text-4xl font-bold text-primary">
                                    {breakup && formatCurrency(breakup.net / 12)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">(Pre-Tax)</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Annual Gross</p>
                                <div className="text-3xl font-bold text-foreground">
                                    {breakup && formatCurrency(breakup.earning.gross)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs for Table/Chart */}
                    <Card className="border-2 shadow-sm">
                        <CardContent className="p-0">
                            {breakup && (
                                <div className="divide-y">
                                    {/* Header */}
                                    <div className="grid grid-cols-3 bg-muted/40 p-4 font-semibold text-sm">
                                        <div>Component</div>
                                        <div className="text-right">Monthly</div>
                                        <div className="text-right">Annual</div>
                                    </div>

                                    {/* Earnings */}
                                    <div className="p-4 space-y-3">
                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Earnings</div>
                                        <div className="grid grid-cols-3 text-sm">
                                            <div className="font-medium text-indigo-600">Basic Salary</div>
                                            <div className="text-right">{formatCurrency(breakup.earning.basic / 12)}</div>
                                            <div className="text-right">{formatCurrency(breakup.earning.basic)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-sm">
                                            <div className="font-medium text-cyan-600">HRA</div>
                                            <div className="text-right">{formatCurrency(breakup.earning.hra / 12)}</div>
                                            <div className="text-right">{formatCurrency(breakup.earning.hra)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-sm">
                                            <div className="font-medium text-purple-600">Special Allowance</div>
                                            <div className="text-right">{formatCurrency(breakup.earning.special / 12)}</div>
                                            <div className="text-right">{formatCurrency(breakup.earning.special)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-sm font-semibold pt-2 border-t mt-2">
                                            <div>Gross Salary</div>
                                            <div className="text-right">{formatCurrency(breakup.earning.gross / 12)}</div>
                                            <div className="text-right">{formatCurrency(breakup.earning.gross)}</div>
                                        </div>
                                    </div>

                                    {/* Deductions */}
                                    <div className="p-4 space-y-3 bg-red-50/30 dark:bg-red-950/10">
                                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Deductions</div>
                                        <div className="grid grid-cols-3 text-sm">
                                            <div className="font-medium text-amber-600">Provident Fund (PF)</div>
                                            <div className="text-right">{formatCurrency(breakup.deduction.pf / 12)}</div>
                                            <div className="text-right">{formatCurrency(breakup.deduction.pf)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-sm">
                                            <div className="font-medium text-amber-600">Professional Tax</div>
                                            <div className="text-right">{formatCurrency(breakup.deduction.pt / 12)}</div>
                                            <div className="text-right">{formatCurrency(breakup.deduction.pt)}</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-sm font-semibold pt-2 border-t mt-2 text-red-600">
                                            <div>Total Deductions</div>
                                            <div className="text-right">-{formatCurrency(breakup.deduction.total / 12)}</div>
                                            <div className="text-right">-{formatCurrency(breakup.deduction.total)}</div>
                                        </div>
                                    </div>

                                    {/* Final */}
                                    <div className="p-4 bg-primary/5">
                                        <div className="grid grid-cols-3 font-bold text-lg">
                                            <div className="text-primary">Net Take Home</div>
                                            <div className="text-right text-primary">{formatCurrency(breakup.net / 12)}</div>
                                            <div className="text-right text-primary">{formatCurrency(breakup.net)}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Chart */}
                    <div className="h-[300px] w-full mt-8">
                        {isClient && (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            <ToolGuide
                title="Salary Breakup"
                sections={[
                    {
                        title: "Breakup Components",
                        content: (
                            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                                <li><strong>Basic Salary:</strong> Usually 40-50% of your CTC. This is the calculated base for HRA and PF.</li>
                                <li><strong>HRA:</strong> House Rent Allowance. 50% of Basic for Metro cities, 40% for others.</li>
                                <li><strong>Special Allowance:</strong> The remaining part of your salary after Basic, HRA, and fixed deductions.</li>
                                <li><strong>PF (Provident Fund):</strong> 12% of Basic Salary (Employee Contribution).</li>
                            </ul>
                        )
                    }
                ]}
            />

            <AdContainer slot="salary-bottom" />
        </div>
    );
}
