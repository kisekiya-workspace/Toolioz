"use client";

import { useState, useRef, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Download, ScanBarcode } from "lucide-react";
import JsBarcode from "jsbarcode";

export default function BarcodeGeneratorPage() {
    const [value, setValue] = useState("1234567890");
    const [format, setFormat] = useState("CODE128");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            try {
                JsBarcode(canvasRef.current, value, {
                    format: format,
                    lineColor: "#000",
                    width: 2,
                    height: 100,
                    displayValue: true
                });
            } catch (e) {
                // Invalid input for format
            }
        }
    }, [value, format]);

    const download = () => {
        if (canvasRef.current) {
            const link = document.createElement("a");
            link.download = `barcode-${value}.png`;
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Barcode Generator"
                description="Generate standard barcodes for products, inventory, and logicstics."
            />

            <div className="max-w-4xl mx-auto mb-16 space-y-8">
                <Card className="border-2 shadow-lg">
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium">Value</label>
                                <Input value={value} onChange={(e) => setValue(e.target.value)} className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Format</label>
                                <Select value={format} onValueChange={setFormat}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CODE128">CODE128 (Default)</SelectItem>
                                        <SelectItem value="EAN13">EAN-13</SelectItem>
                                        <SelectItem value="UPC">UPC</SelectItem>
                                        <SelectItem value="CODE39">CODE39</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-center p-8 bg-white rounded-xl border-2">
                            <canvas ref={canvasRef} className="max-w-full" />
                        </div>

                        <div className="flex justify-center">
                            <Button size="lg" className="h-12 w-48 font-bold" onClick={download}>
                                <Download className="mr-2" /> Download
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="About Barcodes">
                    <p>
                        We support the most common barcode formats used in retail and industry:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>CODE128:</strong> High-density, alphanumeric (Best for general use).</li>
                        <li><strong>EAN-13:</strong> Standard European retail barcode.</li>
                        <li><strong>UPC:</strong> Standard North American retail barcode.</li>
                        <li><strong>CODE39:</strong> Older alphanumeric standard.</li>
                    </ul>
                </ToolContentSection>
            </div>
        </div>
    );
}
