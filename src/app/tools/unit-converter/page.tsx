"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { ArrowRightLeft, Ruler, Weight, Thermometer, FlaskConical } from "lucide-react";

const units = {
    length: {
        name: "Length",
        icon: Ruler,
        base: "m",
        ratios: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254 }
    },
    weight: {
        name: "Weight",
        icon: Weight,
        base: "kg",
        ratios: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 }
    },
    temperature: {
        name: "Temperature",
        icon: Thermometer,
        base: "c",
        convert: (val: number, from: string, to: string) => {
            let celsius = val;
            if (from === "f") celsius = (val - 32) * 5 / 9;
            if (from === "k") celsius = val - 273.15;

            if (to === "c") return celsius;
            if (to === "f") return (celsius * 9 / 5) + 32;
            if (to === "k") return celsius + 273.15;
            return val;
        }
    },
    volume: {
        name: "Volume",
        icon: FlaskConical,
        base: "l",
        ratios: { l: 1, ml: 0.001, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588 }
    }
};

export default function UnitConverterPage() {
    const [category, setCategory] = useState<keyof typeof units>("length");
    const [value, setValue] = useState("1");
    const [fromUnit, setFromUnit] = useState("m");
    const [toUnit, setToUnit] = useState("km");
    const [result, setResult] = useState("0.001");

    useEffect(() => {
        // Reset units when category changes
        const newCategory = units[category];
        const unitKeys = Object.keys("ratios" in newCategory ? newCategory.ratios : { c: 1, f: 1, k: 1 });
        setFromUnit(unitKeys[0]);
        setToUnit(unitKeys[1] || unitKeys[0]);
    }, [category]);

    useEffect(() => {
        const cat = units[category];
        const val = parseFloat(value);
        if (isNaN(val)) {
            setResult("0");
            return;
        }

        if ("ratios" in cat) {
            const startInBase = val * (cat.ratios as any)[fromUnit];
            const final = startInBase / (cat.ratios as any)[toUnit];
            setResult(final.toFixed(6).replace(/\.?0+$/, ""));
        } else if ("convert" in cat) {
            const final = cat.convert(val, fromUnit, toUnit);
            setResult(final.toFixed(2).replace(/\.?0+$/, ""));
        }
    }, [value, category, fromUnit, toUnit]);

    const faq = [
        { q: "Is this converter accurate?", a: "Yes, we use industry-standard conversion ratios. However, for specialized scientific work, always cross-verify results." },
        { q: "Can I convert between different categories?", a: "No, you can only convert within the same category (e.g., length to length) to ensure physical accuracy." },
        { q: "How do I switch categories?", a: "Use the category icons at the top of the converter tool to switch between Length, Weight, Temperature, and Volume." },
        { q: "Does this work offline?", a: "Yes! Once the page loads, all calculations happen in your browser without internet." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Universal Unit Converter",
        "operatingSystem": "All",
        "applicationCategory": "Utility",
        "description": "Convert between units of length, weight, temperature, and volume. Free, accurate, and works offline.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="Universal Unit Converter"
                description="Convert instantly between professional and everyday units of measurement including length, weight, temperature, and volume."
            />

            <AdContainer slot="unit-top" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground ml-1">Categories</h3>
                    {Object.entries(units).map(([key, cat]) => (
                        <Button
                            key={key}
                            variant={category === key ? "default" : "outline"}
                            className="justify-start gap-3 h-14"
                            onClick={() => setCategory(key as any)}
                        >
                            <cat.icon size={20} />
                            {cat.name}
                        </Button>
                    ))}
                </div>

                <Card className="lg:col-span-3 border-2 shadow-xl">
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <label className="text-sm font-medium">From</label>
                                <div className="flex gap-4">
                                    <Input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="h-12 text-lg font-semibold"
                                    />
                                    <Select value={fromUnit} onValueChange={setFromUnit}>
                                        <SelectTrigger className="h-12 w-32 uppercase font-mono">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys("ratios" in units[category] ? (units[category] as any).ratios : { c: 1, f: 1, k: 1 }).map(u => (
                                                <SelectItem key={u} value={u} className="uppercase font-mono">{u}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-center md:pt-6">
                                <div className="bg-primary/10 p-3 rounded-full text-primary rotate-90 md:rotate-0">
                                    <ArrowRightLeft size={24} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium">To</label>
                                <div className="flex gap-4">
                                    <div className="h-12 flex-1 bg-muted rounded-md flex items-center px-4 text-lg font-bold">
                                        {result}
                                    </div>
                                    <Select value={toUnit} onValueChange={setToUnit}>
                                        <SelectTrigger className="h-12 w-32 uppercase font-mono">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.keys("ratios" in units[category] ? (units[category] as any).ratios : { c: 1, f: 1, k: 1 }).map(u => (
                                                <SelectItem key={u} value={u} className="uppercase font-mono">{u}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-xl border border-dashed text-center">
                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Formula</p>
                            <p className="text-lg font-serif italic mt-1">
                                Value in {toUnit.toUpperCase()} = Value in {fromUnit.toUpperCase()} × Conversion Factor
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SEO CONTENT SECTION */}
            <div className="max-w-4xl mx-auto space-y-4">
                <ToolContentSection title="Complete Guide to Unit Conversion">
                    <p>
                        Understanding measurements is fundamental to science, business, and daily life. Our Unit Converter is designed to
                        bridge the gap between different systems of measurement, such as the Metric system (International System of Units)
                        and the Imperial system used in the United States and the UK.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div className="space-y-2">
                            <h4 className="font-bold">Length & Distance</h4>
                            <p className="text-sm">
                                From millimeters used in precision engineering to miles used in cross-country travel,
                                our tool handles all common length conversions. It's an essential resource for architects and travelers alike.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold">Mass & Weight</h4>
                            <p className="text-sm">
                                Need to convert grams to ounces for a recipe, or pounds to kilograms for a shipping label?
                                Our mass converter provides instant results for all your weighing needs.
                            </p>
                        </div>
                    </div>
                </ToolContentSection>

                <ToolContentSection title="Scientific Precision on Any Device">
                    <p>
                        Whether you are on a mobile phone or a high-end desktop, <strong>Toolioz Unit Converter</strong> scales beautifully.
                        We prioritize accuracy by using floating-point arithmetic and rounding to significant figures, ensuring
                        that your scientific or culinary projects are always on point. Like all our tools, it is 100% private
                        and works without an internet connection once loaded.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="unit-bottom" />
        </div>
    );
}
