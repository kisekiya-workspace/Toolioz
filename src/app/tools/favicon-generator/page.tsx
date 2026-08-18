"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Button } from "@/components/sociials-ui/button";
import { Label } from "@/components/sociials-ui/label";
import { ColorPicker } from "@/components/sociials-ui/color-picker";
import { Smile, Download } from "lucide-react";

export default function FaviconGeneratorPage() {
    const [emoji, setEmoji] = useState("🚀");
    const [text, setText] = useState("");
    const [bgColor, setBgColor] = useState("#6366f1");
    const [textColor, setTextColor] = useState("#ffffff");
    const [mode, setMode] = useState<"emoji" | "text">("emoji");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const sizes = [16, 32, 48, 64, 128, 256];

    useEffect(() => {
        drawFavicon();
    }, [emoji, text, bgColor, textColor, mode]);

    const drawFavicon = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = 256;
        canvas.width = size;
        canvas.height = size;

        // Background
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, size * 0.15);
        ctx.fill();

        // Content
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (mode === "emoji") {
            ctx.font = `${size * 0.6}px sans-serif`;
            ctx.fillText(emoji, size / 2, size / 2 + size * 0.05);
        } else {
            ctx.fillStyle = textColor;
            const displayText = text.slice(0, 2).toUpperCase() || "AB";
            ctx.font = `bold ${size * 0.45}px sans-serif`;
            ctx.fillText(displayText, size / 2, size / 2 + size * 0.05);
        }
    };

    const downloadFavicon = (downloadSize: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create temporary canvas for resizing
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = downloadSize;
        tempCanvas.height = downloadSize;
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) return;

        tempCtx.drawImage(canvas, 0, 0, downloadSize, downloadSize);

        const link = document.createElement("a");
        link.download = `favicon-${downloadSize}x${downloadSize}.png`;
        link.href = tempCanvas.toDataURL("image/png");
        link.click();
    };

    const downloadICO = () => {
        // For simplicity, download 32x32 PNG (browsers support PNG favicons)
        downloadFavicon(32);
    };

    return (
        <div className="container px-6 py-12 max-w-4xl mx-auto">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                        <Smile className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Favicon Generator</h1>
                        <p className="text-muted-foreground">Create favicons from emoji or text</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Mode Toggle */}
                            <div className="flex gap-2">
                                <Button
                                    variant={mode === "emoji" ? "default" : "outline"}
                                    onClick={() => setMode("emoji")}
                                    className="flex-1"
                                >
                                    Emoji
                                </Button>
                                <Button
                                    variant={mode === "text" ? "default" : "outline"}
                                    onClick={() => setMode("text")}
                                    className="flex-1"
                                >
                                    Text
                                </Button>
                            </div>

                            {mode === "emoji" ? (
                                <div className="space-y-2">
                                    <Label>Emoji</Label>
                                    <Input
                                        value={emoji}
                                        onChange={(e) => setEmoji(e.target.value)}
                                        placeholder="Enter an emoji"
                                        className="text-3xl text-center h-16"
                                    />
                                    <p className="text-xs text-muted-foreground">Tip: Use Win + . or Cmd + Ctrl + Space to open emoji picker</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label>Text (1-2 characters)</Label>
                                    <Input
                                        value={text}
                                        onChange={(e) => setText(e.target.value.slice(0, 2))}
                                        placeholder="AB"
                                        maxLength={2}
                                        className="text-3xl text-center h-16 font-bold uppercase"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Background Color</Label>
                                <div className="flex gap-2">
                                    <ColorPicker
                                        value={bgColor}
                                        onChange={setBgColor}
                                    />
                                </div>
                            </div>

                            {mode === "text" && (
                                <div className="space-y-2">
                                    <Label>Text Color</Label>
                                    <div className="flex gap-2">
                                        <ColorPicker
                                            value={textColor}
                                            onChange={setTextColor}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Preview & Download */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center p-8">
                                <canvas
                                    ref={canvasRef}
                                    className="w-40 h-40 rounded-2xl shadow-lg"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Download</CardTitle>
                                <CardDescription>Choose a size to download</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-3">
                                    {sizes.map((size) => (
                                        <Button
                                            key={size}
                                            variant="outline"
                                            onClick={() => downloadFavicon(size)}
                                            className="flex-col h-auto py-3"
                                        >
                                            <Download className="h-4 w-4 mb-1" />
                                            <span className="text-xs">{size}x{size}</span>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
