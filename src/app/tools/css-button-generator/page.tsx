"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Slider } from "@/components/sociials-ui/slider";
import { ColorPicker } from "@/components/sociials-ui/color-picker";
import { Palette, Copy, Check, Sparkles } from "lucide-react";

type ButtonStyle =
    | "solid" | "outline" | "ghost" | "glass" | "neobrutalist" | "gradient" | "neumorphic" | "retro" | "minimal" | "pill"
    | "3d" | "neon" | "cyberpunk" | "soft" | "shine" | "border-slide" | "gooey" | "liquid";

const STYLE_PRESETS: { id: ButtonStyle; name: string; description: string }[] = [
    { id: "solid", name: "Solid", description: "Classic filled button" },
    { id: "outline", name: "Outline", description: "Border only, transparent bg" },
    { id: "ghost", name: "Ghost", description: "Subtle hover effect" },
    { id: "glass", name: "Glassmorphism", description: "Frosted glass effect" },
    { id: "neobrutalist", name: "Neo Brutalist", description: "Bold borders, offset shadow" },
    { id: "gradient", name: "Gradient", description: "Multi-color gradient fill" },
    { id: "neumorphic", name: "Neumorphic", description: "Soft UI, subtle 3D" },
    { id: "retro", name: "Retro", description: "Vintage pixel-perfect" },
    { id: "minimal", name: "Minimal", description: "Ultra clean, underlined" },
    { id: "pill", name: "Pill", description: "Fully rounded ends" },
    { id: "3d", name: "3D Push", description: "Pressable 3D effect" },
    { id: "neon", name: "Neon Glow", description: "Vibrant glowing effect" },
    { id: "cyberpunk", name: "Cyberpunk", description: "Futuristic with angles" },
    { id: "soft", name: "Soft Shadow", description: "Gentle, modern shadow" },
    { id: "shine", name: "Shine", description: "Animated shine sweep" },
    { id: "border-slide", name: "Border Slide", description: "Animated border fill" },
    { id: "gooey", name: "Gooey", description: "Blob-like liquid effect" },
    { id: "liquid", name: "Liquid Fill", description: "Wave fill animation" },
];

