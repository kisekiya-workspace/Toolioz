"use client";

import { useState, useRef, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Label } from "@/components/sociials-ui/label";
import { Slider } from "@/components/sociials-ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { ColorPicker, MiniColorPicker } from "@/components/sociials-ui/color-picker";
import { Copy, RefreshCw, Check, Plus, Trash2, Move, Wand2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/sociials-utils";

// Types
type GradientType = "linear" | "radial" | "mesh";

interface MeshPoint {
    id: string;
    x: number;
    y: number;
    color: string;
    size: number; // Percentage
}

export default function GradientGeneratorPage() {
    const [activeTab, setActiveTab] = useState<"classic" | "modern">("classic");
    const [copied, setCopied] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // Classic State
    const [color1, setColor1] = useState("#4f46e5");
    const [color2, setColor2] = useState("#9333ea");
    const [angle, setAngle] = useState(135);
    const [classicType, setClassicType] = useState<"linear" | "radial">("linear");

    // Modern/Mesh State
    const [baseColor, setBaseColor] = useState("#0f172a");
    const [meshPoints, setMeshPoints] = useState<MeshPoint[]>([
        { id: "1", x: 20, y: 30, color: "#4f46e5", size: 60 },
        { id: "2", x: 80, y: 20, color: "#ec4899", size: 60 },
        { id: "3", x: 50, y: 80, color: "#06b6d4", size: 70 }
    ]);
    const [noise, setNoise] = useState(0.05); // 0-1
    const [blur, setBlur] = useState(80); // 0-120px

    // Derived Values
    const classicGradient = classicType === "linear"
        ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
        : `radial-gradient(circle, ${color1}, ${color2})`;

    // Noise Data URI
    const noiseSvg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="${noise}"/></svg>`;
    const noiseDataUri = `url("data:image/svg+xml;base64,${typeof window !== 'undefined' ? btoa(noiseSvg) : ''}")`;

    // Modern Gradient CSS String
    const getGradientImage = () => {
        return meshPoints.map(p =>
            `radial-gradient(circle at ${Math.round(p.x)}% ${Math.round(p.y)}%, ${p.color} 0%, transparent ${p.size}%)`
        ).join(", ");
    };

    const copyCSS = (css: string) => {
        navigator.clipboard.writeText(css);
        setCopied(true);
        toast.success("CSS Copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const copyModern = () => {
        // We provide a container-based snippet because of the blur/noise layering complexity
        const css = `
/* Modern/Aurora Gradient Container */
.gradient-bg {
    background-color: ${baseColor};
    position: relative;
    overflow: hidden;
}

/* The Blurry Blobs */
.gradient-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${getGradientImage()};
    filter: blur(${blur}px);
}

/* The Noise Texture */
.gradient-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: ${noiseDataUri};
    mix-blend-mode: overlay;
    pointer-events: none;
}
        `.trim();
        copyCSS(css);
    };

    // Randomizers
    const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    const randomizeClassic = () => {
        setColor1(randomColor());
        setColor2(randomColor());
        setAngle(Math.floor(Math.random() * 360));
    };

    const randomizeModern = () => {
        setBaseColor(randomColor());
        setMeshPoints(meshPoints.map(p => ({
            ...p,
            color: randomColor(),
            x: Math.random() * 100,
            y: Math.random() * 100
        })));
    };

    const addMeshPoint = () => {
        const id = Math.random().toString(36).substr(2, 9);
        setMeshPoints([...meshPoints, { id, x: 50, y: 50, color: randomColor(), size: 50 }]);
    };

    const removeMeshPoint = (id: string) => {
        if (meshPoints.length > 1) {
            setMeshPoints(meshPoints.filter(p => p.id !== id));
        }
    };

    const updateMeshPoint = (id: string, updates: Partial<MeshPoint>) => {
        setMeshPoints(meshPoints.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    // SEO Data
    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CSS Gradient Generator PRO",
        "keywords": "css gradient, mesh gradient generator, aurora background, css tools",
        "description": "Create stunning linear, radial, and mesh gradients with noise textures. Modern AI-style background generator.",
        "applicationCategory": "DesignApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    // --- PRESETS DATA ---
    const PRESETS = {
        classic: [
            { name: "Sunset Vibes", type: "linear", colors: ["#ff9a9e", "#fad0c4"], angle: 90 },
            { name: "Ocean Blue", type: "linear", colors: ["#2193b0", "#6dd5ed"], angle: 135 },
            { name: "Purple Love", type: "linear", colors: ["#cc2b5e", "#753a88"], angle: 45 },
            { name: "Green Beach", type: "linear", colors: ["#02aab0", "#00cdac"], angle: 180 },
            { name: "Midnight City", type: "linear", colors: ["#232526", "#414345"], angle: 135 },
            { name: "Radial Sun", type: "radial", colors: ["#ffcf33", "#ff6347"], angle: 0 },
        ],
        modern: [
            {
                name: "AI Aurora",
                baseColor: "#0f172a",
                blur: 80,
                noise: 0.05,
                points: [
                    { x: 20, y: 30, color: "#4f46e5", size: 60 },
                    { x: 80, y: 20, color: "#ec4899", size: 60 },
                    { x: 50, y: 80, color: "#06b6d4", size: 70 }
                ]
            },
            {
                name: "Clean Tech",
                baseColor: "#ffffff",
                blur: 100,
                noise: 0.03,
                points: [
                    { x: 10, y: 10, color: "#f3f4f6", size: 80 },
                    { x: 90, y: 90, color: "#e5e7eb", size: 80 },
                    { x: 50, y: 50, color: "#dbeafe", size: 60 }
                ]
            },
            {
                name: "Neon Cyber",
                baseColor: "#000000",
                blur: 60,
                noise: 0.08,
                points: [
                    { x: 20, y: 20, color: "#ff00ff", size: 50 },
                    { x: 80, y: 80, color: "#00ffff", size: 50 },
                    { x: 50, y: 50, color: "#7928ca", size: 60 }
                ]
            },
            {
                name: "Deep Space",
                baseColor: "#020617",
                blur: 90,
                noise: 0.04,
                points: [
                    { x: 10, y: 20, color: "#1e1b4b", size: 70 },
                    { x: 90, y: 80, color: "#312e81", size: 60 },
                    { x: 50, y: 50, color: "#4338ca", size: 50 }
                ]
            },
            {
                name: "Soft Mesh",
                baseColor: "#fdf4ff",
                blur: 120,
                noise: 0.02,
                points: [
                    { x: 30, y: 30, color: "#f0abfc", size: 60 },
                    { x: 70, y: 70, color: "#a5b4fc", size: 60 },
                    { x: 20, y: 80, color: "#fca5a5", size: 60 }
                ]
            },
            {
                name: "Golden Hour",
                baseColor: "#451a03",
                blur: 80,
                noise: 0.05,
                points: [
                    { x: 20, y: 30, color: "#d97706", size: 60 },
                    { x: 80, y: 20, color: "#dc2626", size: 60 },
                    { x: 50, y: 80, color: "#db2777", size: 70 }
                ]
            }
        ]
    };

    const loadClassicPreset = (preset: any) => {
        setClassicType(preset.type);
        setColor1(preset.colors[0]);
        setColor2(preset.colors[1]);
        if (preset.angle !== undefined) setAngle(preset.angle);
        toast.success(`Loaded ${preset.name}`);
    };

    const loadModernPreset = (preset: any) => {
        setBaseColor(preset.baseColor);
        setBlur(preset.blur);
        setNoise(preset.noise);
        // Regenerate IDs to avoid conflicts/React key issues
        setMeshPoints(preset.points.map((p: any) => ({
            ...p,
            id: Math.random().toString(36).substr(2, 9)
        })));
        toast.success(`Loaded ${preset.name}`);
    };

    return (
        <div className="container px-4 py-8 m-auto max-w-[1400px]">
            <JsonLd data={jsonLdData} />
            <ToolHeader
                title="CSS Gradient Generator"
                description="Design modern backgrounds. Switching from Classic Linear to trendy Mesh & Aurora gradients."
            />

            <AdContainer slot="gradient-top" />

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-12">
                <div className="flex justify-center mb-8">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="classic">Classic (Linear/Radial)</TabsTrigger>
                        <TabsTrigger value="modern">Modern (Mesh/Aurora)</TabsTrigger>
                    </TabsList>
                </div>

                {/* CLASSIC TAB */}
                <TabsContent value="classic">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Preview */}
                        <Card className="border-2 shadow-2xl h-[400px] lg:h-auto overflow-hidden relative group rounded-3xl">
                            <div className="absolute inset-0 transition-all duration-500" style={{ background: classicGradient }} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-sm">
                                <span className="text-white font-mono bg-black/50 px-4 py-2 rounded">Preview</span>
                            </div>
                        </Card>

                        {/* Controls */}
                        <div className="space-y-6">
                            <Card className="border-2 shadow-lg">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Classic Settings</CardTitle>
                                        <Button size="icon" variant="ghost" onClick={randomizeClassic} title="Randomize">
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <Label className="w-20">Type</Label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={classicType === 'linear' ? 'default' : 'outline'}
                                                onClick={() => setClassicType('linear')}
                                                size="sm"
                                            >Linear</Button>
                                            <Button
                                                variant={classicType === 'radial' ? 'default' : 'outline'}
                                                onClick={() => setClassicType('radial')}
                                                size="sm"
                                            >Radial</Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Start Color</Label>
                                            <ColorPicker value={color1} onChange={setColor1} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Color</Label>
                                            <ColorPicker value={color2} onChange={setColor2} />
                                        </div>
                                    </div>

                                    {classicType === 'linear' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <Label>Angle ({angle}°)</Label>
                                            </div>
                                            <Slider
                                                value={[angle]}
                                                onValueChange={(vals) => setAngle(vals[0])}
                                                min={0} max={360} step={1}
                                            />
                                        </div>
                                    )}

                                    <Button size="lg" className="w-full font-bold h-12 mt-4" onClick={() => copyCSS(`background: ${classicGradient};`)}>
                                        {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />} Copy CSS
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Classic Presets */}
                            <div>
                                <Label className="mb-3 block text-muted-foreground uppercase tracking-wider text-xs font-bold">Classic Presets</Label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                    {PRESETS.classic.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => loadClassicPreset(p)}
                                            className="w-full aspect-square rounded-lg shadow-sm hover:ring-2 hover:ring-primary hover:scale-105 transition-all overflow-hidden border relative group"
                                            title={p.name}
                                        >
                                            <div
                                                className="absolute inset-0"
                                                style={{ background: p.type === 'linear' ? `linear-gradient(${p.angle}deg, ${p.colors[0]}, ${p.colors[1]})` : `radial-gradient(circle, ${p.colors[0]}, ${p.colors[1]})` }}
                                            />
                                            <span className="sr-only">{p.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* MODERN TAB */}
                <TabsContent value="modern">
                    <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
                        {/* Interactive Preview */}
                        <div className="space-y-6">
                            <Card className="border-2 shadow-2xl h-[600px] overflow-hidden relative rounded-3xl group bg-black">
                                {/* LAYER 1: Base Color */}
                                <div className="absolute inset-0" style={{ backgroundColor: baseColor }} />

                                {/* LAYER 2: Gradient Blobs (Blurred) */}
                                <div
                                    className="absolute inset-0 opacity-80"
                                    style={{
                                        backgroundImage: getGradientImage(),
                                        filter: `blur(${blur}px)`,
                                    }}
                                />

                                {/* LAYER 3: Noise Texture (Sharp Overlay) */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundImage: noiseDataUri,
                                        mixBlendMode: 'overlay'
                                    }}
                                />

                                {/* LAYER 4: Controls Overlay */}
                                {showControls && (
                                    <div className="absolute inset-0">
                                        {meshPoints.map((p) => (
                                            <div
                                                key={p.id}
                                                className="absolute w-8 h-8 -ml-4 -mt-4 border-2 border-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-move hover:scale-110 transition-transform group/point z-10"
                                                style={{ left: `${p.x}%`, top: `${p.y}%`, backgroundColor: p.color }}
                                            >
                                                {/* Handle dot center */}
                                                <div className="absolute w-2 h-2 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/point:opacity-100 whitespace-nowrap pointer-events-none border border-white/20">
                                                    {p.color.toUpperCase()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Visibility Toggle */}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="absolute bottom-4 right-4 z-20 backdrop-blur-md bg-black/20 text-white hover:bg-black/40 border-white/10"
                                    onClick={() => setShowControls(!showControls)}
                                >
                                    {showControls ? <Eye className="mr-2 h-3 w-3" /> : <EyeOff className="mr-2 h-3 w-3" />}
                                    {showControls ? "Hide Controls" : "Show Controls"}
                                </Button>
                            </Card>

                            {/* Modern Presets - Below Preview on Mobile, or same column */}
                            <div className="space-y-3">
                                <Label className="text-muted-foreground uppercase tracking-wider text-xs font-bold">Trending Mesh Presets</Label>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                    {PRESETS.modern.map((p: any, i) => (
                                        <button
                                            key={i}
                                            onClick={() => loadModernPreset(p)}
                                            className="w-full aspect-square rounded-xl shadow-sm hover:ring-2 hover:ring-primary hover:scale-105 transition-all overflow-hidden border relative group ring-offset-2 ring-offset-background"
                                            title={p.name}
                                        >
                                            <div className="absolute inset-0" style={{ backgroundColor: p.baseColor }}>
                                                {/* Mini preview of mesh - simplified */}
                                                {p.points.map((pt: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="absolute rounded-full opacity-60"
                                                        style={{
                                                            left: `${pt.x}%`,
                                                            top: `${pt.y}%`,
                                                            backgroundColor: pt.color,
                                                            width: '60%',
                                                            height: '60%',
                                                            transform: 'translate(-50%, -50%)',
                                                            filter: 'blur(10px)'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="absolute inset-0 flex items-end p-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] text-white font-medium truncate w-full text-center">{p.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modern Controls */}
                        <div className="space-y-6">
                            <Card className="border-2 h-full">
                                <CardHeader className="pb-4 border-b">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="flex items-center gap-2"><Wand2 className="w-5 h-5 text-primary" /> Mesh Controls</CardTitle>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={randomizeModern}><RefreshCw className="mr-2 h-3 w-3" /> Randomize</Button>
                                            <Button variant="default" size="sm" onClick={addMeshPoint} disabled={meshPoints.length >= 6}><Plus className="mr-2 h-3 w-3" /> Add</Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[600px]">

                                    {/* Global Settings */}
                                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                                        <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-2">Base Layer</h3>
                                        <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                                            <ColorPicker value={baseColor} onChange={setBaseColor} />

                                            <div className="space-y-4 w-full">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <Label>Blur Intensity</Label>
                                                        <span className="text-muted-foreground">{blur}px</span>
                                                    </div>
                                                    <Slider
                                                        value={[blur]}
                                                        onValueChange={([v]) => setBlur(v)}
                                                        min={0} max={150} step={1}
                                                        className="py-1"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <Label>Noise Texture</Label>
                                                        <span className="text-muted-foreground">{Math.round(noise * 100)}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[noise]}
                                                        onValueChange={([v]) => setNoise(v)}
                                                        min={0} max={0.5} step={0.01}
                                                        className="py-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Points List */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-2">Color Orbs</h3>
                                        {meshPoints.map((p, i) => (
                                            <div key={p.id} className="p-3 bg-card border rounded-lg shadow-sm space-y-3 relative group transition-all hover:border-primary/50">
                                                <div className="flex items-center gap-3">
                                                    <MiniColorPicker value={p.color} onChange={(val) => updateMeshPoint(p.id, { color: val })} />

                                                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1">

                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider"><span>X-Pos</span><span>{Math.round(p.x)}%</span></div>
                                                            <Slider value={[p.x]} onValueChange={([x]) => updateMeshPoint(p.id, { x })} min={0} max={100} step={1} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider"><span>Y-Pos</span><span>{Math.round(p.y)}%</span></div>
                                                            <Slider value={[p.y]} onValueChange={([y]) => updateMeshPoint(p.id, { y })} min={0} max={100} step={1} />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                        onClick={() => removeMeshPoint(p.id)}
                                                        disabled={meshPoints.length <= 2}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="space-y-1 px-1">
                                                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider"><span>Size / Strength</span><span>{p.size}%</span></div>
                                                    <Slider value={[p.size]} onValueChange={([size]) => updateMeshPoint(p.id, { size })} min={10} max={150} step={5} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button size="lg" className="w-full font-bold h-12" onClick={copyModern}>
                                        {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />} Copy CSS
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* END TABS */}
            </Tabs>

            <div className="max-w-4xl mx-auto space-y-8 mt-16">
                <ToolContentSection title="About Modern Gradients">
                    <p>
                        The "Modern" tab generates <strong>Mesh Gradients</strong> (also known as Aurora backgrounds).
                        It achieves this by stacking multiple blurred radial gradients on top of a base color, finished with a noise texture.
                    </p>
                    <p className="mt-4">
                        This "3-Layer" technique (Base + Blurred Orbs + Noise) is the standard for high-end "AI-style" web backgrounds.
                        Our tool generates the exact CSS required to replicate this effect.
                    </p>
                </ToolContentSection>
                <ToolFAQ questions={[
                    { q: "How do I implement this code?", a: "The generator copies a block of CSS including a container class and pseudo-elements (::before, ::after) to handle the blur and noise layers without affecting your content." },
                    { q: "Why is the CSS so long?", a: "Valid Aurora effects require separating the color layer (which needs blurring) from the noise layer (which must be sharp). We use pseudo-elements to keep your HTML clean." }
                ]} />
            </div>

            <AdContainer slot="gradient-bottom" />
        </div>
    );
}
