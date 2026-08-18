"use client";

import { useState, useEffect, useRef } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { Switch } from "@/components/sociials-ui/switch";
import { Label } from "@/components/sociials-ui/label";
import { Copy, Check, Upload, Download, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function Base64ConverterPage() {
    const [mode, setMode] = useState<"text" | "file">("text");
    const [action, setAction] = useState<"encode" | "decode">("encode");

    // Text State
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");

    // File State
    const [fileInput, setFileInput] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");

    // Options
    const [urlSafe, setUrlSafe] = useState(false);
    const [liveMode, setLiveMode] = useState(true);
    const [copied, setCopied] = useState(false);

    // Live Conversion Effect
    useEffect(() => {
        if (liveMode && mode === "text") {
            handleTextConversion();
        }
    }, [inputText, action, urlSafe, liveMode, mode]);

    const handleTextConversion = () => {
        try {
            if (!inputText) {
                setOutputText("");
                return;
            }

            if (action === "encode") {
                let encoded = btoa(inputText);
                if (urlSafe) {
                    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                }
                setOutputText(encoded);
            } else {
                let toDecode = inputText;
                if (urlSafe) {
                    toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
                    // Pad with = if needed
                    while (toDecode.length % 4) {
                        toDecode += '=';
                    }
                }
                setOutputText(atob(toDecode));
            }
        } catch (e) {
            if (!liveMode) toast.error("Invalid input for conversion");
            // In live mode, suppress errors until explicit action or just leave old output
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            // result is usually "data:mime;base64,....."
            if (action === "encode") {
                setFileInput(result); // This IS the base64 string basically
                setOutputText(result);
            }
        };

        // If decoding, we expect the user to paste a Base64 string to download as file, 
        // OR upload a text file strictly containing base64? 
        // For "File" mode decode, usually it means "Paste Base64 -> Download File".
        // If "File" mode encode, it means "Upload File -> Copy Base64".

        if (action === "encode") {
            reader.readAsDataURL(file);
        } else {
            // Decode mode for files usually means "Input Base64 -> Get File"
            // But if uploading a file in decode mode, maybe they uploaded a .txt with base64?
            reader.readAsText(file);
            reader.onload = (evt) => {
                setFileInput(evt.target?.result as string);
                setOutputText(evt.target?.result as string); // Just showing content
            }
        }
    };

    const handleFileDecodeInput = (val: string) => {
        setFileInput(val);
        // Try to preview if it looks like an image
        // We don't necessarily "output" text for file decode, we assume the goal is download/preview
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadFile = () => {
        try {
            if (action === "encode") {
                // User wants to download the Base64 as a .txt file
                const blob = new Blob([outputText], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${fileName || "encoded"}.txt`;
                link.click();
            } else {
                // User wants to download the Base64 input as a binary file
                // We need to strip the data URI prefix if present
                let base64 = fileInput || "";
                if (base64.includes(",")) {
                    base64 = base64.split(",")[1];
                }

                // Decode
                const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/')); // Handle URL safe too
                const array = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    array[i] = binary.charCodeAt(i);
                }

                const blob = new Blob([array], { type: "application/octet-stream" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "decoded_file";
                link.click();
            }
        } catch (e) {
            toast.error("Failed to download. Invalid Base64 data.");
        }
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Base64 Converter"
                description="Advanced tool to encode/decode text and files to Base64. Supports standard and URL-safe formats."
            />

            <div className="max-w-4xl mx-auto mb-16 space-y-8">
                <Card className="border-2 shadow-lg">
                    <CardContent className="p-8 space-y-8">
                        {/* Controls */}
                        <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b">
                            <Tabs value={mode} onValueChange={(v) => { setMode(v as any); setInputText(""); setOutputText(""); setFileInput(null); }} className="w-full md:w-auto">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="text" className="gap-2"><FileText size={16} /> Text</TabsTrigger>
                                    <TabsTrigger value="file" className="gap-2"><ImageIcon size={16} /> File</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Tabs value={action} onValueChange={(v) => { setAction(v as any); setInputText(""); setOutputText(""); setFileInput(null); }} className="w-full md:w-auto">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="encode">Encode</TabsTrigger>
                                    <TabsTrigger value="decode">Decode</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Switch id="url-safe" checked={urlSafe} onCheckedChange={setUrlSafe} />
                                    <Label htmlFor="url-safe">URL Safe</Label>
                                </div>
                                {mode === "text" && (
                                    <div className="flex items-center space-x-2">
                                        <Switch id="live-mode" checked={liveMode} onCheckedChange={setLiveMode} />
                                        <Label htmlFor="live-mode">Live</Label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">Input {mode === "file" && action === "encode" ? "(Upload File)" : "(Paste Content)"}</Label>

                            {mode === "text" ? (
                                <Textarea
                                    placeholder={action === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
                                    className="min-h-[150px] text-lg font-mono resize-y"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                            ) : (
                                // File Mode
                                action === "encode" ? (
                                    <div className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition cursor-pointer relative">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileUpload}
                                        />
                                        <Upload className="h-10 w-10 mb-4 text-muted-foreground" />
                                        <p className="font-medium">Drop a file here or click to upload</p>
                                        {fileName && <p className="mt-2 text-primary font-bold">{fileName}</p>}
                                    </div>
                                ) : (
                                    <Textarea
                                        placeholder="Paste Base64 string here to download as file..."
                                        className="min-h-[150px] text-lg font-mono resize-y"
                                        value={fileInput || ""}
                                        onChange={(e) => handleFileDecodeInput(e.target.value)}
                                    />
                                )
                            )}
                        </div>

                        {/* Action Buttons (if non-live or file mode) */}
                        {(!liveMode && mode === "text") && (
                            <div className="flex justify-center">
                                <Button size="lg" onClick={handleTextConversion} className="w-full md:w-48 font-bold">
                                    {action === "encode" ? "Encode" : "Decode"}
                                </Button>
                            </div>
                        )}

                        {/* Output Area */}
                        <div className="space-y-4">
                            <Label className="text-lg font-semibold">Output</Label>

                            {mode === "text" ? (
                                <div className="relative">
                                    <Textarea
                                        readOnly
                                        value={outputText}
                                        className="min-h-[150px] text-lg font-mono bg-muted"
                                        placeholder="Result will appear here..."
                                    />
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-2 right-2"
                                        onClick={() => copyToClipboard(outputText)}
                                        disabled={!outputText}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </Button>
                                </div>
                            ) : (
                                // File Output
                                <div className="space-y-4">
                                    {action === "encode" ? (
                                        // Encode output: Show Base64 string, allow copy/download txt
                                        <div className="relative">
                                            <Textarea
                                                readOnly
                                                value={outputText} // Contains the data URL
                                                className="min-h-[150px] text-xs font-mono bg-muted break-all"
                                            />
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <Button size="icon" variant="secondary" onClick={() => copyToClipboard(outputText)}>
                                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                                </Button>
                                                <Button size="icon" variant="secondary" onClick={downloadFile}>
                                                    <Download size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Decode output: Show preview if image, allow download file
                                        <div className="border rounded-xl p-6 bg-muted/30 flex flex-col items-center gap-6">
                                            {fileInput?.startsWith("data:image") && (
                                                <img src={fileInput} alt="Preview" className="max-h-64 rounded-lg shadow-md" />
                                            )}
                                            <Button size="lg" onClick={downloadFile} disabled={!fileInput} className="gap-2">
                                                <Download size={18} /> Download Decoded File
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Features Guide">
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Live Mode:</strong> See results instantly as you type. Disable for large inputs to improve performance.</li>
                        <li><strong>URL Safe:</strong> Replaces <code>+</code> with <code>-</code> and <code>/</code> with <code>_</code> to make the string safe for use in URLs.</li>
                        <li><strong>File Mode:</strong> Convert images, PDFs, or any file to a Base64 string instantly. Or paste a Base64 string to recover the original file.</li>
                    </ul>
                </ToolContentSection>
            </div>
        </div>
    );
}
