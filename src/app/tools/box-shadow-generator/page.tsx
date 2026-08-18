"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Button } from "@/components/sociials-ui/button";
import { Label } from "@/components/sociials-ui/label";
import { Slider } from "@/components/sociials-ui/slider";
import { Badge } from "@/components/sociials-ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { ColorPicker, MiniColorPicker } from "@/components/sociials-ui/color-picker";
import { Square, Copy, Check, Plus, Trash2, Layers, Sliders, Palette, Sparkles, Move } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";

// --- Types ---

interface ShadowLayer {
    id: string;
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string; // Hex
    opacity: number; // 0-100
    inset: boolean;
    active: boolean;
}

// --- Presets ---

const PRESETS: { name: string; layers: Omit<ShadowLayer, "id" | "active">[] }[] = [
    {
        name: "Soft Shadow",
        layers: [
            { x: 0, y: 4, blur: 10, spread: 0, color: "#000000", opacity: 10, inset: false }
        ]
    },
    {
        name: "Neumorphism",
        layers: [
            { x: 5, y: 5, blur: 10, spread: 0, color: "#d1d5db", opacity: 80, inset: false },
            { x: -5, y: -5, blur: 10, spread: 0, color: "#ffffff", opacity: 100, inset: false }
        ]
    },
    {
        name: "Material Elevation",
        layers: [
            { x: 0, y: 1, blur: 3, spread: 0, color: "#000000", opacity: 12, inset: false },
            { x: 0, y: 1, blur: 2, spread: 0, color: "#000000", opacity: 24, inset: false }
        ]
    },
    {
        name: "Inner Glow",
        layers: [
            { x: 0, y: 0, blur: 15, spread: 0, color: "#3b82f6", opacity: 30, inset: true }
        ]
    },
    {
        name: "Hard Edge (Retro)",
        layers: [
            { x: 4, y: 4, blur: 0, spread: 0, color: "#000000", opacity: 100, inset: false }
        ]
    },
    {
        name: "3D Float",
        layers: [
            { x: 0, y: 1, blur: 2, spread: 0, color: "#000000", opacity: 5, inset: false },
            { x: 0, y: 4, blur: 8, spread: 0, color: "#000000", opacity: 5, inset: false },
            { x: 0, y: 8, blur: 16, spread: 0, color: "#000000", opacity: 5, inset: false }
        ]
    },
    {
        name: "Neon Glow",
        layers: [
            { x: 0, y: 0, blur: 5, spread: 0, color: "#ff00ff", opacity: 100, inset: false },
            { x: 0, y: 0, blur: 20, spread: 0, color: "#ff00ff", opacity: 50, inset: false },
            { x: 0, y: 0, blur: 60, spread: 0, color: "#ff00ff", opacity: 30, inset: false }
        ]
    },
    {
        name: "Pressed (Inset)",
        layers: [
            { x: 3, y: 3, blur: 6, spread: 0, color: "#000000", opacity: 20, inset: true },
            { x: -1, y: -1, blur: 2, spread: 0, color: "#ffffff", opacity: 30, inset: true }
        ]
    },
    {
        name: "Rainbow",
        layers: [
            { x: 10, y: 0, blur: 0, spread: 0, color: "#ff0000", opacity: 100, inset: false },
            { x: 20, y: 0, blur: 0, spread: 0, color: "#ffa500", opacity: 100, inset: false },
            { x: 30, y: 0, blur: 0, spread: 0, color: "#ffff00", opacity: 100, inset: false },
            { x: 40, y: 0, blur: 0, spread: 0, color: "#008000", opacity: 100, inset: false }
        ]
    },
    {
        name: "Glass Edge",
        layers: [
            { x: 0, y: 0, blur: 0, spread: 1, color: "#ffffff", opacity: 20, inset: true },
            { x: 0, y: 20, blur: 50, spread: -20, color: "#000000", opacity: 30, inset: false }
        ]
    }
];

