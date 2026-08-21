"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Button } from "@/components/sociials-ui/button";
import { Label } from "@/components/sociials-ui/label";
import { ArrowRight, Percent } from "lucide-react";

export default function PercentageCalculatorPage() {
    // Mode 1: What is X% of Y?
    const [m1_x, setM1_x] = useState(18);
    const [m1_y, setM1_y] = useState(1000);

    // Mode 2: X is what % of Y?
    const [m2_x, setM2_x] = useState(50);
    const [m2_y, setM2_y] = useState(200);

    // Mode 3: Percentage Change from X to Y
    const [m3_x, setM3_x] = useState(100);
    const [m3_y, setM3_y] = useState(150);

    const calculateM1 = () => ((m1_x / 100) * m1_y).toFixed(2);
    const calculateM2 = () => ((m2_x / m2_y) * 100).toFixed(2);
    const calculateM3 = () => (((m3_y - m3_x) / m3_x) * 100).toFixed(2);

    const faq = [
        { q: "How do I calculate a percentage increase?", a: "Subtract the original value from the new value, divide that difference by the original value, and multiply by 100." },
        { q: "How do I calculate X% of a number?", a: "Simply multiply the number by (X/100). For example, 20% of 50 is 50 * 0.20 = 10." },
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Percentage Calculator"
                description="Solve common percentage problems easily: Find percentage of a number, percentage change, and more."
            />

            <div className="max-w-4xl mx-auto mb-16 space-y-8">

                {/* Calc 1 */}
                <Card className="border-2">
                    <CardContent className="p-8">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Percent size={20} className="text-primary" /> Percentage of a Number</h3>
                        <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                            <span>What is</span>
                            <Input type="number" value={m1_x} onChange={e => setM1_x(Number(e.target.value))} className="w-24 text-center font-bold" />
                            <span>% of</span>
                            <Input type="number" value={m1_y} onChange={e => setM1_y(Number(e.target.value))} className="w-32 text-center font-bold" />
                            <ArrowRight className="hidden md:block text-muted-foreground" />
                            <div className="bg-primary/10 px-6 py-3 rounded-lg font-extrabold text-2xl text-primary min-w-[120px] text-center">
                                {calculateM1()}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Calc 2 */}
                <Card className="border-2">
                    <CardContent className="p-8">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Percent size={20} className="text-purple-500" /> What Percentage?</h3>
                        <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                            <Input type="number" value={m2_x} onChange={e => setM2_x(Number(e.target.value))} className="w-24 text-center font-bold" />
                            <span>is what % of</span>
                            <Input type="number" value={m2_y} onChange={e => setM2_y(Number(e.target.value))} className="w-32 text-center font-bold" />
                            <ArrowRight className="hidden md:block text-muted-foreground" />
                            <div className="bg-purple-100 dark:bg-purple-900/30 px-6 py-3 rounded-lg font-extrabold text-2xl text-purple-600 dark:text-purple-400 min-w-[120px] text-center">
                                {calculateM2()}%
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Calc 3 */}
                <Card className="border-2">
                    <CardContent className="p-8">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Percent size={20} className="text-orange-500" /> Percentage Change</h3>
                        <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                            <span>From</span>
                            <Input type="number" value={m3_x} onChange={e => setM3_x(Number(e.target.value))} className="w-24 text-center font-bold" />
                            <span>to</span>
                            <Input type="number" value={m3_y} onChange={e => setM3_y(Number(e.target.value))} className="w-32 text-center font-bold" />
                            <ArrowRight className="hidden md:block text-muted-foreground" />
                            <div className="bg-orange-100 dark:bg-orange-900/30 px-6 py-3 rounded-lg font-extrabold text-2xl text-orange-600 dark:text-orange-400 min-w-[120px] text-center">
                                {Number(calculateM3()) > 0 ? "+" : ""}{calculateM3()}%
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Common Percentage Formulas">
                    <ul className="space-y-4">
                        <li className="p-4 border rounded-lg">
                            <strong className="block mb-1">Percentage Formula</strong>
                            <code>(Value / Total Value) × 100</code>
                        </li>
                        <li className="p-4 border rounded-lg">
                            <strong className="block mb-1">Percentage Change</strong>
                            <code>((New Value - Old Value) / Old Value) × 100</code>
                        </li>
                    </ul>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
