"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Slider } from "@/components/sociials-ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CompoundInterestPage() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(10);
    const [years, setYears] = useState(10);
    const [monthlyContribution, setMonthlyContribution] = useState(5000);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const calculateGrowth = () => {
        let balance = principal;
        const data = [];

        for (let i = 1; i <= years; i++) {
            let interest = 0;
            // Monthly compounding for contributions
            for (let m = 0; m < 12; m++) {
                balance += monthlyContribution;
                balance += balance * (rate / 100 / 12);
            }

            data.push({
                year: `Year ${i}`,
                balance: Math.round(balance),
                invested: Math.round(principal + (monthlyContribution * 12 * i))
            });
        }
        return data;
    };

    const data = calculateGrowth();
    const finalAmount = data[data.length - 1].balance;
    const totalInvested = data[data.length - 1].invested;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val);
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Compound Interest Calculator"
                description="Visualize the power of compounding. Calculate returns on lumpsum and SIP investments."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                <div className="lg:col-span-1 space-y-8">
                    <Card className="border-2">
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <Label>Initial Deposit (₹)</Label>
                                <Input
                                    type="number"
                                    value={principal}
                                    onChange={(e) => setPrincipal(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-4">
                                <Label>Monthly Contribution (₹)</Label>
                                <Input
                                    type="number"
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-4">
                                <Label>Expected Return (%): {rate}</Label>
                                <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={1} max={30} step={0.5} />
                            </div>
                            <div className="space-y-4">
                                <Label>Duration (Years): {years}</Label>
                                <Slider value={[years]} onValueChange={(v) => setYears(v[0])} min={1} max={50} step={1} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Invested</p>
                                <p className="text-xl font-bold">{formatCurrency(totalInvested)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Wealth Gained</p>
                                <p className="text-xl font-bold text-green-600">+{formatCurrency(finalAmount - totalInvested)}</p>
                            </div>
                            <div className="pt-4 border-t border-primary/20">
                                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Maturity Value</p>
                                <p className="text-3xl font-extrabold text-primary">{formatCurrency(finalAmount)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 h-[500px] border rounded-xl p-4 bg-card">
                    {isClient && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="year" hide />
                                <YAxis tickFormatter={(val) => `₹${val / 1000}k`} />
                                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                <Legend />
                                <Bar dataKey="invested" stackId="a" fill="#94a3b8" name="Invested Amount" />
                                <Bar dataKey="balance" stackId="a" fill="#4f46e5" name="Compound Growth" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