export default function BoxShadowGeneratorPage() {
    // --- State ---
    const [layers, setLayers] = useState<ShadowLayer[]>([
        { id: "1", x: 10, y: 10, blur: 20, spread: 0, color: "#000000", opacity: 15, inset: false, active: true }
    ]);
    const [selectedId, setSelectedId] = useState<string>("1");
    const [boxColor, setBoxColor] = useState("#ffffff");
    const [bgColor, setBgColor] = useState("#f3f4f6");

    // Copied State
    const [copied, setCopied] = useState(false);

    // --- Computed ---

    const selectedLayer = layers.find(l => l.id === selectedId) || layers[0];

    const generateCSS = (layersList: ShadowLayer[]) => {
        if (layersList.length === 0) return "none";
        return layersList
            .filter(l => l.active)
            .map(l => {
                const r = parseInt(l.color.slice(1, 3), 16);
                const g = parseInt(l.color.slice(3, 5), 16);
                const b = parseInt(l.color.slice(5, 7), 16);
                const rgba = `rgba(${r}, ${g}, ${b}, ${l.opacity / 100})`;
                return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba}`;
            })
            .join(", ");
    };

    const cssString = `box-shadow: ${generateCSS(layers)};`;

    // --- Actions ---

    const addLayer = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setLayers([...layers, { id: newId, x: 5, y: 5, blur: 10, spread: 0, color: "#000000", opacity: 20, inset: false, active: true }]);
        setSelectedId(newId);
    };

    const removeLayer = (id: string) => {
        const newLayers = layers.filter(l => l.id !== id);
        setLayers(newLayers);
        if (selectedId === id && newLayers.length > 0) {
            setSelectedId(newLayers[newLayers.length - 1].id);
        }
    };

    const updateLayer = (key: keyof ShadowLayer, value: any) => {
        setLayers(layers.map(l => l.id === selectedId ? { ...l, [key]: value } : l));
    };

    const applyPreset = (presetName: string) => {
        const preset = PRESETS.find(p => p.name === presetName);
        if (!preset) return;

        const newLayers = preset.layers.map(l => ({
            ...l,
            id: Math.random().toString(36).substr(2, 9),
            active: true
        }));
        setLayers(newLayers);
        setSelectedId(newLayers[0].id);

        // Auto-adjust BG for Neumorphism
        if (presetName === "Neumorphism") {
            setBoxColor("#e0e5ec");
            setBgColor("#e0e5ec");
        } else {
            setBoxColor("#ffffff");
            setBgColor("#f3f4f6");
        }
    };

    return (
        <div className="container px-6 py-12 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Square className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Box Shadow Generator</h1>
                        <p className="text-muted-foreground font-medium">Create complex, multi-layered CSS shadows.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select onValueChange={applyPreset}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Load Preset..." />
                        </SelectTrigger>
                        <SelectContent>
                            {PRESETS.map(p => (
                                <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Controls */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Layer Manager */}
                    <Card className="border shadow-sm">
                        <CardHeader className="pb-3 bg-muted/30">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Layers className="h-4 w-4" /> Layers
                                </CardTitle>
                                <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-white/50" onClick={addLayer}>
                                    <Plus className="h-3 w-3 mr-1" /> Add
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1 max-h-[250px] overflow-y-auto">
                            {layers.length === 0 && <p className="text-xs text-center text-muted-foreground py-4">No layers. Add one to start.</p>}
                            {layers.map((layer, index) => (
                                <div
                                    key={layer.id}
                                    onClick={() => setSelectedId(layer.id)}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm transition-all border ${selectedId === layer.id ? "bg-primary/10 border-primary/20 shadow-sm" : "hover:bg-muted border-transparent"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded shadow-sm border"
                                            style={{ backgroundColor: layer.color }}
                                        />
                                        <span className={`font-medium ${selectedId === layer.id ? "text-primary" : "text-muted-foreground"}`}>
                                            Layer {index + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 opacity-50 hover:opacity-100"
                                            onClick={(e) => { e.stopPropagation(); updateLayer("active", !layer.active); }} // Note: This needs to target the specific layer, loop above does that. But wait, updateLayer uses selectedId. 
                                            // FIX: Direct update
                                            title="Toggle Visibility"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${layer.active ? "bg-green-500" : "bg-gray-300"}`} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                            onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Sliders */}
                    {selectedLayer && (
                        <Card className="border shadow-sm">
                            <CardHeader className="pb-4 bg-muted/30">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Sliders className="h-4 w-4" /> Properties
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* XY Position */}
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <Label>Horizontal (X)</Label>
                                            <span className="font-mono text-muted-foreground">{selectedLayer.x}px</span>
                                        </div>
                                        <Slider
                                            value={[selectedLayer.x]}
                                            onValueChange={([v]) => updateLayer("x", v)}
                                            min={-100}
                                            max={100}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <Label>Vertical (Y)</Label>
                                            <span className="font-mono text-muted-foreground">{selectedLayer.y}px</span>
                                        </div>
                                        <Slider
                                            value={[selectedLayer.y]}
                                            onValueChange={([v]) => updateLayer("y", v)}
                                            min={-100}
                                            max={100}
                                        />
                                    </div>
                                </div>

                                {/* Blur & Spread */}
                                <div className="space-y-4 pt-2 border-t">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <Label>Blur Radius</Label>
                                            <span className="font-mono text-muted-foreground">{selectedLayer.blur}px</span>
                                        </div>
                                        <Slider
                                            value={[selectedLayer.blur]}
                                            onValueChange={([v]) => updateLayer("blur", v)}
                                            min={0}
                                            max={100}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <Label>Spread Radius</Label>
                                            <span className="font-mono text-muted-foreground">{selectedLayer.spread}px</span>
                                        </div>
                                        <Slider
                                            value={[selectedLayer.spread]}
                                            onValueChange={([v]) => updateLayer("spread", v)}
                                            min={-50}
                                            max={50}
                                        />
                                    </div>
                                </div>

                                {/* Color & Checkbox */}
                                <div className="space-y-4 pt-2 border-t">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <Label>Opacity</Label>
                                            <span className="font-mono text-muted-foreground">{selectedLayer.opacity}%</span>
                                        </div>
                                        <Slider
                                            value={[selectedLayer.opacity]}
                                            onValueChange={([v]) => updateLayer("opacity", v)}
                                            min={0}
                                            max={100}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Label className="text-xs mb-1.5 block">Shadow Color</Label>
                                            <ColorPicker
                                                value={selectedLayer.color}
                                                onChange={(c) => updateLayer("color", c)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-4">
                                            <input
                                                type="checkbox"
                                                id="inset"
                                                checked={selectedLayer.inset}
                                                onChange={(e) => updateLayer("inset", e.target.checked)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <Label htmlFor="inset" className="text-xs cursor-pointer">Inset</Label>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* RIGHT COLUMN: Preview */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Viewport */}
                    <Card className="flex-1 min-h-[400px] border-0 shadow-lg overflow-hidden flex flex-col">
                        <div className="p-2 bg-muted/10 border-b flex justify-between items-center px-4">
                            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Live Preview</span>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-[10px] text-muted-foreground">Box</Label>
                                    <MiniColorPicker value={boxColor} onChange={setBoxColor} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-[10px] text-muted-foreground">Bg</Label>
                                    <MiniColorPicker value={bgColor} onChange={setBgColor} />
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex-1 flex items-center justify-center p-8 transition-colors duration-300"
                            style={{ backgroundColor: bgColor }}
                        >
                            <div
                                className="w-48 h-48 md:w-64 md:h-64 rounded-3xl transition-all duration-200 flex items-center justify-center"
                                style={{
                                    backgroundColor: boxColor,
                                    boxShadow: generateCSS(layers)
                                }}
                            >
                                <span className="text-xs font-medium text-black/10 select-none">Element</span>
                            </div>
                        </div>
                    </Card>

                    {/* Output */}
                    <Card className="bg-slate-950 text-slate-200 border-slate-900 shadow-xl">
                        <CardHeader className="py-3 px-4 border-b border-white/10 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-mono text-slate-400">CSS Output</span>
                            </div>
                            <Button
                                size="sm"
                                variant={copied ? "secondary" : "ghost"}
                                className={`h-7 text-xs ${copied ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "hover:bg-white/10"}`}
                                onClick={() => {
                                    navigator.clipboard.writeText(cssString);
                                    setCopied(true);
                                    toast.success("CSS copied to clipboard!");
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                            >
                                {copied ? <Check className="h-3 w-3 mr-1.5" /> : <Copy className="h-3 w-3 mr-1.5" />}
                                {copied ? "Copied" : "Copy CSS"}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 font-mono text-sm overflow-x-auto">
                            <code className="text-blue-300">box-shadow</code>
                            <span className="text-slate-500">:</span>
                            <span className="text-emerald-300 ml-2">{generateCSS(layers)}</span>
                            <span className="text-slate-500">;</span>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
