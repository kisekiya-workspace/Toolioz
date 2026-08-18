"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { Copy, Check, ArrowDownUp } from "lucide-react";
import { toast } from "sonner";

export default function UrlConverterPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const encode = () => {
        try {
            setOutput(encodeURIComponent(input));
        } catch (e) {
            toast.error("Invalid input.");
        }
    };

    const decode = () => {
        try {
            setOutput(decodeURIComponent(input));
        } catch (e) {
            toast.error("Invalid URL encoded string.");
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        toast.success("Copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="URL Encoder / Decoder"
                description="Encodes or Decodes a string so that it conforms to the URL Specification."
            />

            <div className="max-w-4xl mx-auto mb-16 space-y-8">
                <Tabs defaultValue="encode" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-14 rounded-xl p-1 mb-8">
                        <TabsTrigger value="encode" className="h-full rounded-lg text-lg">Encoder</TabsTrigger>
                        <TabsTrigger value="decode" className="h-full rounded-lg text-lg">Decoder</TabsTrigger>
                    </TabsList>

                    <TabsContent value="encode">
                        <Card className="border-2 shadow-lg">
                            <CardContent className="p-8 space-y-6">
                                <Textarea
                                    placeholder="Enter text to encode (e.g. Hello World!)"
                                    className="min-h-[150px] text-lg font-mono"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <div className="flex justify-center">
                                    <Button size="lg" onClick={encode} className="w-48 font-bold gap-2">
                                        <ArrowDownUp size={18} /> Encode
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        readOnly
                                        value={output}
                                        className="min-h-[150px] text-lg font-mono bg-muted"
                                        placeholder="Output (e.g. Hello%20World%21)..."
                                    />
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-2 right-2"
                                        onClick={copy}
                                        disabled={!output}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="decode">
                        <Card className="border-2 shadow-lg">
                            <CardContent className="p-8 space-y-6">
                                <Textarea
                                    placeholder="Enter URL string to decode..."
                                    className="min-h-[150px] text-lg font-mono"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <div className="flex justify-center">
                                    <Button size="lg" onClick={decode} className="w-48 font-bold gap-2">
                                        <ArrowDownUp size={18} /> Decode
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Textarea
                                        readOnly
                                        value={output}
                                        className="min-h-[150px] text-lg font-mono bg-muted"
                                        placeholder="Decoded text..."
                                    />
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute top-2 right-2"
                                        onClick={copy}
                                        disabled={!output}
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Why encode URLs?">
                    <p>
                        URLs can only be sent over the Internet using the ASCII character-set. Since URLs often contain characters outside the ASCII set,
                        the URL has to be converted into a valid ASCII format. URL encoding replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits.
                    </p>
                </ToolContentSection>
            </div>
        </div>
    );
}
