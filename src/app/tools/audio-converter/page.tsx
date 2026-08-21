"use client";

import { useState, useRef, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Upload, Music, Download, Loader2 } from "lucide-react";

import { toast } from "sonner";

export default function AudioConverterPage() {
    const [loaded, setLoaded] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState("mp3");
    const [isConverting, setIsConverting] = useState(false);
    const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
    const ffmpegRef = useRef<any>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);

    const loadFfmpeg = async () => {
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
        const { FFmpeg } = await import("@ffmpeg/ffmpeg");
        const { toBlobURL } = await import("@ffmpeg/util");

        if (!ffmpegRef.current) {
            ffmpegRef.current = new FFmpeg();
        }
        const ffmpeg = ffmpegRef.current;

        // Check if loaded
        if (ffmpeg.loaded) return;

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });
            setLoaded(true);
        } catch (error) {
            console.error("FFmpeg load failed:", error);
            toast.error("Failed to load audio engine. Your browser might not support this feature.");
        }
    };

    useEffect(() => {
        loadFfmpeg();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setConvertedUrl(null);
        }
    };

    const convertAudio = async () => {
        if (!file || !loaded) return;
        setIsConverting(true);
        const ffmpeg = ffmpegRef.current;

        try {
            const { fetchFile } = await import("@ffmpeg/util");
            await ffmpeg.writeFile(file.name, await fetchFile(file));

            const outputName = `output.${format}`;
            await ffmpeg.exec(['-i', file.name, outputName]);

            const data = await ffmpeg.readFile(outputName);
            const url = URL.createObjectURL(new Blob([data as any], { type: `audio/${format}` }));

            setConvertedUrl(url);
            toast.success(`Converted to ${format.toUpperCase()}!`);
        } catch (error) {
            console.error(error);
            toast.error("Conversion failed.");
        } finally {
            setIsConverting(false);
        }
    };

    const faq = [
        { q: "Is this really private?", a: "Yes. We use WebAssembly (WASM) to run FFmpeg directly in your browser. Your audio files are processed locally on your device." },
        { q: "Why is it downloading a file on load?", a: "The tool needs to download the core audio processing engine (ffmpeg-core.wasm, ~30MB) once to work offline." },
        { q: "Can I convert large files?", a: "Yes, but performance depends on your device's RAM and CPU. For files over 100MB, it might take a while." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Audio Converter"
                description="Convert audio files between MP3, WAV, AAC, and OGG formats securely in your browser."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <Card className="border-2 h-fit">
                    <CardContent className="p-8 space-y-8">
                        <div
                            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${file ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted'}`}
                            onClick={() => document.getElementById("audioInput")?.click()}
                        >
                            <input
                                id="audioInput"
                                type="file"
                                className="hidden"
                                accept="audio/*"
                                onChange={handleFileChange}
                            />
                            {file ? (
                                <div className="space-y-2">
                                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-primary">
                                        <Music size={24} />
                                    </div>
                                    <p className="font-medium text-lg">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                                        <Music size={32} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold italic">Click to upload audio</p>
                                        <p className="text-sm text-muted-foreground">Supports MP3, WAV, AAC, M4A, OGG</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Output Format</label>
                                <Select value={format} onValueChange={setFormat}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mp3">MP3</SelectItem>
                                        <SelectItem value="wav">WAV</SelectItem>
                                        <SelectItem value="aac">AAC</SelectItem>
                                        <SelectItem value="ogg">OGG</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col justify-end">
                                <Button
                                    className="h-12 px-8 font-bold"
                                    onClick={convertAudio}
                                    disabled={!file || !loaded || isConverting}
                                >
                                    {isConverting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...
                                        </>
                                    ) : !loaded ? "Loading Engine..." : "Convert Now"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-2">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Conversion Status</h3>
                            {!convertedUrl ? (
                                <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground bg-muted/20">
                                    Waiting for conversion...
                                </div>
                            ) : (
                                <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800 space-y-4">
                                    <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                                        <Download size={24} />
                                        <span className="font-bold text-lg">Ready to Download</span>
                                    </div>
                                    <audio controls src={convertedUrl} className="w-full" />
                                    <a href={convertedUrl} download={`converted.${format}`} className="block">
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                            Download File
                                        </Button>
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900 text-sm text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> On first use, the browser needs to fetch the audio engine (~30MB). This happens only once and is cached for future visits.
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Universal Audio Transcoder">
                    <p>
                        Whether you need an MP3 for your car stereo, a WAV file for high-quality editing, or an OGG file for web development,
                        ToolBox Audio Converter handles it all. We use the industry-standard FFmpeg library compiled to WebAssembly.
                    </p>
                </ToolContentSection>
                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
