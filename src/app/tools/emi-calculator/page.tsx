"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Slider } from "@/components/sociials-ui/slider";
import { Calendar, DollarSign, PieChart } from "lucide-react";

export default function EMICalculatorPage() {
    const [loanAmount, setLoanAmount] = useState(500000);
    const [interestRate, setInterestRate] = useState(10.5);
    const [loanTenure, setLoanTenure] = useState(5);
    const [result, setResult] = useState({ emi: 0, interest: 0, total: 0 });

    useEffect(() => {
        // P x R x (1+R)^N / [(1+R)^N-1]
        const r = interestRate / 12 / 100;
        const n = loanTenure * 12;

        if (loanAmount === 0) {
            setResult({ emi: 0, interest: 0, total: 0 });
            return;
        }

        const emi = loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - loanAmount;

        setResult({
            emi: Math.round(emi),
            interest: Math.round(totalInterest),
            total: Math.round(totalPayment)
        });
    }, [loanAmount, interestRate, loanTenure]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val);
    };

    const faq = [
        { q: "What is EMI?", a: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month." },
        { q: "How does the tenure affect my EMI?", a: "A longer tenure reduces your monthly EMI amount but significantly increases the total interest you pay over the life of the loan." },
        { q: "Is this accurate for all banks?", a: "This calculator uses the standard flat-rate reducing balance method used by 99% of banks (HDFC, SBI, ICICI, etc.). However, processing fees are not included." },
        { q: "Should I choose shorter or longer tenure?", a: "Shorter tenure means higher EMI but much less total interest. Choose based on your monthly cash flow capacity." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "EMI Calculator",
        "operatingSystem": "All",
        "applicationCategory": "Finance",
        "description": "Calculate your home, car, or personal loan EMI and total interest payable. Free and accurate.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="EMI Calculator"
                description="Plan your home, car, or personal loan. Calculate your monthly EMI and total interest payable instantly."
            />

            <AdContainer slot="emi-top" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                {/* Controls */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-2 shadow-lg">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-lg">Loan Amount</Label>
                                    <span className="font-bold text-xl text-primary bg-primary/10 px-3 py-1 rounded-md">
                                        {formatCurrency(loanAmount)}
                                    </span>
                                </div>
                                <Slider
                                    value={[loanAmount]}
                                    onValueChange={(vals) => setLoanAmount(vals[0])}
                                    min={10000} max={10000000} step={5000}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-lg">Interest Rate (% p.a)</Label>
                                    <span className="font-bold text-xl text-primary bg-primary/10 px-3 py-1 rounded-md">
                                        {interestRate}%
                                    </span>
                                </div>
                                <Slider
                                    value={[interestRate]}
                                    onValueChange={(vals) => setInterestRate(vals[0])}
                                    min={1} max={30} step={0.1}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-lg">Loan Tenure</Label>
                                    <span className="font-bold text-xl text-primary bg-primary/10 px-3 py-1 rounded-md">
                                        {loanTenure} Years
                                    </span>
                                </div>
                                <Slider
                                    value={[loanTenure]}
                                    onValueChange={(vals) => setLoanTenure(vals[0])}
                                    min={1} max={30} step={1}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 shadow-xl bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900">
                        <CardContent className="p-8 space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-muted-foreground font-medium uppercase tracking-wide text-xs">Monthly EMI</p>
                                <h3 className="text-4xl font-extrabold text-orange-600 dark:text-orange-400">{formatCurrency(result.emi)}</h3>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Principal Amount</span>
                                    <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total Interest</span>
                                    <span className="font-semibold text-red-600 dark:text-red-400">+{formatCurrency(result.interest)}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-2 border-t border-dashed border-orange-200 dark:border-orange-800 font-bold">
                                    <span>Total Payable</span>
                                    <span>{formatCurrency(result.total)}</span>
                                </div>
                            </div>

                            <div className="p-4 bg-background rounded-xl border flex items-start gap-3">
                                <PieChart className="text-primary h-5 w-5 mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    <strong>Interest Impact:</strong> Over {loanTenure} years, you will pay {((result.interest / loanAmount) * 100).toFixed(0)}% of the loan amount as interest alone.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="How EMI Calculation Works">
                    <p>
                        Equated Monthly Installment (EMI) is calculated using the reducing balance method.
                        The formula is: <strong>E = P x R x (1+R)^N / [(1+R)^N-1]</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li><strong>P</strong>: Principal loan amount</li>
                        <li><strong>R</strong>: Monthly interest rate (Annual rate / 12 / 100)</li>
                        <li><strong>N</strong>: Loan tenure in months</li>
                    </ul>
                </ToolContentSection>

                <ToolContentSection title="Tips to Reduce Your EMI">
                    <p>
                        1. <strong>Increase Down Payment:</strong> Paying more upfront reduces the principal amount, directly lowering your EMI.
                        <br />
                        2. <strong>Prepay When Possible:</strong> Using annual bonuses to prepay even 5% of your loan can reduce your tenure by years.
                        <br />
                        3. <strong>Negotiate Rate:</strong> A difference of just 0.5% in interest rate can save you lakhs of rupees over a 20-year home loan.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="emi-bottom" />
        </div>
    );
}
