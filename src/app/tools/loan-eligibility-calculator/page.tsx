"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Slider } from "@/components/sociials-ui/slider";

export default function LoanEligibilityPage() {
    const [income, setIncome] = useState(50000); // Monthly
    const [foir, setFoir] = useState(50); // Fixed Obligation to Income Ratio (%)
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);

    // EMI per Lakh calculation
    // P = 1,00,000
    // r = rate / 12 / 100
    // n = tenure * 12
    // EMI = [P x r x (1+r)^n]/[(1+r)^n-1]

    const calculateEligibility = () => {
        const monthlyDisposable = income * (foir / 100);
        const r = rate / 12 / 100;
        const n = tenure * 12;

        const emiPerLakh = (100000 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

        // Eligibility = (Disposable / EMI per Lakh) * 1 Lakh
        const eligibility = (monthlyDisposable / emiPerLakh) * 100000;

        return {
            eligibility: Math.round(eligibility),
            emi: Math.round(monthlyDisposable)
        };
    };

    const result = calculateEligibility();

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
        "name": "Loan Eligibility Calculator",
        "operatingSystem": "All",
        "applicationCategory": "Finance",
        "description": "Calculate your maximum loan eligibility based on monthly income, interest rates, and loan tenure with our professional financial tool.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    };

    const guideSections = [
        {
            title: "How Banks Calculate Loan Eligibility",
            content: (
                <p>
                    Lenders typically use a formula called the **FOIR (Fixed Obligation to Income Ratio)** to determine how much you can borrow. This ratio represents the percentage of your monthly income that can be used to pay off debts. Most banks prefer a FOIR of 40% to 50%. Our calculator takes your net income and applies these standard banking principles to give you a realistic estimate of your **borrowing capacity**.
                </p>
            )
        },
        {
            title: "Factors That Affect Your Eligibility",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li>**Monthly Income**: Higher income directly increases your loan capacity.</li>
                    <li>**Existing EMIs**: Professional lenders will subtract any current loan repayments from your disposable income.</li>
                    <li>**Loan Tenure**: Longer tenures reduce the monthly EMI, thereby increasing the total loan amount you qualify for.</li>
                    <li>**Interest Rate**: Lower interest rates mean more of your EMI goes towards the principal, raising your eligibility.</li>
                </ul>
            )
        }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="Loan Eligibility Calculator"
                description="Check how much loan you can borrow based on your monthly income and current interest rates."
            />

            <AdContainer slot="9012345678" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div className="space-y-8">
                    <Card className="border-2 shadow-lg">
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <Label>Net Monthly Income (₹)</Label>
                                <Input
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(Number(e.target.value))}
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-4">
                                <Label>Interest Rate (%): {rate}</Label>
                                <Slider value={[rate]} onValueChange={(v) => setRate(v[0])} min={6} max={15} step={0.1} />
                            </div>
                            <div className="space-y-4">
                                <Label>Tenure (Years): {tenure}</Label>
                                <Slider value={[tenure]} onValueChange={(v) => setTenure(v[0])} min={1} max={30} step={1} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    <Card className="border-2 shadow-xl bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900 border-l-4 border-l-green-500">
                        <CardContent className="p-8 text-center space-y-2">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Maximum Loan Amount</p>
                            <h3 className="text-5xl font-extrabold text-green-700 dark:text-green-400">
                                {formatCurrency(result.eligibility)}
                            </h3>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-md">
                        <CardContent className="p-6 text-center space-y-2">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Max Affordable EMI</p>
                            <h3 className="text-2xl font-bold text-foreground">
                                {formatCurrency(result.emi)}
                            </h3>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ToolGuide
                title="Loan Eligibility"
                sections={guideSections}
            />

            <AdContainer slot="0123456789" />
        </div>
    );
}
