"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Button } from "@/components/sociials-ui/button";
import { Activity, Heart, ArrowRight } from "lucide-react";

export default function BMICalculatorPage() {
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
    const [weight, setWeight] = useState(70); // kg
    const [height, setHeight] = useState(170); // cm
    const [bmi, setBmi] = useState(0);
    const [category, setCategory] = useState({ label: "", color: "" });

    // Imperial state
    const [weightLbs, setWeightLbs] = useState(154);
    const [heightFt, setHeightFt] = useState(5);
    const [heightIn, setHeightIn] = useState(7);

    useEffect(() => {
        let calculatedBmi = 0;

        if (unit === 'metric') {
            // kg / m^2
            const hM = height / 100;
            calculatedBmi = weight / (hM * hM);
        } else {
            // 703 * lbs / in^2
            const totalInches = (heightFt * 12) + heightIn;
            calculatedBmi = 703 * weightLbs / (totalInches * totalInches);
        }

        setBmi(parseFloat(calculatedBmi.toFixed(1)));

        if (calculatedBmi < 18.5) setCategory({ label: "Underweight", color: "text-blue-500" });
        else if (calculatedBmi < 25) setCategory({ label: "Normal Weight", color: "text-green-500" });
        else if (calculatedBmi < 30) setCategory({ label: "Overweight", color: "text-orange-500" });
        else setCategory({ label: "Obese", color: "text-red-500" });

    }, [unit, weight, height, weightLbs, heightFt, heightIn]);

    const faq = [
        { q: "What is BMI?", a: "BMI (Body Mass Index) is a simple screening tool to identify possible weight problems for adults." },
        { q: "Is BMI accurate for athletes?", a: "Not always. Muscle is denser than fat, so athletes may have a high BMI despite having low body fat." },
        { q: "What is a healthy BMI?", a: "A BMI between 18.5 and 24.9 is considered 'normal' or 'healthy' for most adults." },
        { q: "Does BMI apply to children?", a: "BMI is calculated the same way for children, but the interpretation differs. Children's BMI is compared against age-specific percentiles." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "BMI Calculator",
        "operatingSystem": "All",
        "applicationCategory": "HealthApplication",
        "description": "Calculate your Body Mass Index (BMI) to understand your health status. Supports Metric and Imperial units.",
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
                title="BMI Calculator"
                description="Check your Body Mass Index (BMI) to understand your health status. Supports both Metric (kg/cm) and Standard (lbs/ft) units."
            />

            <AdContainer slot="bmi-top" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                {/* Controls */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-2 shadow-lg h-full">
                        <CardContent className="p-8 space-y-8">
                            <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                                <Button
                                    variant={unit === 'metric' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setUnit('metric')}
                                >
                                    Metric (kg/cm)
                                </Button>
                                <Button
                                    variant={unit === 'imperial' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setUnit('imperial')}
                                >
                                    Standard (lbs/ft)
                                </Button>
                            </div>

                            {unit === 'metric' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label>Weight (kg)</Label>
                                        <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="h-12 text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Height (cm)</Label>
                                        <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="h-12 text-lg" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label>Weight (lbs)</Label>
                                        <Input type="number" value={weightLbs} onChange={(e) => setWeightLbs(Number(e.target.value))} className="h-12 text-lg" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="space-y-2 w-full">
                                            <Label>Height (ft)</Label>
                                            <Input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className="h-12 text-lg" />
                                        </div>
                                        <div className="space-y-2 w-full">
                                            <Label>Inches</Label>
                                            <Input type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className="h-12 text-lg" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Results */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 shadow-xl bg-teal-50/50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900 h-full">
                        <CardContent className="p-8 space-y-6 flex flex-col justify-center h-full">
                            <div className="text-center space-y-4">
                                <Activity className="h-12 w-12 mx-auto text-teal-600 dark:text-teal-400" />
                                <div>
                                    <p className="text-muted-foreground font-medium uppercase tracking-wide text-xs mb-2">Your BMI Score</p>
                                    <h3 className="text-6xl font-extrabold text-foreground">{bmi}</h3>
                                </div>
                                <div className={`text-2xl font-bold ${category.color}`}>
                                    {category.label}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Understanding Body Mass Index">
                    <p>
                        Body Mass Index (BMI) is a value derived from the mass (weight) and height of a person.
                        The BMI is defined as the body mass divided by the square of the body height, and is expressed in units of kg/m²,
                        resulting from mass in kilograms and height in metres.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="BMI Categories (WHO Standards)">
                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div className="p-4 bg-muted rounded-lg font-medium">Underweight</div>
                        <div className="p-4 border rounded-lg">&lt; 18.5</div>

                        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg font-medium text-green-700 dark:text-green-300">Normal Weight</div>
                        <div className="p-4 border border-green-200 dark:border-green-800 rounded-lg">18.5 – 24.9</div>

                        <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg font-medium text-orange-700 dark:text-orange-300">Overweight</div>
                        <div className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg">25 – 29.9</div>

                        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg font-medium text-red-700 dark:text-red-300">Obesity</div>
                        <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg">30 or greater</div>
                    </div>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="bmi-bottom" />
        </div>
    );
}