export default function CSSButtonGeneratorPage() {
    const [text, setText] = useState("Click Me");
    const [primaryColor, setPrimaryColor] = useState("#6366f1");
    const [secondaryColor, setSecondaryColor] = useState("#8b5cf6");
    const [textColor, setTextColor] = useState("#ffffff");
    const [fontSize, setFontSize] = useState(16);
    const [paddingX, setPaddingX] = useState(24);
    const [paddingY, setPaddingY] = useState(12);
    const [activeStyle, setActiveStyle] = useState<ButtonStyle>("solid");
    const [copied, setCopied] = useState(false);

    const adjustColor = (hex: string, amount: number): string => {
        const num = parseInt(hex.replace("#", ""), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + amount));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const generateCSS = (): string => {
        const base = `padding: ${paddingY}px ${paddingX}px;\n  font-size: ${fontSize}px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.3s ease;`;

        switch (activeStyle) {
            case "solid":
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: none;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}\n.btn:hover {\n  opacity: 0.9;\n  transform: translateY(-1px);\n}`;
            case "outline":
                return `.btn {\n  ${base}\n  background-color: transparent;\n  color: ${primaryColor};\n  border: 2px solid ${primaryColor};\n  border-radius: 8px;\n}\n.btn:hover {\n  background-color: ${primaryColor};\n  color: ${textColor};\n}`;
            case "ghost":
                return `.btn {\n  ${base}\n  background-color: transparent;\n  color: ${primaryColor};\n  border: none;\n  border-radius: 8px;\n}\n.btn:hover {\n  background-color: ${primaryColor}20;\n}`;
            case "glass":
                return `.btn {\n  ${base}\n  background: ${primaryColor}33;\n  color: ${textColor};\n  border: 1px solid rgba(255,255,255,0.2);\n  border-radius: 12px;\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  box-shadow: 0 4px 30px rgba(0,0,0,0.1);\n}\n.btn:hover {\n  background: ${primaryColor}55;\n}`;
            case "neobrutalist":
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: 3px solid #000;\n  box-shadow: 4px 4px 0 0 #000;\n}\n.btn:hover {\n  transform: translate(2px, 2px);\n  box-shadow: 2px 2px 0 0 #000;\n}\n.btn:active {\n  transform: translate(4px, 4px);\n  box-shadow: 0 0 0 0 #000;\n}`;
            case "gradient":
                return `.btn {\n  ${base}\n  background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);\n  color: ${textColor};\n  border: none;\n  border-radius: 8px;\n  box-shadow: 0 4px 15px rgba(0,0,0,0.2);\n}\n.btn:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(0,0,0,0.3);\n}`;
            case "neumorphic":
                return `.btn {\n  ${base}\n  background-color: #e0e0e0;\n  color: #333;\n  border: none;\n  border-radius: 12px;\n  box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;\n}\n.btn:hover {\n  box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff;\n}\n.btn:active {\n  box-shadow: inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff;\n}`;
            case "retro":
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: 4px solid #000;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  box-shadow: inset -4px -4px 0 0 rgba(0,0,0,0.3), inset 4px 4px 0 0 rgba(255,255,255,0.3);\n}\n.btn:hover {\n  transform: translate(2px, 2px);\n}`;
            case "minimal":
                return `.btn {\n  ${base}\n  background-color: transparent;\n  color: ${primaryColor};\n  border: none;\n  text-decoration: underline;\n  text-underline-offset: 4px;\n}\n.btn:hover {\n  opacity: 0.7;\n}`;
            case "pill":
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: none;\n  border-radius: 999px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.15);\n}\n.btn:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n}`;
            case "3d":
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: none;\n  border-radius: 8px;\n  box-shadow: 0 6px 0 ${adjustColor(primaryColor, -40)}, 0 8px 10px rgba(0,0,0,0.3);\n  transform: translateY(-2px);\n}\n.btn:hover {\n  transform: translateY(0);\n  box-shadow: 0 4px 0 ${adjustColor(primaryColor, -40)}, 0 6px 8px rgba(0,0,0,0.3);\n}\n.btn:active {\n  transform: translateY(4px);\n  box-shadow: 0 0 0 ${adjustColor(primaryColor, -40)}, 0 2px 4px rgba(0,0,0,0.3);\n}`;
            case "neon":
                return `.btn {\n  ${base}\n  background-color: transparent;\n  color: ${primaryColor};\n  border: 2px solid ${primaryColor};\n  border-radius: 8px;\n  text-shadow: 0 0 10px ${primaryColor};\n  box-shadow: 0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}, 0 0 40px ${primaryColor}, inset 0 0 10px ${primaryColor}33;\n}\n.btn:hover {\n  background-color: ${primaryColor};\n  color: #000;\n  box-shadow: 0 0 20px ${primaryColor}, 0 0 40px ${primaryColor}, 0 0 60px ${primaryColor};\n}`;
            case "cyberpunk":
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: none;\n  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);\n  box-shadow: 4px 4px 0 ${secondaryColor};\n}\n.btn:hover {\n  transform: translate(-2px, -2px);\n  box-shadow: 6px 6px 0 ${secondaryColor};\n}`;
            case "soft":
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: none;\n  border-radius: 12px;\n  box-shadow: 0 10px 40px ${primaryColor}50;\n}\n.btn:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 15px 50px ${primaryColor}70;\n}`;
            case "shine":
                return `.btn {\n  ${base}\n  background: linear-gradient(110deg, ${primaryColor} 45%, ${adjustColor(primaryColor, 40)} 50%, ${primaryColor} 55%);\n  background-size: 200% 100%;\n  color: ${textColor};\n  border: none;\n  border-radius: 8px;\n  animation: shine 2s infinite;\n}\n@keyframes shine {\n  0% { background-position: 200% 0; }\n  100% { background-position: -200% 0; }\n}`;
            case "border-slide":
                return `.btn {\n  ${base}\n  background-color: transparent;\n  color: ${primaryColor};\n  border: 2px solid ${primaryColor};\n  position: relative;\n  overflow: hidden;\n  z-index: 1;\n}\n.btn::before {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background-color: ${primaryColor};\n  transition: left 0.3s ease;\n  z-index: -1;\n}\n.btn:hover {\n  color: ${textColor};\n}\n.btn:hover::before {\n  left: 0;\n}`;
            case "gooey":
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: none;\n  border-radius: 30px 10px 30px 10px;\n  box-shadow: 0 8px 20px ${primaryColor}50;\n}\n.btn:hover {\n  border-radius: 10px 30px 10px 30px;\n  transform: scale(1.05);\n}`;
            case "liquid":
                return `.btn {\n  ${base}\n  background-color: transparent;\n  color: ${primaryColor};\n  border: 2px solid ${primaryColor};\n  border-radius: 8px;\n  position: relative;\n  overflow: hidden;\n  z-index: 1;\n}\n.btn::before {\n  content: '';\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 0%;\n  background-color: ${primaryColor};\n  transition: height 0.4s ease;\n  z-index: -1;\n}\n.btn:hover {\n  color: ${textColor};\n}\n.btn:hover::before {\n  height: 100%;\n}`;
            default:
                return `.btn {\n  ${base}\n  background-color: ${primaryColor};\n  color: ${textColor};\n  border: none;\n  border-radius: 8px;\n}`;
        }
    };

    // Generate live preview CSS (injected into style tag)
    const getPreviewCSS = (): string => {
        return generateCSS().replace(/\.btn/g, '.preview-btn');
    };

    const copyCSS = () => {
        navigator.clipboard.writeText(generateCSS());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container px-6 py-12 max-w-6xl mx-auto">
            {/* Inject live CSS for preview */}
            <style dangerouslySetInnerHTML={{ __html: getPreviewCSS() }} />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <Palette className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">CSS Button Generator</h1>
                        <p className="text-muted-foreground">18 trending button styles with live hover preview</p>
                    </div>
                </div>

                {/* Style Presets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" /> Style Presets
                        </CardTitle>
                        <CardDescription>Choose from 18 trending button styles — hover the preview to see effects!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                            {STYLE_PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => setActiveStyle(preset.id)}
                                    className={`p-3 rounded-lg border-2 text-left transition-all ${activeStyle === preset.id
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    <p className="font-semibold text-xs">{preset.name}</p>
                                    <p className="text-[10px] text-muted-foreground line-clamp-1">{preset.description}</p>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Preview</CardTitle>
                            <CardDescription>Hover the button to see the effect!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`flex items-center justify-center min-h-[300px] rounded-xl ${activeStyle === "glass" ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                                    activeStyle === "neumorphic" ? "bg-[#e0e0e0]" :
                                        activeStyle === "neon" ? "bg-gray-900" :
                                            "bg-muted/50"
                                    }`}
                            >
                                <button className="preview-btn">
                                    {text}
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customize</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Button Text</Label>
                                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Button text" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <ColorPicker value={primaryColor} onChange={setPrimaryColor} />
                                </div>
                                {(activeStyle === "gradient" || activeStyle === "cyberpunk") && (
                                    <div className="space-y-2">
                                        <Label>Secondary Color</Label>
                                        <ColorPicker value={secondaryColor} onChange={setSecondaryColor} />
                                    </div>
                                )}
                                {!["neumorphic", "minimal", "neon"].includes(activeStyle) && (
                                    <div className="space-y-2">
                                        <Label>Text Color</Label>
                                        <ColorPicker value={textColor} onChange={setTextColor} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <div className="flex justify-between"><Label>Font Size</Label><span className="text-xs text-muted-foreground font-mono">{fontSize}px</span></div>
                                    <Slider value={[fontSize]} onValueChange={(v) => setFontSize(v[0])} min={12} max={24} step={1} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><Label>Padding X</Label><span className="text-xs text-muted-foreground font-mono">{paddingX}px</span></div>
                                    <Slider value={[paddingX]} onValueChange={(v) => setPaddingX(v[0])} min={12} max={48} step={4} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><Label>Padding Y</Label><span className="text-xs text-muted-foreground font-mono">{paddingY}px</span></div>
                                    <Slider value={[paddingY]} onValueChange={(v) => setPaddingY(v[0])} min={8} max={24} step={2} />
                                </div>
                            </div>

                            <Button size="lg" className="w-full" onClick={copyCSS}>
                                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                {copied ? "Copied!" : "Copy CSS"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* CSS Output */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generated CSS</CardTitle>
                        <CardDescription>Complete CSS with hover, active states and keyframe animations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-muted p-6 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                            {generateCSS()}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
