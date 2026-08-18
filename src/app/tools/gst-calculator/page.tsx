"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Button } from "@/components/sociials-ui/button";
import { Label } from "@/components/sociials-ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/sociials-ui/radio-group";
import { Calculator, ArrowRight } from "lucide-react";

export default function GSTCalculatorPage() {
    const [amount, setAmount] = useState<number>(1000);
    const [rate, setRate] = useState<number>(18);
    const [type, setType] = useState<"inclusive" | "exclusive">("exclusive");
    const [result, setResult] = useState({ net: 0, gst: 0, total: 0 });

    useEffect(() => {
        let net = 0, gst = 0, total = 0;

        if (type === "exclusive") {
            net = amount;
            gst = (amount * rate) / 100;
            total = amount + gst;
        } else {
            total = amount;
            gst = amount - (amount * (100 / (100 + rate)));
            net = total - gst;
        }

        setResult({
            net: parseFloat(net.toFixed(2)),
            gst: parseFloat(gst.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        });
    }, [amount, rate, type]);

    const presetRates = [5, 12, 18, 28];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(val);
    };

    const faq = [
        { q: "What is the difference between Exclusive and Inclusive GST?", a: "Exclusive means GST is added ON TOP of the amount (Base + Tax = Total). Inclusive means the amount ALREADY contains the tax (Total = Base + Tax)." },
        { q: "What are the standard GST rates in India?", a: "The standard slabs are 5% (essentials), 12% (standard), 18% (services/most goods), and 28% (luxury items)." },
        { q: "Is this calculator accurate for invoices?", a: "Yes, it uses standard standard mathematical formulas used by accounting software." },
        { q: "What about CGST and SGST?", a: "For intra-state transactions, GST is split 50-50 between CGST and SGST. This tool shows the combined GST amount." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "GST Calculator",
        "operatingSystem": "All",
        "applicationCategory": "Finance",
        "description": "Calculate Indian GST (Goods and Services Tax) for inclusive and exclusive amounts. Free and accurate.",
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
                title="GST Calculator"
                description="Calculate Goods and Services Tax (GST) online. Support for both Inclusive and Exclusive tax calculations."
            />

            <AdContainer slot="gst-top" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                {/* Controls */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-2 shadow-lg">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-4">
                                <Label>Transaction Type</Label>
                                <RadioGroup defaultValue="exclusive" value={type} onValueChange={(v) => setType(v as "inclusive" | "exclusive")} className="flex gap-4">
                                    <div className="flex items-center space-x-2 border rounded-lg p-4 w-full cursor-pointer hover:bg-muted/50">
                                        <RadioGroupItem value="exclusive" id="ex" />
                                        <Label htmlFor="ex" className="cursor-pointer">GST Exclusive (Add Tax)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-lg p-4 w-full cursor-pointer hover:bg-muted/50">
                                        <RadioGroupItem value="inclusive" id="inc" />
                                        <Label htmlFor="inc" className="cursor-pointer">GST Inclusive (Remove Tax)</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label>Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>GST Rate (%)</Label>
                                    <div className="flex gap-2 mb-2">
                                        {presetRates.map(r => (
                                            <Button
                                                key={r}
                                                variant={rate === r ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setRate(r)}
                                            >
                                                {r}%
                                            </Button>
                                        ))}
                                    </div>
                                    <Input
                                        type="number"
                                        value={rate}
                                        onChange={(e) => setRate(Number(e.target.value))}
                                        className="h-12 text-lg"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 shadow-xl bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900 h-full">
                        <CardContent className="p-8 space-y-6 flex flex-col justify-center h-full">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm text-muted-foreground">
                                    <span>Net Amount</span>
                                    <span>{formatCurrency(result.net)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-purple-600 dark:text-purple-400">
                                    <span>Total GST ({rate}%)</span>
                                    <span>{formatCurrency(result.gst)}</span>
                                </div>
                                <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
                                    <p className="text-center text-xs uppercase tracking-wider text-muted-foreground mb-1">Total Payable</p>
                                    <h3 className="text-4xl font-extrabold text-center text-foreground">{formatCurrency(result.total)}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Understanding GST Calculations">
                    <p>
                        GST can be calculated in two ways depending on whether the tax is already included in the price or needs to be added.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        <div className="p-6 bg-muted rounded-xl">
                            <h4 className="font-bold mb-2">GST Exclusive</h4>
                            <p className="text-sm text-muted-foreground mb-4">You have a net price and want to add tax to it.</p>
                            <code className="bg-background p-2 rounded block text-xs">GST = Amount * (Rate/100)</code>
                            <code className="bg-background p-2 rounded block text-xs mt-1">Total = Amount + GST</code>
                        </div>
                        <div className="p-6 bg-muted rounded-xl">
                            <h4 className="font-bold mb-2">GST Inclusive</h4>
                            <p className="text-sm text-muted-foreground mb-4">The final price already has tax, and you want to separate it.</p>
                            <code className="bg-background p-2 rounded block text-xs">GST = Amount - (Amount * (100/(100+Rate)))</code>
                        </div>
                    </div>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="gst-bottom" />
        </div>
    );
}
