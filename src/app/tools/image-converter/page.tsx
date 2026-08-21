"use client";

import { useState, useRef } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Button } from "@/components/sociials-ui/button";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Upload, Download, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

export default function ImageConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [format, setFormat] = useState("image/png");
    const [isConverting, setIsConverting] = useState(false);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setConvertedUrl(null);
        }
    };

    const convertImage = () => {
        if (!file || !canvasRef.current) return;
        setIsConverting(true);

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current!;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);

            const dataUrl = canvas.toDataURL(format);
            setConvertedUrl(dataUrl);
            setIsConverting(false);
        };
        img.src = preview!;
    };

    const downloadImage = () => {
        if (!convertedUrl) return;
        const link = document.createElement("a");
        link.href = convertedUrl;
        link.download = `converted-image.${format.split("/")[1]}`;
        link.click();
    };

    const faq = [
        { q: "Is it safe to upload my images?", a: "ABSOLUTELY. Your images never leave your computer. The conversion happens entirely in your browser using the Canvas API. No data is sent to any server." },
        { q: "What formats can I convert to?", a: "Currently, we support converting to PNG, JPEG, and WebP formats. More formats like AVIF are processed if your browser supports them." },
        { q: "Is there a limit on file size?", a: "Since it runs on your device, the limit depends on your browser's memory and performance. We recommend files under 20MB for the best experience." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Image Converter"
                description="Fast, private, and high-quality image conversion. Convert your photos to PNG, JPG, or WebP without uploading them to any server."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Upload & Controls */}
                <Card className="border-2 h-fit">
                    <CardContent className="p-8 space-y-6">
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
                                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                        <Upload size={32} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold italic">Click to upload or drag & drop</p>
                                        <p className="text-sm text-muted-foreground">Supports PNG, JPG, WebP, SVG, AVIF</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Target Format</label>
                                <Select value={format} onValueChange={setFormat}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select Format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="image/png">PNG (.png)</SelectItem>
                                        <SelectItem value="image/jpeg">JPEG (.jpg)</SelectItem>
                                        <SelectItem value="image/webp">WebP (.webp)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col justify-end">
                                <Button
                                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                                    disabled={!file || isConverting}
                                    onClick={convertImage}
                                >
                                    {isConverting ? "Converting..." : "Convert Now"}
                                </Button>
                            </div>
                        </div>

                        {convertedUrl && (
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                    <CheckCircle size={18} />
                                    <span className="font-medium">Conversion Successful!</span>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2 border-green-200 hover:bg-green-100" onClick={downloadImage}>
                                    <Download size={16} />
                                    Download
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Preview Panel */}
                <div className="space-y-6">
                    <div className="bg-muted/30 rounded-2xl border aspect-video flex items-center justify-center overflow-hidden relative group">
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105" />
                        ) : (
                            <div className="text-center text-muted-foreground space-y-2">
                                <ImageIcon size={48} className="mx-auto opacity-20" />
                                <p className="italic">Image preview will appear here</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl flex gap-3 text-blue-800 dark:text-blue-300">
                        <AlertCircle className="shrink-0" size={20} />
                        <p className="text-sm leading-relaxed">
                            <strong>Pro Tip:</strong> Converting to WebP can reduce file size by up to 80% without losing quality, making it perfect for website performance.
                        </p>
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* SEO CONTENT SECTION */}
            <div className="max-w-4xl mx-auto space-y-4">
                <ToolContentSection title="How to convert images for free">
                    <p>
                        Our online image converter provides a professional-grade experience without the need for expensive software like Photoshop.
                        Follow these simple steps:
                    </p>
                    <ol className="list-decimal pl-6 space-y-3 mt-4">
                        <li><strong>Upload:</strong> Click the upload box or drag your image file directly onto the page.</li>
                        <li><strong>Select Format:</strong> Choose your desired output format (PNG, JPG, or WebP) from the dropdown menu.</li>
                        <li><strong>Convert:</strong> Hit the "Convert Now" button. The processing happens in milliseconds locally on your device.</li>
                        <li><strong>Download:</strong> Once finished, click the download button to save your new file.</li>
                    </ol>
                </ToolContentSection>

                <ToolContentSection title="Privacy-First Image Processing: Why it matters">
                    <p>
                        Most online converters require you to upload your files to their cloud servers. This poses significant risks:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4 mb-4">
                        <li>Your personal photos could be stored indefinitely.</li>
                        <li>Unencrypted uploads can be intercepted.</li>
                        <li>Large files take a long time to upload on slow connections.</li>
                    </ul>
                    <p>
                        <strong>ToolBox is different.</strong> We use the WebAssembly and Canvas APIs to process images 100% locally.
                        This means the data never leaves your device's memory. The conversion speed is limited only by your own processor, making it instant for most files.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="Image Formats Explained">
                    <h4 className="font-bold mt-4">JPEG (Joint Photographic Experts Group)</h4>
                    <p>
                        Best for photographs and realistic images with smooth variations of tone and color. It uses lossy compression, which means it sacrifices some quality for smaller file sizes.
                    </p>

                    <h4 className="font-bold mt-4">PNG (Portable Network Graphics)</h4>
                    <p>
                        Ideal for images that require transparency or text sharpness (like screenshots and logos). It uses lossless compression, preserving every pixel perfectly, but file sizes are generally larger.
                    </p>

                    <h4 className="font-bold mt-4">WebP (Modern Web Format)</h4>
                    <p>
                        Developed by Google, WebP provides superior lossless and lossy compression for images on the web.
                        WebP lossless images are 26% smaller in size compared to PNGs. WebP lossy images are 25-34% smaller than comparable JPEG images.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
