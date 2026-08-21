"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Slider } from "@/components/sociials-ui/slider";
import { Label } from "@/components/sociials-ui/label";
import { ColorPicker } from "@/components/sociials-ui/color-picker";
import { Clipboard, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function GlassmorphismPage() {
    const [blur, setBlur] = useState([16]);
    const [transparency, setTransparency] = useState([0.6]);
    const [saturation, setSaturation] = useState([1.8]);
    const [color, setColor] = useState("#ffffff");
    const [outline, setOutline] = useState(true);

    const rgbaColor = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const cssCode = `background: ${rgbaColor(color, transparency[0])};
backdrop-filter: blur(${blur[0]}px) saturate(${saturation[0] * 100}%);
-webkit-backdrop-filter: blur(${blur[0]}px) saturate(${saturation[0] * 100}%);
border-radius: 12px;
border: 1px solid rgba(255, 255, 255, 0.125);
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        toast.success("CSS copied to clipboard!");
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-6xl">
            <ToolHeader
                title="Glassmorphism Generator"
                description="Generate beautiful CSS glassmorphism effects for your UI designs."
            />

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Controls */}
                <div className="space-y-6">
                    <Card className="border-0 ring-1 ring-border/50">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Blur</Label>
                                    <span className="font-mono text-muted-foreground">{blur[0]}px</span>
                                </div>
                                <Slider value={blur} onValueChange={setBlur} min={0} max={40} step={1} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Transparency</Label>
                                    <span className="font-mono text-muted-foreground">{Math.round(transparency[0] * 100)}%</span>
                                </div>
                                <Slider value={transparency} onValueChange={setTransparency} min={0} max={1} step={0.01} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Saturation</Label>
                                    <span className="font-mono text-muted-foreground">{Math.round(saturation[0] * 100)}%</span>
                                </div>
                                <Slider value={saturation} onValueChange={setSaturation} min={0} max={2} step={0.1} />
                            </div>

                            <div className="space-y-4">
                                <Label>Base Color</Label>
                                <ColorPicker value={color} onChange={setColor} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 ring-1 ring-border/50 bg-slate-900 text-slate-100">
                        <CardContent className="p-6 relative group">
                            <pre className="font-mono text-sm overflow-x-auto whitespace-pre-wrap rounded-lg">
                                {cssCode}
                            </pre>
                            <Button
                                size="sm"
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={copyToClipboard}
                            >
                                <Clipboard className="w-4 h-4 mr-2" /> Copy
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="relative min-h-[500px] rounded-3xl overflow-hidden flex items-center justify-center p-8 bg-gradient-to-br from-[#FF3CAC] via-[#784BA0] to-[#2B86C5]">
                    {/* Floating shapes for depth */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4, left-1/2 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                    {/* Glass Element */}
                    <div
                        className="relative w-full max-w-sm p-8 text-white"
                        style={{
                            background: rgbaColor(color, transparency[0]),
                            backdropFilter: `blur(${blur[0]}px) saturate(${saturation[0] * 100}%)`,
                            WebkitBackdropFilter: `blur(${blur[0]}px) saturate(${saturation[0] * 100}%)`,
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.125)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                        }}
                    >
                        <h3 className="text-2xl font-bold mb-2">Glassmorphism</h3>
                        <p className="opacity-80 leading-relaxed">
                            This creates a frosted glass effect using the backdrop-filter property. It's popular in modern UI design.
                        </p>
                        <Button className="mt-6 w-full bg-white/20 hover:bg-white/30 border-0 backdrop-blur-md">
                            Action Button
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
