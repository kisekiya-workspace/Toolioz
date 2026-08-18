"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Upload } from "lucide-react";

export default function OpenGraphPreviewPage() {
    const [title, setTitle] = useState("Amazing Tool for Developers");
    const [description, setDescription] = useState("Boost your productivity with our collection of free online developer tools. Converters, formatters, and generators all in one place.");
    const [url, setUrl] = useState("https://toolioz.com");
    const [image, setImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-6xl">
            <ToolHeader
                title="Open Graph Preview"
                description="See how your website link looks when shared on social media."
            />

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Inputs */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-lg ring-1 ring-border/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Og Title</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Og Description</Label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none" />
                            </div>
                            <div className="space-y-2">
                                <Label>Og Url</Label>
                                <Input value={url} onChange={(e) => setUrl(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Og Image</Label>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="w-full" onClick={() => document.getElementById('ogImageInput')?.click()}>
                                        <Upload className="w-4 h-4 mr-2" /> Upload Image
                                    </Button>
                                    <input id="ogImageInput" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Previews */}
                <div className="space-y-8">
                    {/* Facebook / LinkedIn Style */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Facebook / LinkedIn Preview</Label>
                        <div className="bg-[#f0f2f5] p-4 rounded-lg">
                            <div className="bg-white border border-[#dadde1] rounded-lg overflow-hidden max-w-[500px]">
                                <div className="aspect-[1.91/1] bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                    {image ? (
                                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-400 font-medium text-lg">1200 x 630</div>
                                    )}
                                </div>
                                <div className="p-3 bg-[#f2f3f5] border-t border-[#dadde1]">
                                    <div className="uppercase text-[12px] text-[#606770] truncate">{new URL(url).hostname}</div>
                                    <div className="font-bold text-[#1d2129] text-[16px] leading-5 mt-1 mb-1 line-clamp-1">{title}</div>
                                    <div className="text-[14px] text-[#606770] line-clamp-1">{description}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Twitter/X Large Card */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">X (Twitter) Large Card Preview</Label>
                        <div className="bg-black p-6 rounded-lg">
                            <div className="border border-[#333639] rounded-xl overflow-hidden max-w-[500px] bg-black text-white">
                                <div className="aspect-[2/1] bg-[#16181c] relative overflow-hidden flex items-center justify-center">
                                    {image ? (
                                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-[#71767b] font-medium text-lg">Image Preview</div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="text-[#71767b] text-[15px]">{new URL(url).hostname}</div>
                                    <div className="text-[15px] text-[#e7e9ea] leading-5 truncate">{title}</div>
                                    <div className="text-[15px] text-[#71767b] leading-5 line-clamp-1">{description}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
