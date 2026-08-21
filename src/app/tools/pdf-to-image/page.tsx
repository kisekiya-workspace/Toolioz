"use client";

import { useState, useRef, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { toast } from "sonner";

export default function PDFToImagePage() {
    const [file, setFile] = useState<File | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isConverting, setIsConverting] = useState(false);

    // Safely getting window for TS
    const isBrowser = typeof window !== "undefined";

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("pdfjs-dist").then((pdfjsLib) => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
            });
        }
    }, []);

    const convert = async () => {
        if (!file || !isBrowser) return;
        setIsConverting(true);
        setPreviews([]);

        try {
            const pdfjsLib = await import("pdfjs-dist");
            const buffer = await file.arrayBuffer();
            const doc = await pdfjsLib.getDocument(buffer).promise;
            const totalPages = doc.numPages;

            const newPreviews: string[] = [];

            for (let i = 1; i <= totalPages; i++) {
                const page = await doc.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport: viewport } as any).promise;
                    newPreviews.push(canvas.toDataURL("image/png"));
                }
            }

            setPreviews(newPreviews);
            toast.success(`Converted ${totalPages} pages to images!`);
        } catch (e) {
            console.error(e);
            toast.error("Failed to convert PDF.");
        } finally {
            setIsConverting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected && selected.type === "application/pdf") {
            setFile(selected);
            setPreviews([]);
        }
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="PDF to Image Converter"
                description="Convert each page of your PDF into high-quality PNG images."
            />

            <div className="max-w-6xl mx-auto mb-16 space-y-8">
                <Card className="border-2">
                    <CardContent className="p-8 space-y-8">
                        {!file ? (
                            <div
                                className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => document.getElementById("pdfInput")?.click()}
                            >
                                <input
                                    id="pdfInput"
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary mb-4">
                                    <ImageIcon size={32} />
                                </div>
                                <h3 className="text-xl font-bold">Upload PDF</h3>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{file.name}</h3>
                                    <Button variant="outline" onClick={() => setFile(null)}>Change File</Button>
                                </div>

                                {previews.length === 0 && (
                                    <Button size="lg" className="w-full h-14 font-bold" onClick={convert} disabled={isConverting}>
                                        {isConverting ? "Converting..." : "Convert to Images"}
                                    </Button>
                                )}
                            </div>
                        )}

                        {previews.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t">
                                {previews.map((src, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="border rounded-lg overflow-hidden bg-muted/20 p-2">
                                            <img src={src} alt={`Page ${i + 1}`} className="w-full object-contain" />
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-sm font-medium text-muted-foreground">Page {i + 1}</span>
                                            <a href={src} download={`page-${i + 1}.png`}>
                                                <Button size="sm" variant="ghost"><Download size={14} className="mr-1" /> Save</Button>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
