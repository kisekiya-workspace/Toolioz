"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Button } from "@/components/sociials-ui/button";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Slider } from "@/components/sociials-ui/slider";
import { Label } from "@/components/sociials-ui/label";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumPage() {
    const [paragraphs, setParagraphs] = useState([3]);
    const [text, setText] = useState("");

    const generateLorem = () => {
        let result = [];
        for (let i = 0; i < paragraphs[0]; i++) {
            const sentenceCount = Math.floor(Math.random() * 5) + 4; // 4-8 sentences
            let paragraph = [];
            for (let j = 0; j < sentenceCount; j++) {
                const wordCount = Math.floor(Math.random() * 10) + 6; // 6-15 words
                let sentence = [];
                for (let k = 0; k < wordCount; k++) {
                    sentence.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
                }
                // Capitalize first letter and add period
                let sStr = sentence.join(" ");
                sStr = sStr.charAt(0).toUpperCase() + sStr.slice(1) + ".";
                paragraph.push(sStr);
            }
            result.push(paragraph.join(" "));
        }
        setText(result.join("\n\n"));
    };

    const copyToClipboard = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success("Text copied!");
    };

    // Generate on first load
    if (!text) generateLorem();

    const faq = [
        { q: "What is Lorem Ipsum?", a: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s." },
        { q: "Why use it?", a: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters." },
        { q: "Is the text real Latin?", a: "Not exactly. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old, but the words have been scrambled." }
    ];

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="Lorem Ipsum Generator"
                description="Generate professional placeholder text for your designs, mockups, and prototypes instantly."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="font-semibold">Paragraphs</Label>
                                    <span className="text-xl font-bold text-primary">{paragraphs[0]}</span>
                                </div>
                                <Slider
                                    value={paragraphs}
                                    onValueChange={setParagraphs}
                                    max={20}
                                    min={1}
                                    step={1}
                                    className="py-2"
                                />
                            </div>

                            <Button className="w-full h-12 text-lg font-bold gap-2" onClick={generateLorem}>
                                <RefreshCw size={18} /> Regenerate
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="border-2 h-full min-h-[500px] flex flex-col">
                        <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">Generated Text</span>
                            <Button size="sm" variant="ghost" className="gap-2" onClick={copyToClipboard}>
                                <Copy size={16} /> Copy Text
                            </Button>
                        </div>
                        <Textarea
                            value={text}
                            readOnly
                            className="flex-1 border-0 rounded-none p-6 resize-none text-lg leading-relaxed focus-visible:ring-0"
                        />
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Designers' Best Friend">
                    <p>
                        When designing a website or brochure, you often need to show what the final product will look like before the actual copy is written.
                        Using "Lorem Ipsum" prevents clients from getting distracted by reading the text and helps them focus on the visual elements of the design.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="The Surprising History (45 BC)">
                    <p>
                        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,
                        making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the
                        more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.
                    </p>
                    <p>
                        Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero,
                        written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance.
                    </p>
                </ToolContentSection>

                <ToolContentSection title="Why do we use it?">
                    <p>
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                        The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here',
                        making it look like readable English.
                    </p>
                    <p>
                        Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
                        will uncover many web sites still in their infancy.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>
        </div>
    );
}
