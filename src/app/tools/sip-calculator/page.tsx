"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Slider } from "@/components/sociials-ui/slider";
import { TrendingUp, DollarSign, PieChart } from "lucide-react";

export default function SIPCalculatorPage() {
    const [investment, setInvestment] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [result, setResult] = useState({ invested: 0, returns: 0, total: 0 });

    useEffect(() => {
        const monthlyRate = rate / 12 / 100;
        const months = years * 12;
        const investedAmount = investment * months;

        // SIP Formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
        const totalValue = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        const wealthGained = totalValue - investedAmount;

        setResult({
            invested: Math.round(investedAmount),
            returns: Math.round(wealthGained),
            total: Math.round(totalValue)
        });
    }, [investment, rate, years]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val);
    };

    const faq = [
        { q: "What is SIP?", a: "SIP stands for Systematic Investment Plan. It is a method of investing a fixed sum regularly in a mutual fund scheme." },
        { q: "How is SIP calculated?", a: "We use the standard compound interest formula for monthly annuities to determine the future value of your investments." },
        { q: "Is 12% a realistic return?", a: "Long-term equity mutual funds in India have historically delivered 12-15% annual returns, but market risks always exist." },
        { q: "Can I start with a small amount?", a: "Yes! Many mutual funds allow SIPs starting from just ₹500 per month." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="SIP Calculator"
                description="Calculate the future value of your monthly mutual fund investments with our free SIP calculator."
            />

            <AdContainer slot="sip-top" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                {/* Controls */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-2 shadow-lg">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-lg">Monthly Investment</Label>
                                    <span className="font-bold text-xl text-primary bg-primary/10 px-3 py-1 rounded-md">
                                        {formatCurrency(investment)}
                                    </span>
                                </div>
                                <Slider
                                    value={[investment]}
                                    onValueChange={(vals) => setInvestment(vals[0])}
                                    min={500} max={100000} step={500}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-lg">Expected Return Rate (p.a)</Label>
                                    <span className="font-bold text-xl text-primary bg-primary/10 px-3 py-1 rounded-md">
                                        {rate}%
                                    </span>
                                </div>
                                <Slider
                                    value={[rate]}
                                    onValueChange={(vals) => setRate(vals[0])}
                                    min={1} max={30} step={0.1}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-lg">Time Period</Label>
                                    <span className="font-bold text-xl text-primary bg-primary/10 px-3 py-1 rounded-md">
                                        {years} Years
                                    </span>
                                </div>
                                <Slider
                                    value={[years]}
                                    onValueChange={(vals) => setYears(vals[0])}
                                    min={1} max={40} step={1}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 shadow-xl bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
                        <CardContent className="p-8 space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-muted-foreground font-medium uppercase tracking-wide text-xs">Total Value</p>
                                <h3 className="text-4xl font-extrabold text-primary">{formatCurrency(result.total)}</h3>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Invested Amount</span>
                                    <span className="font-semibold">{formatCurrency(result.invested)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Est. Returns</span>
                                    <span className="font-semibold text-green-600 dark:text-green-400">+{formatCurrency(result.returns)}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-background rounded-xl border flex items-start gap-3">
                                <TrendingUp className="text-primary h-5 w-5 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    <strong>Power of Compounding:</strong> By investing just {formatCurrency(investment)} monthly for {years} years,
                                    your money grew by {((result.total / result.invested) * 100 - 100).toFixed(0)}%.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="What is a Systematic Investment Plan (SIP)?">
                    <p>
                        An SIP is a hassle-free and smart way to invest money in mutual funds. SIP allows you to invest a certain amount at a regular interval (weekly, monthly, or quarterly).
                        It is a planned approach towards investments and helps you inculcate the habit of saving and building wealth for the future.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="How Rupee Cost Averaging Works">
                    <p>
                        With SIP, you buy more units when the market is low and fewer units when the market is high.
                        This averages out the cost of buying mutual fund units over time, mitigating the risk of market volatility.
                        You don't need to "time the market" – consistency is the key.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="Compound Interest: The 8th Wonder">
                    <p>
                        Albert Einstein famously called compound interest the "eighth wonder of the world."
                        In SIPs, your returns are reinvested to generate their own returns. Over long periods (10+ years),
                        the interest earned can significantly exceed the actual principal invested. This is why starting early is crucial.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="sip-bottom" />
        </div>
    );
}
