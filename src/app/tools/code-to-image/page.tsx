"use client";

import { useState, useRef, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Label } from "@/components/sociials-ui/label";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Slider } from "@/components/sociials-ui/slider";
import { Download, Copy, Check, RotateCcw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";

// Code Editor
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; // Default
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";

// Types
type Theme = "dracula" | "github" | "night-owl" | "prism" | "atom-dark";
type Language = "javascript" | "typescript" | "css" | "json" | "python" | "bash" | "markdown";

const THEMES: Record<Theme, { bg: string, text: string, prismTheme: string }> = {
    "dracula": { bg: "#282a36", text: "#f8f8f2", prismTheme: "dracula" },
    "github": { bg: "#ffffff", text: "#24292e", prismTheme: "ghcolors" },
    "night-owl": { bg: "#011627", text: "#d6deeb", prismTheme: "night-owl" },
    "atom-dark": { bg: "#1d1f21", text: "#c5c8c6", prismTheme: "tomorrow" },
    "prism": { bg: "#f5f2f0", text: "#000000", prismTheme: "default" },
};

const BACKGROUNDS = [
    { name: "Candy", value: "linear-gradient(140deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
    { name: "Midnight", value: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)" },
    { name: "Sunset", value: "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)" },
    { name: "Ocean", value: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)" },
    { name: "Forest", value: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)" },
    { name: "Solid Dark", value: "#0f172a" },
    { name: "Transparent", value: "transparent" },
];

export default function CodeToImagePage() {
    const [code, setCode] = useState(`function helloWorld() {
  console.log("Hello, Toolioz!");
  return "Happy Coding!";
}`);
    const [language, setLanguage] = useState<Language>("javascript");
    const [theme, setTheme] = useState<Theme>("dracula");
    const [background, setBackground] = useState(BACKGROUNDS[1].value); // Midnight default
    const [padding, setPadding] = useState(64);
    const [title, setTitle] = useState("Untitled");
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [showWindowControls, setShowWindowControls] = useState(true);
    const editorRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        if (!editorRef.current) return;

        try {
            const dataUrl = await toPng(editorRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement("a");
            link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-snippet.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Image exported successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to export image.");
        }
    };

    const highlight = (code: string) => {
        // Safe mapping for prism languages
        let prismLang = Prism.languages[language];
        if (!prismLang) prismLang = Prism.languages.javascript; // Fallback
        return Prism.highlight(code, prismLang, language);
    };

    // Inject Custom Theme Styles (Simulated for this demo, usually we import real CSS files)
    // For a real app, we'd import 'prismjs/themes/prism-dracula.css' etc based on selection
    // Or simpler: Just use inline styles for container and let Prism handle syntax colors.
    // For this MVP, we will stick to basic Prism default + custom container colors.

    return (
        <div className="container px-4 py-8 m-auto max-w-[1400px]">
            <ToolHeader
                title="Code to Image Converter"
                description="Create beautiful, shareable code snippets for social media."
            />
            <AdContainer slot="code-top" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

                {/* CONTROLS */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label>Snippet Title</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="typescript">TypeScript</SelectItem>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="css">CSS</SelectItem>
                                        <SelectItem value="json">JSON</SelectItem>
                                        <SelectItem value="bash">Bash</SelectItem>
                                        <SelectItem value="markdown">Markdown</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <Select value={theme} onValueChange={(v: any) => setTheme(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="dracula">Dracula</SelectItem>
                                        <SelectItem value="github">GitHub Light</SelectItem>
                                        <SelectItem value="night-owl">Night Owl</SelectItem>
                                        <SelectItem value="atom-dark">Atom Dark</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Padding ({padding}px)</Label>
                                </div>
                                <Slider
                                    value={[padding]}
                                    onValueChange={(v) => setPadding(v[0])}
                                    min={16} max={128} step={8}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Background</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {BACKGROUNDS.map((bg) => (
                                        <button
                                            key={bg.name}
                                            onClick={() => setBackground(bg.value)}
                                            className={`w-full h-8 rounded-md border transition-all ${background === bg.value ? 'ring-2 ring-primary' : 'hover:scale-105'}`}
                                            style={{ background: bg.value }}
                                            title={bg.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full h-12 text-lg font-bold" onClick={handleExport}>
                                <Download className="mr-2 h-5 w-5" /> Export PNG
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* PREVIEW */}
                <div className="lg:col-span-8">
                    <div className="bg-muted/30 border rounded-xl overflow-hidden p-4 md:p-8 flex items-center justify-center min-h-[500px]">

                        {/* THE CANVAS */}
                        <div
                            ref={editorRef}
                            style={{ padding: `${padding}px`, background: background }}
                            className="transition-all duration-300 min-w-[300px] max-w-full"
                        >
                            <div
                                className="rounded-xl overflow-hidden shadow-2xl"
                                style={{ backgroundColor: THEMES[theme].bg }}
                            >
                                {/* Window Controls */}
                                {showWindowControls && (
                                    <div className="h-10 px-4 flex items-center gap-2 bg-black/10">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        <div className="flex-1 text-center text-xs font-semibold opacity-50 text-white/60 -ml-16">
                                            {title}
                                        </div>
                                    </div>
                                )}

                                {/* Editor */}
                                <div
                                    className="p-4 font-mono text-sm leading-6"
                                    style={{ color: THEMES[theme].text }}
                                >
                                    <Editor
                                        value={code}
                                        onValueChange={setCode}
                                        highlight={highlight}
                                        padding={10}
                                        style={{
                                            fontFamily: '"Fira Code", "Fira Mono", monospace',
                                            fontSize: 14,
                                        }}
                                        className="min-h-[100px] outline-none border-none"
                                        textareaClassName="focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Tip: You can edit the code directly in the preview!
                    </p>
                </div>
            </div>

            <ToolGuide
                title="Code to Image Converter"
                sections={[
                    {
                        title: "Create Beautiful Snippets",
                        content: "Turn your code into stunning images for Twitter, Instagram, and LinkedIn. Customize themes, backgrounds, and padding to match your style."
                    }
                ]}
            />

            <AdContainer slot="code-bottom" />
        </div>
    );
}
