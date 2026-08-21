"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, FileText, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "sonner";

export default function PDFMergerPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(f => f.type === "application/pdf");
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

    const mergePDFs = async () => {
        if (files.length < 2) {
            toast.error("Please select at least 2 PDF files.");
            return;
        }
        setIsProcessing(true);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const fileBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(fileBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes as BlobPart], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `merged-document-${Date.now()}.pdf`;
            link.click();

            toast.success("PDFs Merged Successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to merge PDFs. One of the files might be corrupted.");
        } finally {
            setIsProcessing(false);
        }
    };

    const faq = [
        { q: "Is my data secure?", a: "Yes! All processing happens in your browser. Your files are never uploaded to any server." },
        { q: "Can I merge encrypted PDFs?", a: "You must remove the password from protected PDFs before merging them with this tool." },
        { q: "Is there a file size limit?", a: "There's no strict limit, but very large files (100MB+) may slow down your browser." },
        { q: "Will the quality be affected?", a: "No. We copy pages directly without re-encoding, preserving original quality." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PDF Merger",
        "operatingSystem": "All",
        "applicationCategory": "Utility",
        "description": "Combine multiple PDF files into a single document. Free, private, and runs entirely in your browser.",
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
                title="PDF Merger"
                description="Combine multiple PDF files into a single document. Reorder files via drag-and-drop logic."
            />

            <AdContainer slot="pdf-merger-top" />

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
                                accept="application/pdf"
                                onChange={handleFileChange}
                            />
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-xl font-bold">Upload PDFs</h3>
                            <p className="text-muted-foreground mt-2">Click to select files</p>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex justify-between items-center">
                                    <span>Files ({files.length})</span>
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
                            onClick={mergePDFs}
                            disabled={files.length < 2 || isProcessing}
                        >
                            {isProcessing ? "Merging..." : "Merge PDFs"}
                            {!isProcessing && <Download className="ml-2" size={20} />}
                        </Button>
                    </CardContent>
                </Card>

                <ToolContentSection title="How to Merge PDFs">
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>Upload two or more PDF files via the upload box.</li>
                        <li>Reorder the files using the up/down arrows if needed.</li>
                        <li>Click "Merge PDFs" to process and download the combined file.</li>
                    </ol>
                </ToolContentSection>
                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="pdf-merger-bottom" />
        </div>
    );
}
