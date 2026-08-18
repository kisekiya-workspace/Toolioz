"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Input } from "@/components/sociials-ui/input";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Button } from "@/components/sociials-ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { Label } from "@/components/sociials-ui/label";
import { Switch } from "@/components/sociials-ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { ColorPicker } from "@/components/sociials-ui/color-picker";
import { FileCode, Copy, Check, Globe, Share2, Settings } from "lucide-react";
import { toast } from "sonner";

export default function MetaTagGeneratorPage() {
    // Basic
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState("");

    // Advanced
    const [robotsIndex, setRobotsIndex] = useState("index");
    const [robotsFollow, setRobotsFollow] = useState("follow");
    const [themeColor, setThemeColor] = useState("#ffffff");
    const [language, setLanguage] = useState("en");
    const [contentType, setContentType] = useState("text/html; charset=utf-8");

    // Config
    const [copied, setCopied] = useState(false);

    const generateMetaTags = () => {
        const tags = [];

        // Basic
        tags.push(`<!-- Primary Meta Tags -->`);
        tags.push(`<title>${title}</title>`);
        tags.push(`<meta name="title" content="${title}">`);
        tags.push(`<meta name="description" content="${description}">`);
        if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
        if (author) tags.push(`<meta name="author" content="${author}">`);
        if (language) tags.push(`<meta name="language" content="${language}">`);

        // Open Graph / Facebook
        tags.push(`\n<!-- Open Graph / Facebook -->`);
        tags.push(`<meta property="og:type" content="website">`);
        tags.push(`<meta property="og:url" content="${url}">`);
        tags.push(`<meta property="og:title" content="${title}">`);
        tags.push(`<meta property="og:description" content="${description}">`);
        if (image) tags.push(`<meta property="og:image" content="${image}">`);

        // Twitter
        tags.push(`\n<!-- Twitter -->`);
        tags.push(`<meta property="twitter:card" content="${image ? "summary_large_image" : "summary"}">`);
        tags.push(`<meta property="twitter:url" content="${url}">`);
        tags.push(`<meta property="twitter:title" content="${title}">`);
        tags.push(`<meta property="twitter:description" content="${description}">`);
        if (image) tags.push(`<meta property="twitter:image" content="${image}">`);

        // Advanced
        tags.push(`\n<!-- Technical & Advanced -->`);
        tags.push(`<meta name="robots" content="${robotsIndex}, ${robotsFollow}">`);
        tags.push(`<meta http-equiv="Content-Type" content="${contentType}">`);
        tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
        if (themeColor) tags.push(`<meta name="theme-color" content="${themeColor}">`);

        return tags.join('\n');
    };

    const copyTags = () => {
        navigator.clipboard.writeText(generateMetaTags());
        setCopied(true);
        toast.success("Meta tags copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-[1400px]">
            <ToolHeader
                title="Meta Tag Generator"
                description="Generate SEO-friendly meta tags with live Google and Social Media previews."
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-16">
                {/* Inputs Column */}
                <div className="space-y-6">
                    <Card className="border-2 shadow-md">
                        <CardHeader className="pb-4 border-b bg-muted/20">
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="w-full justify-start rounded-none h-14 p-0 border-b bg-transparent">
                                    <TabsTrigger value="basic" className="rounded-none h-full px-6 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary transition-none">
                                        <Globe className="mr-2 h-4 w-4" /> Basic
                                    </TabsTrigger>
                                    <TabsTrigger value="social" className="rounded-none h-full px-6 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary transition-none">
                                        <Share2 className="mr-2 h-4 w-4" /> Social
                                    </TabsTrigger>
                                    <TabsTrigger value="advanced" className="rounded-none h-full px-6 data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary transition-none">
                                        <Settings className="mr-2 h-4 w-4" /> Advanced
                                    </TabsTrigger>
                                </TabsList>

                                <div className="p-6">
                                    <TabsContent value="basic" className="space-y-5 m-0">
                                        <div className="space-y-2">
                                            <Label>Page Title</Label>
                                            <div className="relative">
                                                <Input
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="e.g., My Awesome Page Title"
                                                    maxLength={60}
                                                />
                                                <span className={`absolute right-3 top-2.5 text-xs ${title.length > 60 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                    {title.length}/60
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Recommended: 50-60 characters.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Meta Description</Label>
                                            <div className="relative">
                                                <Textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="A brief summary of your page content..."
                                                    className="min-h-[100px]"
                                                    maxLength={160}
                                                />
                                                <span className={`absolute right-3 bottom-2.5 text-xs ${description.length > 160 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                    {description.length}/160
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Recommended: 150-160 characters.</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Page URL</Label>
                                            <Input
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="https://example.com/current-page"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Keywords (Comma separated)</Label>
                                            <Input
                                                value={keywords}
                                                onChange={(e) => setKeywords(e.target.value)}
                                                placeholder="seo, tools, generator"
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="social" className="space-y-5 m-0">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm text-blue-700 dark:text-blue-300 mb-4">
                                            Social tags define how your content looks when shared on platforms like Facebook, Twitter, and LinkedIn.
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Thumbnail Image URL (OG:Image)</Label>
                                            <Input
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Author</Label>
                                            <Input
                                                value={author}
                                                onChange={(e) => setAuthor(e.target.value)}
                                                placeholder="Your Name or Handle"
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="advanced" className="space-y-5 m-0">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Robots Indexing</Label>
                                                <Select value={robotsIndex} onValueChange={setRobotsIndex}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="index">index (Default)</SelectItem>
                                                        <SelectItem value="noindex">noindex</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Robots Following</Label>
                                                <Select value={robotsFollow} onValueChange={setRobotsFollow}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="follow">follow (Default)</SelectItem>
                                                        <SelectItem value="nofollow">nofollow</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Theme Color (Mobile Chrome)</Label>
                                            <div className="flex gap-2">
                                                <ColorPicker
                                                    value={themeColor}
                                                    onChange={setThemeColor}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Language</Label>
                                            <Input
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                                placeholder="en"
                                            />
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Output Code */}
                    <Card className="border-2 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-muted/20">
                            <CardTitle>Generated Code</CardTitle>
                            <Button variant="outline" size="sm" onClick={copyTags}>
                                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? "Copied!" : "Copy Code"}
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <pre className="p-6 text-sm overflow-x-auto font-mono leading-relaxed bg-background">
                                {generateMetaTags()}
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                {/* Previews Column */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold px-1">Live Previews</h2>

                    {/* Google Preview */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground font-semibold">Google Search Result</Label>
                        <Card className="border p-4 shadow-sm bg-background">
                            <div className="max-w-[600px] font-sans">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-[10px] text-gray-500 overflow-hidden">
                                        {image ? <img src={image} className="w-full h-full object-cover" alt="" /> : "Fav"}
                                    </div>
                                    <div className="flex flex-col text-sm leading-tight">
                                        <span className="text-[#202124] dark:text-[#dadce0] truncate">{new URL(url || "https://example.com").hostname}</span>
                                        <span className="text-[#5f6368] dark:text-[#bdc1c6] truncate text-xs">{url || "https://example.com"}</span>
                                    </div>
                                </div>
                                <div className="text-[#1a0dab] dark:text-[#8ab4f8] text-xl truncate hover:underline cursor-pointer mb-1">
                                    {title || "Page Title"}
                                </div>
                                <div className="text-[#4d5156] dark:text-[#bdc1c6] text-sm line-clamp-2">
                                    {description || "This is how your page description will appear in Google search results. Keep it between 150-160 characters for best visibility."}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Facebook Preview */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground font-semibold">Facebook Post</Label>
                        <Card className="border shadow-sm overflow-hidden bg-background max-w-[500px]">
                            <div className="aspect-[1.91/1] bg-muted w-full flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <img src={image} className="w-full h-full object-cover" alt="OG Preview" />
                                ) : (
                                    <span className="text-muted-foreground text-sm">No Image</span>
                                )}
                            </div>
                            <div className="p-3 bg-[#f0f2f5] dark:bg-[#18191a] border-t">
                                <div className="text-xs text-muted-foreground uppercase truncate mb-1">{new URL(url || "https://example.com").hostname}</div>
                                <div className="font-bold text-[#050505] dark:text-[#e4e6eb] truncate mb-1">{title || "Page Title"}</div>
                                <div className="text-sm text-[#65676b] dark:text-[#b0b3b8] line-clamp-1">{description || "Description preview..."}</div>
                            </div>
                        </Card>
                    </div>

                    {/* Twitter Preview */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground font-semibold">Twitter Card (Summary Large)</Label>
                        <Card className="border shadow-sm overflow-hidden bg-background max-w-[500px] rounded-xl">
                            <div className="aspect-[2/1] bg-muted w-full flex items-center justify-center overflow-hidden">
                                {image ? (
                                    <img src={image} className="w-full h-full object-cover" alt="Twitter Preview" />
                                ) : (
                                    <span className="text-muted-foreground text-sm">No Image</span>
                                )}
                            </div>
                            <div className="p-3 border-t">
                                <div className="font-bold text-foreground truncate mb-1">{title || "Page Title"}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2 mb-1">{description || "Description preview..."}</div>
                                <div className="text-sm text-muted-foreground/60 flex items-center gap-1">
                                    <Globe size={12} />
                                    {new URL(url || "https://example.com").hostname}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <ToolContentSection title="SEO Best Practices">
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Title Tag:</strong> Keep it under 60 characters. Include your main keyword near the beginning.</li>
                    <li><strong>Meta Description:</strong> Keep it between 150-160 characters. Write a compelling summary that encourages clicks (CTR).</li>
                    <li><strong>Social Images:</strong> Use high-quality images. Recommended size for OG images is 1200x630 pixels.</li>
                    <li><strong>Robots:</strong> Use 'noindex' only for pages you don't want in search results (like admin pages or thank you pages).</li>
                </ul>
            </ToolContentSection>
        </div>
    );
}
