"use client";

import { useState, useRef, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Upload, Download, RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function ImageResizerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [maintainAspect, setMaintainAspect] = useState(true);
    const [originalAspect, setOriginalAspect] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setPreview(url);

            const img = new Image();
            img.onload = () => {
                setWidth(img.width);
                setHeight(img.height);
                setOriginalAspect(img.width / img.height);
            };
            img.src = url;
        }
    };

    const handleWidthChange = (val: number) => {
        setWidth(val);
        if (maintainAspect && originalAspect) {
            setHeight(Math.round(val / originalAspect));
        }
    };

    const handleHeightChange = (val: number) => {
        setHeight(val);
        if (maintainAspect && originalAspect) {
            setWidth(Math.round(val * originalAspect));
        }
    };

    const download = () => {
        if (!preview || !canvasRef.current) return;

        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const link = document.createElement("a");
                link.download = `resized-${file?.name}`;
                link.href = canvas.toDataURL("image/png");
                link.click();
                toast.success("Image downloaded!");
            }
        };
        img.src = preview;
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Image Resizer"
                description="Resize images to specific dimensions instantly in your browser."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Upload & Controls */}
                <div className="space-y-8">
                    <Card className="border-2 shadow-lg">
                        <CardContent className="p-8 space-y-8">
                            <div
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${file ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted'}`}
                                onClick={() => document.getElementById("resizeInput")?.click()}
                            >
                                <input
                                    id="resizeInput"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <div className="space-y-2">
                                        <p className="font-medium text-lg">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                            <Upload size={32} />
                                        </div>
                                        <p className="font-semibold">Click to upload image</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Width (px)</Label>
                                    <Input type="number" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Height (px)</Label>
                                    <Input type="number" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="aspect"
                                    checked={maintainAspect}
                                    onChange={(e) => setMaintainAspect(e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="aspect">Maintain Aspect Ratio</Label>
                            </div>

                            <Button size="lg" className="w-full font-bold h-12" onClick={download} disabled={!file}>
                                <Download className="mr-2" /> Resize & Download
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="flex items-center justify-center bg-muted/30 border-2 border-dashed rounded-3xl min-h-[400px] p-8 overflow-hidden">
                    {preview ? (
                        <img src={preview} alt="Preview" className="max-w-full max-h-[400px] object-contain shadow-xl rounded-lg" />
                    ) : (
                        <div className="text-muted-foreground text-center opacity-50">
                            <ImageIcon size={64} className="mx-auto mb-4" />
                            <p>Image preview will appear here</p>
                        </div>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
        </div>
    );
}
