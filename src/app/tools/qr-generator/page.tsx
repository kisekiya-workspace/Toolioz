"use client";

import { useState, useRef } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Slider } from "@/components/sociials-ui/slider";
import { Label } from "@/components/sociials-ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { Switch } from "@/components/sociials-ui/switch";
import { ColorPicker } from "@/components/sociials-ui/color-picker";
import { Download, Upload, X, Image as ImageIcon } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function QrCodePage() {
    const [value, setValue] = useState("https://toolioz.com/tools");
    const [size, setSize] = useState([256]);
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");

    // Image Settings
    const [imageSrc, setImageSrc] = useState<string>("");
    const [imageSize, setImageSize] = useState([0.2]); // Percentage of QR size
    const [excavate, setExcavate] = useState(true);

    const qrRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadQr = () => {
        const container = qrRef.current;
        if (!container) return;

        const canvas = container.querySelector('canvas');
        if (!canvas) return;

        // Create a new canvas to add a white background if needed (since transparent backgrounds might show up as black in some viewers)
        // or just download properly.
        // For standard PNG download, toDataURL is usually sufficient.
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngFile;
        downloadLink.download = "qrcode.png";
        downloadLink.click();
    };

    const faq = [
        { q: "Do these QR codes expire?", a: "No. The QR codes generated here are static, meaning they encode the data directly. They will work forever." },
        { q: "Can I use them for commercial purposes?", a: "Yes, you are free to use these QR codes on business cards, flyers, websites, or anywhere else." },
        { q: "Is my data tracked?", a: "No. Unlike dynamic QR code services, we do not act as a middleman. Your users go directly to the URL you provide." },
        { q: "What is 'Excavate' in image settings?", a: "Excavate removes the QR blocks behind your logo to make it more readable. If disabled, the logo sits on top of the blocks." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "QR Code Generator with Logo",
        "operatingSystem": "All",
        "applicationCategory": "Utility",
        "description": "Create customizable QR codes with your own logo/image. Free, instant, and private.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    const guideSections = [
        {
            title: "Adding a Logo",
            content: (
                <div className="space-y-4">
                    <p>
                        Make your QR code stand out by adding your brand's logo. Use a high-contrast image for best results.
                        The scanner's error correction ability allows it to still read the code even if part of it is covered by your image.
                    </p>
                </div>
            )
        },
        {
            title: "Best Practices",
            content: (
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Contrast:</strong> Ensure there is high contrast between the foreground and background colors.</li>
                    <li><strong>Size:</strong> Don't make the logo too big, or it might make the code unreadable.</li>
                    <li><strong>Testing:</strong> Always scan your QR code with your phone camera before printing it.</li>
                </ul>
            )
        }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="QR Code Generator"
                description="Create instant, customizable QR codes for URLs, text, Wi-Fi, and more. Add your own logo for branding."
            />

            <AdContainer slot="qr-top" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                {/* Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-2">
                        <CardContent className="p-8">
                            <Tabs defaultValue="content" className="space-y-8">
                                <TabsList className="grid w-full grid-cols-3 h-12">
                                    <TabsTrigger value="content" className="text-lg">Content</TabsTrigger>
                                    <TabsTrigger value="style" className="text-lg">Style</TabsTrigger>
                                    <TabsTrigger value="logo" className="text-lg">Logo</TabsTrigger>
                                </TabsList>

                                {/* Content Tab */}
                                <TabsContent value="content" className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="content" className="text-base font-semibold">Content</Label>
                                        <Input
                                            id="content"
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            placeholder="Enter URL or text..."
                                            className="h-12 text-lg"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Enter the link or text you want the QR code to open.
                                        </p>
                                    </div>
                                </TabsContent>

                                {/* Style Tab */}
                                <TabsContent value="style" className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <Label className="font-semibold">Size (px)</Label>
                                            <span className="font-mono text-muted-foreground">{size[0]}px</span>
                                        </div>
                                        <Slider
                                            value={size}
                                            onValueChange={setSize}
                                            min={128}
                                            max={1024}
                                            step={32}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="font-semibold">Foreground</Label>
                                            <ColorPicker value={fgColor} onChange={setFgColor} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="font-semibold">Background</Label>
                                            <ColorPicker value={bgColor} onChange={setBgColor} />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Logo Tab */}
                                <TabsContent value="logo" className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="font-semibold">Upload Logo</Label>
                                        <div className="flex gap-4 items-center">
                                            <div className="relative">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="logo-upload"
                                                    onChange={handleImageUpload}
                                                />
                                                <Button variant="secondary" asChild className="h-12 px-6 cursor-pointer">
                                                    <label htmlFor="logo-upload">
                                                        <Upload className="mr-2 h-4 w-4" /> Choose Image
                                                    </label>
                                                </Button>
                                            </div>
                                            {imageSrc && (
                                                <Button variant="ghost" onClick={() => setImageSrc("")} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                    <X className="mr-2 h-4 w-4" /> Remove
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Supported formats: PNG, JPG, SVG.</p>
                                    </div>

                                    {imageSrc && (
                                        <>
                                            <div className="space-y-4">
                                                <div className="flex justify-between">
                                                    <Label className="font-semibold">Logo Size</Label>
                                                    <span className="font-mono text-muted-foreground">{Math.round(imageSize[0] * 100)}%</span>
                                                </div>
                                                <Slider
                                                    value={imageSize}
                                                    onValueChange={setImageSize}
                                                    min={0.1}
                                                    max={0.4}
                                                    step={0.05}
                                                />
                                                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                                    Warning: Making the logo too large may make the QR code unscannable.
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                                                <div className="space-y-0.5">
                                                    <Label className="text-base">Excavate Background</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Remove QR blocks behind the logo for better visibility.
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={excavate}
                                                    onCheckedChange={setExcavate}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {!imageSrc && (
                                        <div className="p-6 border-2 border-dashed rounded-xl bg-muted/50 flex flex-col items-center text-center text-muted-foreground">
                                            <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                                            <p>No logo uploaded</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="space-y-6">
                    <Card className="border-2 bg-muted/20 sticky top-6">
                        <CardContent className="p-8 flex flex-col items-center justify-center space-y-8">
                            <div className="bg-white p-4 rounded-xl" ref={qrRef}>
                                <QRCodeCanvas
                                    value={value}
                                    size={size[0]}
                                    bgColor={bgColor}
                                    fgColor={fgColor}
                                    level={"H"} // High error correction for images
                                    imageSettings={imageSrc ? {
                                        src: imageSrc,
                                        height: size[0] * imageSize[0],
                                        width: size[0] * imageSize[0],
                                        excavate: excavate,
                                    } : undefined}
                                />
                            </div>
                            <Button size="lg" className="w-full h-12 font-bold gap-2" onClick={downloadQr}>
                                <Download size={18} /> Download PNG
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ToolGuide
                title="QR Codes with Images"
                sections={guideSections}
                faqs={faq}
            />

            <AdContainer slot="qr-bottom" />
        </div>
    );
}
