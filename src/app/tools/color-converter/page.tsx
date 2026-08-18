"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ColorPicker } from "@/components/sociials-ui/color-picker";
import { hexToRgb, rgbToHsl, rgbToCmyk, rgbToHex, getClosestColorName } from "@/lib/sociials-colors";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function ColorConverterPage() {
    const [hex, setHex] = useState("#3b82f6");
    const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
    const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
    const [cmyk, setCmyk] = useState({ c: 76, m: 47, y: 0, k: 4 });
    const [colorName, setColorName] = useState("Blue");
    const [input, setInput] = useState("#3b82f6");

    // Initialize on mount
    useEffect(() => {
        updateAllFormats("#3b82f6");
    }, []);

    const updateAllFormats = (hexValue: string) => {
        const rgbValue = hexToRgb(hexValue);
        if (rgbValue) {
            setRgb(rgbValue);
            setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
            setCmyk(rgbToCmyk(rgbValue.r, rgbValue.g, rgbValue.b));
            setColorName(getClosestColorName(hexValue));
            setHex(hexValue);
        }
    };

    const handleSmartInput = (val: string) => {
        setInput(val);
        // Simple heuristic: if it looks like a hex, try to update
        if (/^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(val)) {
            let cleanHex = val.startsWith("#") ? val : "#" + val;
            if (cleanHex.length === 4) {
                // Expand short hex #f00 -> #ff0000
                cleanHex = "#" + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2] + cleanHex[3] + cleanHex[3];
            }
            updateAllFormats(cleanHex);
        }
        // TODO: Add parsing for rgb(), hsl(), or names if needed, 
        // but for now the specific inputs serve that purpose better.
    };

    const handleColorPickerChange = (val: string) => {
        setInput(val);
        updateAllFormats(val);
    };

    const handleRgbChange = (key: 'r' | 'g' | 'b', val: string) => {
        const num = Math.min(255, Math.max(0, parseInt(val) || 0));
        const newRgb = { ...rgb, [key]: num };
        setRgb(newRgb);
        const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        setHex(newHex);
        setInput(newHex);
        updateAllFormats(newHex);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${text} to clipboard!`);
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-6xl">
            <ToolHeader
                title="Color Converter"
                description="Convert colors between HEX, RGB, HSL, and CMYK formats. Includes color identification and palette integration."
            />

            <div className="grid lg:grid-cols-12 gap-12 mb-16">
                {/* Left Column: Visual & Smart Input */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Main Preview */}
                    <Card className="border-0 shadow-lg ring-1 ring-border/50 overflow-hidden">
                        <div
                            className="h-64 w-full transition-colors duration-300 flex items-center justify-center"
                            style={{ backgroundColor: hex }}
                        >
                            <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 text-center shadow-xl">
                                <p className="font-mono text-3xl font-bold text-white drop-shadow-md mb-2">{hex.toUpperCase()}</p>
                                <p className="text-white/90 font-medium drop-shadow-sm">{colorName}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Smart Input & Picker */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <Label>Select or Type Color</Label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        value={input}
                                        onChange={(e) => handleSmartInput(e.target.value)}
                                        placeholder="#ffffff, rgb(..), name..."
                                        className="h-12 text-lg font-mono"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Detects Hex. Use inputs on right for specific formats.
                                    </p>
                                </div>
                                <ColorPicker
                                    value={hex}
                                    onChange={handleColorPickerChange}
                                    className="h-12 w-12 rounded-xl ring-2 ring-offset-2 ring-offset-background ring-border"
                                    squareClassName="h-12 w-12 rounded-lg"
                                />
                            </div>

                            <Button
                                className="w-full"
                                variant="outline"
                                asChild
                            >
                                <a href={`/tools/color-palette?hex=${hex.replace('#', '')}`}>
                                    Generate Palette from this Color
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Detailed Format Converters */}
                <div className="lg:col-span-7 space-y-6">
                    {/* HEX */}
                    <Card>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="bg-slate-100 p-3 rounded-lg dark:bg-slate-800">
                                <span className="font-bold text-slate-500 text-sm">HEX</span>
                            </div>
                            <code className="flex-1 font-mono text-lg">{hex.toUpperCase()}</code>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(hex)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* RGB */}
                    <Card>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-muted-foreground text-sm bg-muted px-2 py-1 rounded">RGB</span>
                                    <code className="font-mono text-sm text-muted-foreground">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs text-red-500">Red</Label>
                                    <Input type="number" min={0} max={255} value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-green-500">Green</Label>
                                    <Input type="number" min={0} max={255} value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-blue-500">Blue</Label>
                                    <Input type="number" min={0} max={255} value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* HSL */}
                    <Card>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="bg-slate-100 p-3 rounded-lg dark:bg-slate-800">
                                <span className="font-bold text-slate-500 text-sm">HSL</span>
                            </div>
                            <code className="flex-1 font-mono text-lg">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* CMYK */}
                    <Card>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="bg-slate-100 p-3 rounded-lg dark:bg-slate-800">
                                <span className="font-bold text-slate-500 text-sm">CMYK</span>
                            </div>
                            <code className="flex-1 font-mono text-lg">cmyk({cmyk.c}%, {cmyk.m}%, {cmyk.y}%, {cmyk.k}%)</code>
                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolFAQ questions={[
                    { q: "What is CMYK?", a: "CMYK (Cyan, Magenta, Yellow, Key/Black) is the standard color model for print media, unlike RGB which is for screens." },
                    { q: "Why are colors different in print?", a: "Screens light up pixels (additive), while printers put ink on paper (subtractive). Some bright screen colors cannot be printed accurately." },
                    { q: "What is a Hex Code?", a: "A Hex code is a hexadecimal representation of RGB values used in web design. It starts with a '#' followed by 6 characters." }
                ]} />
            </div>
        </div>
    );
}
