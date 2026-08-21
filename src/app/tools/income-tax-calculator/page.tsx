"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { IndianRupee, AlertCircle } from "lucide-react";

export default function IncomeTaxCalculatorPage() {
    const [salary, setSalary] = useState<number>(1200000);
    const [deductions, setDeductions] = useState<number>(0); // Standard Deduction automatically handled based on regime usually
    const [tax, setTax] = useState(0);
    const [cess, setCess] = useState(0);

    // Simplified New Regime FY 2024-25
    const calculateTax = () => {
        let income = salary - 75000; // Standard Deduction
        if (income <= 0) {
            setTax(0);
            setCess(0);
            return;
        }

        // New Regime Slabs
        let totalTax = 0;

        // 0-3L: NIL
        // 3-7L: 5%
        if (income > 300000) {
            totalTax += Math.min(income - 300000, 400000) * 0.05;
        }
        // 7-10L: 10%
        if (income > 700000) {
            totalTax += Math.min(income - 700000, 300000) * 0.10;
        }
        // 10-12L: 15%
        if (income > 1000000) {
            totalTax += Math.min(income - 1000000, 200000) * 0.15;
        }
        // 12-15L: 20%
        if (income > 1200000) {
            totalTax += Math.min(income - 1200000, 300000) * 0.20;
        }
        // >15L: 30%
        if (income > 1500000) {
            totalTax += (income - 1500000) * 0.30;
        }

        // Rebate u/s 87A: If taxable income <= 7L, tax is 0.
        if (income <= 700000) {
            totalTax = 0;
        } else if (income <= 727770) {
            // Marginal Relief (simplified)
            // Not implementing exact marginal relief for simplicity in this MVP
        }

        const calculatedCess = totalTax * 0.04;
        setTax(totalTax);
        setCess(calculatedCess);
    };

    useEffect(() => {
        calculateTax();
    }, [salary]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val);
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Income Tax Calculator FY 2024-25",
        "operatingSystem": "All",
        "applicationCategory": "Finance",
        "description": "Calculate your income tax for the financial year 2024-25 under the default New Tax Regime with our precise calculator.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    };

    const guideSections = [
        {
            title: "Navigating the New Tax Regime (FY 2024-25)",
            content: (
                <p>
                    Budget 2024 introduced several enhancements to the **New Tax Regime**, making it the default and often most beneficial option for Indian taxpayers. Key changes include an increased standard deduction of **₹75,000** and revised tax slabs. Our calculator is updated to reflect these latest changes, helping you plan your finances with confidence.
                </p>
            )
        },
        {
            title: "Key Changes You Should Know",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>**Standard Deduction**: Increased from ₹50,000 to ₹75,000.</li>
                    <li>**Tax-Free Income**: No tax is payable on income up to ₹7 Lakhs due to rebate u/s 87A.</li>
                    <li>**Simplified Slabs**: Lower percentages across various income brackets to reduce the overall tax burden.</li>
                </ul>
            )
        }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="Income Tax Calculator"
                description="Estimate your income tax for FY 2024-25 under the New Tax Regime (Default)."
            />

            <AdContainer slot="7890123456" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-2">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-4">
                                <Label>Annual CTC / Gross Salary (₹)</Label>
                                <Input
                                    type="number"
                                    value={salary}
                                    onChange={(e) => setSalary(Number(e.target.value))}
                                    className="h-14 text-xl font-semibold"
                                />
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <AlertCircle size={14} /> Automatically applies Standard Deduction of ₹75,000 for FY24-25.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900 h-full">
                        <CardContent className="p-8 space-y-6 flex flex-col justify-center h-full">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>Income Tax</span>
                                    <span>{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>Health & Cess (4%)</span>
                                    <span>{formatCurrency(cess)}</span>
                                </div>
                                <div className="pt-4 border-t border-orange-200 dark:border-orange-800">
                                    <p className="text-center text-xs uppercase tracking-wider text-muted-foreground mb-1">Total Tax Payable</p>
                                    <h3 className="text-4xl font-extrabold text-center text-orange-600 dark:text-orange-400">{formatCurrency(tax + cess)}</h3>
                                </div>
                                <div className="pt-4 text-center">
                                    <p className="text-sm font-medium">Monthly Outflow: {formatCurrency((tax + cess) / 12)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ToolGuide
                title="Income Tax (FY 2024-25)"
                sections={guideSections}
            />

            <AdContainer slot="8901234567" />
        </div>
    );
}
