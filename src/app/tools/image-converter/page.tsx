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
        { q: "Does conversion upload the image?", a: "No. The canvas in the browser converts the image. The file is not sent to a server." },
        { q: "Which formats can be produced?", a: "The menu is PNG, JPEG, and WebP. toDataURL is called with no quality argument, so JPEG and WebP use the browser default, usually 0.92." },
        { q: "Is there a file-size limit?", a: "The page does not set a byte limit. The canvas uses the decoded image width and height, so the limit is the memory available to the tab." },
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Image Converter"
                description="Converts photos to PNG, JPG, or WebP in the browser, without uploading the file."
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
                                        <p className="text-lg font-semibold italic">Choose an image file</p>
                                        <p className="text-sm text-muted-foreground">Input is any image the browser can decode. Output is PNG, JPEG, or WebP.</p>
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
                <ToolContentSection title="How the conversion runs">
                    <p>
                        The page draws the image onto a canvas at the decoded pixel width and height, then calls canvas.toDataURL with the selected type and no quality argument.
                    </p>
                    <ol className="list-decimal pl-6 space-y-3 mt-4">
                        <li><strong>File:</strong> The file input accepts an image and keeps it in the page.</li>
                        <li><strong>Format:</strong> The menu is PNG, JPEG, or WebP.</li>
                        <li><strong>Convert:</strong> The canvas is painted and encoded in the browser. The page does not time that step.</li>
                        <li><strong>Download:</strong> The download name is converted-image plus the chosen extension.</li>
                    </ol>
                </ToolContentSection>

                <ToolContentSection title="Where the conversion runs">
                    <p>
                        The image is drawn to a canvas in the browser and saved in the chosen format. The file is not uploaded. The page still loads site assets. Speed depends on the image size and the device.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="What each format does here">
                    <h4 className="font-bold mt-4">JPEG</h4>
                    <p>
                        canvas.toDataURL(&apos;image/jpeg&apos;) is called with no quality argument. The browser default is usually 0.92. The page does not compare the result with the original file.
                    </p>

                    <h4 className="font-bold mt-4">PNG</h4>
                    <p>
                        canvas.toDataURL(&apos;image/png&apos;) is lossless for the pixels drawn on the canvas. A color profile and EXIF are not copied.
                    </p>

                    <h4 className="font-bold mt-4">WebP</h4>
                    <p>
                        canvas.toDataURL(&apos;image/webp&apos;) is called with no quality argument. The page does not measure a percentage smaller than PNG or JPEG.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
