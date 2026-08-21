"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Upload, FileText, Download, Trash2, MoveUp, MoveDown } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export default function ImageToPdfPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= files.length) return;
        const newFiles = [...files];
        const temp = newFiles[index];
        newFiles[index] = newFiles[index + direction];
        newFiles[index + direction] = temp;
        setFiles(newFiles);
    };

    const generatePDF = async () => {
        if (files.length === 0) return;
        setIsGenerating(true);

        try {
            const doc = new jsPDF();
            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (i > 0) doc.addPage();

                const imgData = await readFileAsDataURL(file);
                const imgProps = await getImageProperties(imgData);

                // Calculate aspect ratio to fit page
                const ratio = Math.min(width / imgProps.width, height / imgProps.height);
                const imgWidth = imgProps.width * ratio;
                const imgHeight = imgProps.height * ratio;

                // Center image
                const x = (width - imgWidth) / 2;
                const y = (height - imgHeight) / 2;

                doc.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
                doc.text(`Page ${i + 1}`, width / 2, height - 10, { align: "center" });
            }

            doc.save("converted-images.pdf");
            toast.success("PDF Generated Successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const getImageProperties = (src: string): Promise<{ width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = src;
        });
    };

    const faq = [
        { q: "Is my data private?", a: "Yes. The PDF generation happens entirely in your browser using JavaScript. No files are uploaded to any server." },
        { q: "What is the page limit?", a: "There is no hard limit, but generating PDFs with hundreds of high-res images might slow down your browser." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Image to PDF Converter"
                description="Combine multiple images (JPG, PNG) into a single, high-quality PDF document instantly."
            />

            <div className="max-w-4xl mx-auto mb-16 space-y-8">
                <Card className="border-2">
                    <CardContent className="p-8 space-y-6">
                        <div
                            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => document.getElementById("pdfInput")?.click()}
                        >
                            <input
                                id="pdfInput"
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-bold">Upload Images</h3>
                            <p className="text-muted-foreground mt-2">Drag & drop or click to browse</p>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex justify-between items-center">
                                    <span>files ({files.length})</span>
                                    <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        Clear All
                                    </Button>
                                </h4>
                                <div className="grid gap-3">
                                    {files.map((file, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-muted rounded-lg border group">
                                            <span className="w-8 h-8 flex items-center justify-center bg-background rounded-full font-mono text-sm border shrink-0">
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveFile(i, -1)} disabled={i === 0}>
                                                    <MoveUp size={14} />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => moveFile(i, 1)} disabled={i === files.length - 1}>
                                                    <MoveDown size={14} />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFile(i)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            size="lg"
                            className="w-full h-14 text-lg font-bold"
                            onClick={generatePDF}
                            disabled={files.length === 0 || isGenerating}
                        >
                            {isGenerating ? "Generating PDF..." : "Convert to PDF"}
                            {!isGenerating && <Download className="ml-2" size={20} />}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Organize Your Documents">
                    <p>
                        Scanned documents as separate JPEGs can be a nightmare to manage.
                        Our tool allows you to merge receipts, invoices, or textbook pages into a single, professional PDF file that is easy to share and archive.
                    </p>
                </ToolContentSection>
                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
