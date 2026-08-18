"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Button } from "@/components/sociials-ui/button";
import { Badge } from "@/components/sociials-ui/badge";
import { ColorPicker } from "@/components/sociials-ui/color-picker";
import { Palette, Copy, Check, RefreshCw, Sun, Moon, Info } from "lucide-react";

export default function ColorPalettePage() {
    const [baseColor, setBaseColor] = useState("#6366f1");
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    // Color conversion utilities
    const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return { h: 0, s: 0, l: 0 };

        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    };

    const hslToHex = (h: number, s: number, l: number): string => {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    const hexToRGB = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return "rgb(0, 0, 0)";
        return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
    };

    // Generate comprehensive UI palette
    const palette = useMemo(() => {
        const { h, s, l } = hexToHSL(baseColor);

        // Generate shades (50-950 like Tailwind)
        const shades = [
            { name: "50", hex: hslToHex(h, Math.max(s - 30, 10), 97) },
            { name: "100", hex: hslToHex(h, Math.max(s - 20, 15), 94) },
            { name: "200", hex: hslToHex(h, Math.max(s - 10, 20), 86) },
            { name: "300", hex: hslToHex(h, s, 76) },
            { name: "400", hex: hslToHex(h, s, 64) },
            { name: "500", hex: hslToHex(h, s, 50) },
            { name: "600", hex: hslToHex(h, s + 5, 42) },
            { name: "700", hex: hslToHex(h, s + 10, 34) },
            { name: "800", hex: hslToHex(h, s + 10, 26) },
            { name: "900", hex: hslToHex(h, s + 10, 18) },
            { name: "950", hex: hslToHex(h, s + 15, 10) },
        ];

        // UI Theme Colors - Light Mode
        const lightTheme = {
            primary: hslToHex(h, s, 45),
            primaryForeground: "#ffffff",
            secondary: hslToHex(h, 10, 96),
            secondaryForeground: hslToHex(h, 10, 20),
            accent: hslToHex((h + 30) % 360, s * 0.8, 55),
            accentForeground: "#ffffff",
            background: "#ffffff",
            foreground: hslToHex(h, 10, 10),
            muted: hslToHex(h, 8, 96),
            mutedForeground: hslToHex(h, 10, 45),
            border: hslToHex(h, 10, 90),
            ring: hslToHex(h, s, 45),
            destructive: "#ef4444",
            success: "#22c55e",
            warning: "#f59e0b",
        };

        // UI Theme Colors - Dark Mode
        const darkTheme = {
            primary: hslToHex(h, s * 0.9, 60),
            primaryForeground: hslToHex(h, s, 10),
            secondary: hslToHex(h, 15, 18),
            secondaryForeground: hslToHex(h, 10, 90),
            accent: hslToHex((h + 30) % 360, s * 0.7, 45),
            accentForeground: "#ffffff",
            background: hslToHex(h, 15, 8),
            foreground: hslToHex(h, 5, 95),
            muted: hslToHex(h, 12, 15),
            mutedForeground: hslToHex(h, 10, 60),
            border: hslToHex(h, 12, 20),
            ring: hslToHex(h, s * 0.9, 60),
            destructive: "#dc2626",
            success: "#16a34a",
            warning: "#d97706",
        };

        // Color harmonies
        const harmonies = {
            complementary: hslToHex((h + 180) % 360, s, l),
            analogous: [
                hslToHex((h - 30 + 360) % 360, s, l),
                hslToHex((h + 30) % 360, s, l)
            ],
            triadic: [
                hslToHex((h + 120) % 360, s, l),
                hslToHex((h + 240) % 360, s, l)
            ],
            splitComplementary: [
                hslToHex((h + 150) % 360, s, l),
                hslToHex((h + 210) % 360, s, l)
            ]
        };

        return { shades, lightTheme, darkTheme, harmonies };
    }, [baseColor]);

    const copyColor = (color: string) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const randomColor = () => {
        const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setBaseColor(hex);
    };

    const ColorSwatch = ({ color, label, sublabel }: { color: string; label: string; sublabel?: string }) => (
        <button
            onClick={() => copyColor(color)}
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
        >
            <div
                className="w-12 h-12 rounded-lg shadow-sm border flex-shrink-0"
                style={{ backgroundColor: color }}
            />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label}</p>
                {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
                <p className="text-xs font-mono text-muted-foreground">{color.toUpperCase()}</p>
            </div>
            {copiedColor === color ? (
                <Check className="h-4 w-4 text-green-500" />
            ) : (
                <Copy className="h-4 w-4 opacity-0 group-hover:opacity-50" />
            )}
        </button>
    );

    return (
        <div className="container px-6 py-12 max-w-6xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <Palette className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">UI Color Palette Generator</h1>
                        <p className="text-muted-foreground">Generate developer-ready color systems for light & dark themes</p>
                    </div>
                </div>

                {/* Base Color Picker */}
                <Card>
                    <CardHeader>
                        <CardTitle>Choose Base Color</CardTitle>
                        <CardDescription>Pick your brand or primary color to generate a complete UI palette</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <ColorPicker
                                value={baseColor}
                                onChange={setBaseColor}
                                squareClassName="h-24 w-24 rounded-xl shadow-lg border-4 border-background"
                                className="w-auto h-auto"
                            />
                            <div className="space-y-3 flex-1">
                                <div className="flex gap-2 flex-wrap">
                                    <Input
                                        value={baseColor}
                                        onChange={(e) => setBaseColor(e.target.value)}
                                        className="font-mono uppercase w-28"
                                    />
                                    <Button variant="outline" size="icon" onClick={() => copyColor(baseColor)}>
                                        {copiedColor === baseColor ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <Button variant="outline" onClick={randomColor}>
                                        <RefreshCw className="h-4 w-4 mr-2" /> Random
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-mono">{hexToRGB(baseColor)}</span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Color Scale */}
                <Card>
                    <CardHeader>
                        <CardTitle>Color Scale</CardTitle>
                        <CardDescription>Tailwind-style shades from 50 to 950</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex rounded-xl overflow-hidden">
                            {palette.shades.map((shade) => (
                                <button
                                    key={shade.name}
                                    onClick={() => copyColor(shade.hex)}
                                    className="flex-1 h-20 flex flex-col items-center justify-end pb-2 hover:opacity-90 transition-opacity"
                                    style={{
                                        backgroundColor: shade.hex,
                                        color: parseInt(shade.name) > 400 ? '#fff' : '#000'
                                    }}
                                >
                                    <span className="text-[10px] font-bold opacity-70">{shade.name}</span>
                                    {copiedColor === shade.hex && <Check className="h-3 w-3" />}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Light & Dark Theme */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Light Theme */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <Sun className="h-5 w-5" />
                            <div>
                                <CardTitle>Light Theme</CardTitle>
                                <CardDescription>Optimized for light backgrounds</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <ColorSwatch color={palette.lightTheme.primary} label="Primary" sublabel="Main brand color, buttons, links" />
                            <ColorSwatch color={palette.lightTheme.accent} label="Accent" sublabel="Highlights, CTAs, focus states" />
                            <ColorSwatch color={palette.lightTheme.background} label="Background" sublabel="Page background" />
                            <ColorSwatch color={palette.lightTheme.foreground} label="Foreground" sublabel="Main text color" />
                            <ColorSwatch color={palette.lightTheme.secondary} label="Secondary" sublabel="Secondary buttons, cards" />
                            <ColorSwatch color={palette.lightTheme.muted} label="Muted" sublabel="Subtle backgrounds, disabled states" />
                            <ColorSwatch color={palette.lightTheme.mutedForeground} label="Muted Foreground" sublabel="Secondary text, placeholders" />
                            <ColorSwatch color={palette.lightTheme.border} label="Border" sublabel="Borders, dividers" />
                        </CardContent>
                    </Card>

                    {/* Dark Theme */}
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3">
                            <Moon className="h-5 w-5" />
                            <div>
                                <CardTitle>Dark Theme</CardTitle>
                                <CardDescription>Optimized for dark backgrounds</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <ColorSwatch color={palette.darkTheme.primary} label="Primary" sublabel="Lighter for dark bg contrast" />
                            <ColorSwatch color={palette.darkTheme.accent} label="Accent" sublabel="Slightly desaturated for comfort" />
                            <ColorSwatch color={palette.darkTheme.background} label="Background" sublabel="Dark page background" />
                            <ColorSwatch color={palette.darkTheme.foreground} label="Foreground" sublabel="Light text on dark" />
                            <ColorSwatch color={palette.darkTheme.secondary} label="Secondary" sublabel="Elevated surfaces" />
                            <ColorSwatch color={palette.darkTheme.muted} label="Muted" sublabel="Subtle dark backgrounds" />
                            <ColorSwatch color={palette.darkTheme.mutedForeground} label="Muted Foreground" sublabel="Subdued text" />
                            <ColorSwatch color={palette.darkTheme.border} label="Border" sublabel="Subtle borders" />
                        </CardContent>
                    </Card>
                </div>

                {/* Semantic Colors */}
                <Card>
                    <CardHeader>
                        <CardTitle>Semantic Colors</CardTitle>
                        <CardDescription>Standard colors for feedback states</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <ColorSwatch color={palette.lightTheme.destructive} label="Destructive" />
                            <ColorSwatch color={palette.lightTheme.success} label="Success" />
                            <ColorSwatch color={palette.lightTheme.warning} label="Warning" />
                            <ColorSwatch color={palette.darkTheme.destructive} label="Destructive (Dark)" />
                            <ColorSwatch color={palette.darkTheme.success} label="Success (Dark)" />
                            <ColorSwatch color={palette.darkTheme.warning} label="Warning (Dark)" />
                        </div>
                    </CardContent>
                </Card>

                {/* Color Harmonies */}
                <Card>
                    <CardHeader>
                        <CardTitle>Color Harmonies</CardTitle>
                        <CardDescription>Color theory-based complementary colors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <p className="text-sm font-medium mb-3">Complementary</p>
                                <div className="flex gap-2">
                                    {[baseColor, palette.harmonies.complementary].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => copyColor(c)}
                                            className="flex-1 h-16 rounded-lg hover:opacity-90"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-3">Analogous</p>
                                <div className="flex gap-2">
                                    {[palette.harmonies.analogous[0], baseColor, palette.harmonies.analogous[1]].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => copyColor(c)}
                                            className="flex-1 h-16 rounded-lg hover:opacity-90"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-3">Triadic</p>
                                <div className="flex gap-2">
                                    {[baseColor, ...palette.harmonies.triadic].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => copyColor(c)}
                                            className="flex-1 h-16 rounded-lg hover:opacity-90"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-3">Split Complementary</p>
                                <div className="flex gap-2">
                                    {[palette.harmonies.splitComplementary[0], baseColor, palette.harmonies.splitComplementary[1]].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => copyColor(c)}
                                            className="flex-1 h-16 rounded-lg hover:opacity-90"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-muted/50">
                    <CardHeader className="flex flex-row items-center gap-3">
                        <Info className="h-5 w-5" />
                        <CardTitle>UI/UX Color Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• <strong>60-30-10 Rule:</strong> Use 60% background, 30% secondary, 10% accent colors</li>
                            <li>• <strong>Contrast Ratio:</strong> Ensure 4.5:1 for normal text, 3:1 for large text (WCAG AA)</li>
                            <li>• <strong>Dark Mode:</strong> Don&apos;t just invert colors - reduce saturation and increase brightness</li>
                            <li>• <strong>Primary Color:</strong> Use sparingly for CTAs and key interactive elements</li>
                            <li>• <strong>Semantic Colors:</strong> Red for errors, green for success, yellow for warnings</li>
                            <li>• <strong>Muted Colors:</strong> Use for backgrounds, disabled states, and less important UI</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
