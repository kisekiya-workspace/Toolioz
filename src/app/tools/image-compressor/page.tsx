"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Slider } from "@/components/sociials-ui/slider";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Upload, Download, CheckCircle, FileImage, ArrowRight, Settings2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

export default function ImageCompressorPage() {
    const [file, setFile] = useState<File | null>(null);
    const [compressedFile, setCompressedFile] = useState<File | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);

    // Settings
    const [targetSize, setTargetSize] = useState(500); // KB
    const [quality, setQuality] = useState(0.8);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith("image/")) {
                toast.error("Please upload a valid image file.");
                return;
            }
            setFile(selectedFile);
            setCompressedFile(null);
            // Auto-set target to 50% of original
            setTargetSize(Math.floor(selectedFile.size / 1024 * 0.5));
        }
    };

    const compressImage = async () => {
        if (!file) return;
        setIsCompressing(true);

        try {
            // Convert target KB to MB for library
            const maxSizeMB = targetSize / 1024;

            const options = {
                maxSizeMB: maxSizeMB,
                maxWidthOrHeight: maxWidth,
                useWebWorker: true,
                initialQuality: showAdvanced ? quality : 1.0, // If not advanced, start high and let maxSizeMB drive it
                alwaysKeepResolution: showAdvanced, // If advanced, respect width more strictly? Library handles this.
            };

            console.log("Compressing with options:", options);
            const compressedBlob = await imageCompression(file, options);
            setCompressedFile(compressedBlob as File);

            const savedBytes = file.size - compressedBlob.size;
            toast.success(`Done! Saved ${formatSize(savedBytes)}`, {
                description: `New size: ${formatSize(compressedBlob.size)}`
            });

        } catch (error) {
            console.error(error);
            toast.error("Compression failed. Please try another image.");
        } finally {
            setIsCompressing(false);
        }
    };

    const downloadImage = () => {
        if (!compressedFile) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(compressedFile);
        link.download = `compressed-${file?.name}`;
        link.click();
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const faq = [
        { q: "Is my image uploaded to a server?", a: "No. The compression happens entirely in your browser using modern web technologies. Your photos never leave your device." },
        { q: "Does this affect image quality?", a: "Compression always involves a trade-off. We use smart algorithms to remove invisible data first, but lower quality settings will result in some visual loss." },
        { q: "What formats are supported?", a: "We support JPG, PNG, and WebP. The output format will match the input format in most cases." },
        { q: "How much can I compress?", a: "Typical photos can be reduced by 60-90% without noticeable quality loss. Results vary based on image content." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Image Compressor",
        "operatingSystem": "All",
        "applicationCategory": "Multimedia",
        "description": "Reduce image file size by up to 90% without losing quality. Fast, private, browser-based compression.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="Image Compressor"
                description="Reduce image file size by up to 90% without losing quality. Fast, private, and runs entirely on your device."
            />

            <AdContainer slot="image-compressor-top" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                {/* Main Interface */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-2 shadow-lg">
                        <CardContent className="p-8 space-y-8">
                            {/* Upload Area */}
                            <div
                                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${file ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted'}`}
                                onClick={() => document.getElementById("fileInput")?.click()}
                            >
                                <input
                                    id="fileInput"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <div className="space-y-2">
                                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
                                            <CheckCircle size={24} />
                                        </div>
                                        <p className="font-medium text-lg">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                            <Upload size={32} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold italic">Click to upload or drag & drop</p>
                                            <p className="text-sm text-muted-foreground">JPG, PNG, WebP up to 50MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Settings */}
                            <div className="space-y-6 p-6 bg-muted/30 rounded-xl border">
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings2 size={20} className="text-primary" />
                                    <h3 className="font-semibold">Compression Settings</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Target File Size (Optional)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                value={targetSize}
                                                onChange={(e) => setTargetSize(Number(e.target.value))}
                                                className="w-20 h-8 text-right"
                                                min={10}
                                                max={5000}
                                            />
                                            <span className="text-sm font-medium">KB</span>
                                        </div>
                                    </div>
                                    <Slider
                                        value={[targetSize]}
                                        onValueChange={(vals) => setTargetSize(vals[0])}
                                        min={50} max={2000} step={50}
                                    />
                                    <p className="text-xs text-muted-foreground">We'll try to compress the image under this size.</p>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
                                        <Label className="cursor-pointer">Advanced Settings</Label>
                                        <span className="text-xs text-primary">{showAdvanced ? "Hide" : "Show"}</span>
                                    </div>

                                    {showAdvanced && (
                                        <div className="space-y-6 animate-in slide-in-from-top-2">
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <Label>Quality Level</Label>
                                                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{(quality * 100).toFixed(0)}%</span>
                                                </div>
                                                <Slider
                                                    value={[quality]}
                                                    onValueChange={(vals) => setQuality(vals[0])}
                                                    min={0.1} max={1} step={0.1}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <Label>Max Width</Label>
                                                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{maxWidth}px</span>
                                                </div>
                                                <Slider
                                                    value={[maxWidth]}
                                                    onValueChange={(vals) => setMaxWidth(vals[0])}
                                                    min={500} max={4000} step={100}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-14 text-lg font-bold"
                                onClick={compressImage}
                                disabled={!file || isCompressing}
                            >
                                {isCompressing ? "Compressing..." : "Compress Image"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 shadow-xl h-full flex flex-col">
                        <CardContent className="p-8 flex-1 flex flex-col justify-center space-y-6">
                            {!compressedFile ? (
                                <div className="text-center text-muted-foreground space-y-4 opacity-50">
                                    <FileImage size={64} className="mx-auto" />
                                    <p>Compressed result will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                    <div className="text-center space-y-2">
                                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-green-600 dark:text-green-500">Success!</h3>
                                        <p className="text-muted-foreground">Your image is ready.</p>
                                    </div>

                                    <div className="space-y-4 border-t pt-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Original</span>
                                            <span className="line-through">{formatSize(file!.size)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span>Compressed</span>
                                            <span className="text-green-600 dark:text-green-400">{formatSize(compressedFile.size)}</span>
                                        </div>
                                        <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded text-center text-green-700 dark:text-green-300 text-sm font-medium">
                                            Saved {formatSize(file!.size - compressedFile.size)}
                                            ({((1 - compressedFile.size / file!.size) * 100).toFixed(0)}%)
                                        </div>
                                    </div>

                                    <Button className="w-full h-12 gap-2" variant="outline" onClick={downloadImage}>
                                        <Download size={18} /> Download
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="How Image Compression Works">
                    <p>
                        Digital images contain a lot of data that the human eye cannot perceive.
                        Our tool uses intelligent lossy compression to selectively discard this redundant data.
                        By combining this with modern resizing algorithms, we can drastically reduce the file size while maintaining excellent visual quality.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="Why Compress Images?">
                    <ul className="list-disc pl-6 space-y-3 mt-4">
                        <li><strong>Faster Websites:</strong> Smaller images load faster, improving SEO and user experience.</li>
                        <li><strong>Save Storage:</strong> Free up space on your phone or hard drive.</li>
                        <li><strong>Easy Sharing:</strong> Send photos via email or WhatsApp without hitting file size limits.</li>
                    </ul>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="image-compressor-bottom" />
        </div>
    );
}
