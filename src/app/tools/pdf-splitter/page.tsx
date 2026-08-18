"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function PDFSplitterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [range, setRange] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected && selected.type === "application/pdf") {
            setFile(selected);
            // Get page count
            try {
                const buffer = await selected.arrayBuffer();
                const doc = await PDFDocument.load(buffer);
                setPageCount(doc.getPageCount());
                setRange(`1-${doc.getPageCount()}`);
            } catch (e) {
                toast.error("Failed to load PDF info.");
            }
        }
    };

    const splitPDF = async () => {
        if (!file || !range) return;
        setIsProcessing(true);

        try {
            const buffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(buffer);
            const newDoc = await PDFDocument.create();

            // Parse range "1, 3-5, 7" -> [0, 2, 3, 4, 6] (0-indexed)
            const pagesToExtract = new Set<number>();
            const parts = range.split(",");

            for (const part of parts) {
                const [start, end] = part.trim().split("-").map(Number);
                if (!isNaN(start)) {
                    if (!isNaN(end)) {
                        for (let i = start; i <= end; i++) {
                            if (i > 0 && i <= pageCount) pagesToExtract.add(i - 1);
                        }
                    } else {
                        if (start > 0 && start <= pageCount) pagesToExtract.add(start - 1);
                    }
                }
            }

            const indices = Array.from(pagesToExtract).sort((a, b) => a - b);

            if (indices.length === 0) {
                toast.error("Invalid page range.");
                setIsProcessing(false);
                return;
            }

            const copiedPages = await newDoc.copyPages(srcDoc, indices);
            copiedPages.forEach((page) => newDoc.addPage(page));

            const pdfBytes = await newDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `split-${file.name}`;
            link.click();

            toast.success("PDF Split Successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to split PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container px-6 py-12">
            <ToolHeader
                title="PDF Splitter"
                description="Extract specific pages from a PDF file. Use ranges or single page numbers."
            />

            <div className="max-w-4xl mx-auto mb-16 space-y-8">
                <Card className="border-2 shadow-lg">
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
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-xl font-bold">Upload PDF to Split</h3>
                                <p className="text-muted-foreground mt-2">Max file size 100MB</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border">
                                    <FileText className="h-8 w-8 text-primary" />
                                    <div className="flex-1">
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">{pageCount} Pages • {(file.size / 1024).toFixed(0)} KB</p>
                                    </div>
                                    <Button variant="ghost" onClick={() => setFile(null)}>Change</Button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-lg font-semibold">Select Pages</label>
                                    <Input
                                        value={range}
                                        onChange={(e) => setRange(e.target.value)}
                                        placeholder="e.g. 1-5, 8, 11-13"
                                        className="h-12 text-lg"
                                    />
                                    <p className="text-sm text-muted-foreground">Enter page numbers and/or ranges separated by commas.</p>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full h-14 text-lg font-bold"
                                    onClick={splitPDF}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Processing..." : "Extract Pages"}
                                    {!isProcessing && <Download className="ml-2" size={20} />}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
