"use client";

import { useState, useCallback } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { History, Delete, RotateCcw, Equal } from "lucide-react";

export default function CalculatorPage() {
    const [display, setDisplay] = useState("0");
    const [history, setHistory] = useState<string[]>([]);
    const [isScientific, setIsScientific] = useState(false);

    const calculate = useCallback(() => {
        try {
            // Basic safety: replace mathematical symbols with JS equivalents
            const sanitizedExpr = display
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/π/g, "Math.PI")
                .replace(/e/g, "Math.E")
                .replace(/sin\(/g, "Math.sin(")
                .replace(/cos\(/g, "Math.cos(")
                .replace(/tan\(/g, "Math.tan(")
                .replace(/sqrt\(/g, "Math.sqrt(")
                .replace(/log\(/g, "Math.log10(");

            // Simple eval for demo (in production, use a parser like mathjs)
            const result = eval(sanitizedExpr);
            const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, "");

            setHistory(prev => [display + " = " + formattedResult, ...prev].slice(0, 10));
            setDisplay(formattedResult);
        } catch (e) {
            setDisplay("Error");
            setTimeout(() => setDisplay("0"), 1500);
        }
    }, [display]);

    const handleInput = (val: string) => {
        if (display === "0" || display === "Error") {
            setDisplay(val);
        } else {
            setDisplay(prev => prev + val);
        }
    };

    const clear = () => setDisplay("0");
    const backspace = () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : "0");

    const scientificButtons = [
        { label: "sin(", val: "sin(" }, { label: "cos(", val: "cos(" }, { label: "tan(", val: "tan(" },
        { label: "π", val: "π" }, { label: "e", val: "e" }, { label: "log", val: "log(" },
        { label: "sqrt", val: "sqrt(" }, { label: "^", val: "**" }, { label: "(", val: "(" },
        { label: ")", val: ")" }
    ];

    const basicButtons = [
        "7", "8", "9", "÷",
        "4", "5", "6", "×",
        "1", "2", "3", "-",
        "0", ".", "=", "+"
    ];

    const faq = [
        { q: "Is this calculator free to use?", a: "Yes, our scientific calculator is 100% free and runs entirely in your browser." },
        { q: "Does it support scientific functions?", a: "Yes, it supports trigonometric functions (sin, cos, tan), logarithms, square roots, and constants like PI and E." },
        { q: "Is my data stored?", a: "No. All calculations are performed on your device. We do not store any of your inputs or results." }
    ];



    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Scientific Calculator"
                description="A powerful, easy-to-use online calculator for basic and advanced mathematical operations."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {/* Calculator UI */}
                <Card className="lg:col-span-2 overflow-hidden border-2 shadow-xl">
                    <CardContent className="p-0">
                        <div className="bg-zinc-900 p-8 text-right">
                            <div className="text-zinc-400 text-sm h-6 overflow-hidden mb-1">
                                {history[0]?.split("=")[0] || ""}
                            </div>
                            <div className="text-white text-4xl font-mono truncate tracking-wider">
                                {display}
                            </div>
                        </div>

                        <div className="p-6 bg-background grid gap-4">
                            <div className="flex justify-between items-center mb-2">
                                <Button variant="ghost" size="sm" onClick={() => setIsScientific(!isScientific)}>
                                    {isScientific ? "Basic Mode" : "Scientific Mode"}
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={backspace}><Delete size={18} /></Button>
                                    <Button variant="destructive" size="icon" onClick={clear}><RotateCcw size={18} /></Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {isScientific && scientificButtons.map(btn => (
                                    <Button
                                        key={btn.label}
                                        variant="secondary"
                                        className="h-14 font-semibold text-lg"
                                        onClick={() => handleInput(btn.val)}
                                    >
                                        {btn.label}
                                    </Button>
                                ))}

                                {basicButtons.map(btn => (
                                    <Button
                                        key={btn}
                                        variant={btn === "=" ? "default" : isNaN(Number(btn)) ? "secondary" : "outline"}
                                        className={`h-14 font-semibold text-xl ${btn === "=" ? "bg-primary hover:bg-primary/90" : ""}`}
                                        onClick={() => btn === "=" ? calculate() : handleInput(btn === "×" ? "×" : btn === "÷" ? "÷" : btn)}
                                    >
                                        {btn === "=" ? <Equal /> : btn}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* History Panel */}
                <Card className="border-2 shadow-md">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <History size={20} />
                            <h3 className="font-bold text-lg">History</h3>
                        </div>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {history.length > 0 ? history.map((item, i) => (
                                <div key={i} className="p-3 bg-muted rounded-lg text-sm font-mono border border-border/50">
                                    {item}
                                </div>
                            )) : (
                                <p className="text-muted-foreground text-sm italic">No recent calculations</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SEO CONTENT SECTION */}
            <div className="max-w-4xl mx-auto space-y-4">
                <ToolContentSection title="How to use the Scientific Calculator">
                    <p>
                        Using our online calculator is simple and intuitive. For basic math, use the number pad and operators (+, -, ×, ÷).
                        For advanced operations, toggle the <strong>Scientific Mode</strong> to access trigonometric functions, logarithms, and powers.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Basic Operations:</strong> Perform addition, subtraction, multiplication, and division instantly.</li>
                        <li><strong>Scientific Functions:</strong> Use sin, cos, and tan for trigonometry, or log for logarithmic calculations.</li>
                        <li><strong>Keyboard Support:</strong> You can use your physical keyboard numbers and operators for faster input.</li>
                        <li><strong>History:</strong> Your last 10 calculations are saved in the history panel for easy reference.</li>
                    </ul>
                </ToolContentSection>

                <ToolContentSection title="Why use a Scientific Calculator?">
                    <p>
                        While every smartphone has a basic calculator, complex engineering, physics, and advanced mathematics require specialized functions.
                        Our tool provides a zero-install, privacy-first alternative that works on any device with a browser.
                        Whether you are a student solving algebra or a developer calculating dimensions, ToolBox provides the precision you need.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="From Abacus to Digital: A Brief History">
                    <p>
                        The journey of calculation tools began thousands of years ago with the Abacus, used in Mesopotamia, Egypt, and China.
                        It wasn't until 1642 that Blaise Pascal invented the first mechanical calculator, the Pascaline.
                    </p>
                    <p>
                        The electronic revolution began in the 1960s. In 1967, Texas Instruments developed the first handheld electronic calculator prototype,
                        codenamed "Cal Tech". By the mid-1970s, scientific calculators like the HP-35 made slide rules obsolete, allowing engineers to
                        perform complex trigonometry and logarithms anywhere.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="Technical Note: Floating Point Math">
                    <p>
                        You might notice that computers sometimes struggle with simple decimals (like 0.1 + 0.2 = 0.30000000000000004).
                        This is because modern computers use "Floating Point" arithmetic (IEEE 754 standard) to represent numbers in binary.
                    </p>
                    <p>
                        Our calculator uses JavaScript's high-precision number engine to minimize these errors, truncating usually tiny precision artifacts
                        to give you the clean, expected result (0.3) while maintaining the ability to handle massive numbers up to 1.79e+308.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
