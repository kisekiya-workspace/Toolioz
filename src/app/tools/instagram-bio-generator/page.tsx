"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// Character maps for transformations
const maps: Record<string, Record<string, string>> = {
    bold: {
        "0": "𝟎", "1": "𝟏", "2": "𝟐", "3": "𝟑", "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖", "9": "𝟗",
        "a": "𝐚", "b": "𝐛", "c": "𝐜", "d": "𝐝", "e": "𝐞", "f": "𝐟", "g": "𝐠", "h": "𝐡", "i": "𝐢", "j": "𝐣", "k": "𝐤", "l": "𝐥", "m": "𝐦", "n": "𝐧", "o": "𝐨", "p": "𝐩", "q": "𝐪", "r": "𝐫", "s": "𝐬", "t": "𝐭", "u": "𝐮", "v": "𝐯", "w": "𝐰", "x": "𝐱", "y": "𝐲", "z": "𝐳",
        "A": "𝐀", "B": "𝐁", "C": "𝐂", "D": "𝐃", "E": "𝐄", "F": "𝐅", "G": "𝐆", "H": "𝐇", "I": "𝐈", "J": "𝐉", "K": "𝐊", "L": "𝐋", "M": "𝐌", "N": "𝐍", "O": "𝐎", "P": "𝐏", "Q": "𝐐", "R": "𝐑", "S": "𝐒", "T": "𝐓", "U": "𝐔", "V": "𝐕", "W": "𝐖", "X": "𝐗", "Y": "𝐘", "Z": "𝐙"
    },
    italic: {
        "a": "𝘢", "b": "𝘣", "c": "𝘤", "d": "𝘥", "e": "𝘦", "f": "𝘧", "g": "𝘨", "h": "𝘩", "i": "𝘪", "j": "𝘫", "k": "𝘬", "l": "𝘭", "m": "𝘮", "n": "𝘯", "o": "𝘰", "p": "𝘱", "q": "𝘲", "r": "𝘳", "s": "𝘴", "t": "𝘵", "u": "𝘶", "v": "𝘷", "w": "𝘸", "x": "𝘹", "y": "𝘺", "z": "𝘻",
        "A": "𝘈", "B": "𝘉", "C": "𝘊", "D": "𝘋", "E": "𝘌", "F": "𝘍", "G": "𝘎", "H": "𝘏", "I": "𝘐", "J": "𝘑", "K": "𝘒", "L": "𝘓", "M": "𝘔", "N": "𝘕", "O": "𝘖", "P": "𝘗", "Q": "𝘘", "R": "𝘙", "S": "𝘚", "T": "𝘛", "U": "𝘜", "V": "𝘝", "W": "𝘞", "X": "𝘟", "Y": "𝘠", "Z": "𝘡"
    },
    monospace: {
        "0": "𝟶", "1": "𝟷", "2": "𝟸", "3": "𝟹", "4": "𝟺", "5": "𝟻", "6": "𝟼", "7": "𝟽", "8": "𝟾", "9": "𝟿",
        "a": "𝚊", "b": "𝚋", "c": "𝚌", "d": "𝚍", "e": "𝚎", "f": "𝚏", "g": "𝚐", "h": "𝚑", "i": "𝚒", "j": "𝚓", "k": "𝚔", "l": "𝚕", "m": "𝚖", "n": "𝚗", "o": "𝚘", "p": "𝚙", "q": "𝚚", "r": "𝚛", "s": "𝚜", "t": "𝚝", "u": "𝚞", "v": "𝚟", "w": "𝚠", "x": "𝚡", "y": "𝚢", "z": "𝚣",
        "A": "𝙰", "B": "𝙱", "C": "𝙲", "D": "𝙳", "E": "𝙴", "F": "𝙵", "G": "𝙶", "H": "𝙷", "I": "𝙸", "J": "𝙹", "K": "𝙺", "L": "𝙻", "M": "𝙼", "N": "𝙽", "O": "𝙾", "P": "𝙿", "Q": "𝚀", "R": "𝚁", "S": "𝚂", "T": "𝚃", "U": "𝚄", "V": "𝚅", "W": "𝚆", "X": "𝚇", "Y": "𝚈", "Z": "𝚉"
    },
    script: {
        "a": "𝒶", "b": "𝒷", "c": "𝒸", "d": "𝒹", "e": "ℯ", "f": "𝒻", "g": "ℊ", "h": "𝒽", "i": "𝒾", "j": "𝒿", "k": "𝓀", "l": "𝓁", "m": "𝓂", "n": "𝓃", "o": "ℴ", "p": "𝓅", "q": "𝓆", "r": "𝓇", "s": "𝓈", "t": "𝓉", "u": "𝓊", "v": "𝓋", "w": "𝓌", "x": "𝓍", "y": "𝓎", "z": "𝓏",
        "A": "𝒜", "B": "ℬ", "C": "𝒞", "D": "𝒟", "E": "ℰ", "F": "ℱ", "G": "𝒢", "H": "ℋ", "I": "ℐ", "J": "𝒥", "K": "𝒦", "L": "ℒ", "M": "ℳ", "N": "𝒩", "O": "𝒪", "P": "𝒫", "Q": "𝒬", "R": "ℛ", "S": "𝒮", "T": "𝒯", "U": "𝒰", "V": "𝒱", "W": "𝒲", "X": "𝒳", "Y": "𝒴", "Z": "𝒵"
    },
    circled: {
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
        "a": "ⓐ", "b": "ⓑ", "c": "ⓒ", "d": "ⓓ", "e": "ⓔ", "f": "ⓕ", "g": "ⓖ", "h": "ⓗ", "i": "ⓘ", "j": "ⓙ", "k": "ⓚ", "l": "ⓛ", "m": "ⓜ", "n": "ⓝ", "o": "ⓞ", "p": "ⓟ", "q": "ⓠ", "r": "ⓡ", "s": "ⓢ", "t": "ⓣ", "u": "ⓤ", "v": "ⓥ", "w": "ⓦ", "x": "ⓧ", "y": "ⓨ", "z": "ⓩ",
        "A": "Ⓐ", "B": "Ⓑ", "C": "Ⓒ", "D": "Ⓓ", "E": "Ⓔ", "F": "Ⓕ", "G": "Ⓖ", "H": "Ⓗ", "I": "Ⓘ", "J": "Ⓙ", "K": "Ⓚ", "L": "Ⓛ", "M": "Ⓜ", "N": "Ⓝ", "O": "Ⓞ", "P": "Ⓟ", "Q": "Ⓠ", "R": "Ⓡ", "S": "Ⓢ", "T": "Ⓣ", "U": "Ⓤ", "V": "Ⓥ", "W": "Ⓦ", "X": "Ⓧ", "Y": "Ⓨ", "Z": "Ⓩ"
    },
    doublestruck: {
        "0": "𝟘", "1": "𝟙", "2": "𝟚", "3": "𝟛", "4": "𝟜", "5": "𝟝", "6": "𝟞", "7": "𝟟", "8": "𝟠", "9": "𝟡",
        "a": "𝕒", "b": "𝕓", "c": "𝕔", "d": "𝕕", "e": "𝕖", "f": "𝕗", "g": "𝕘", "h": "𝕙", "i": "𝕚", "j": "𝕛", "k": "𝕜", "l": "𝕝", "m": "𝕞", "n": "𝕟", "o": "𝕠", "p": "𝕡", "q": "𝕢", "r": "𝕣", "s": "𝕤", "t": "𝕥", "u": "𝕦", "v": "𝕧", "w": "𝕨", "x": "𝕩", "y": "𝕪", "z": "𝕫",
        "A": "𝔸", "B": "𝔹", "C": "ℂ", "D": "𝔻", "E": "𝔼", "F": "𝔽", "G": "𝔾", "H": "ℍ", "I": "𝕀", "J": "𝕁", "K": "𝕂", "L": "𝕃", "M": "𝕄", "N": "ℕ", "O": "𝕆", "P": "ℙ", "Q": "ℚ", "R": "ℝ", "S": "𝕊", "T": "𝕋", "U": "𝕌", "V": "𝕍", "W": "𝕎", "X": "𝕏", "Y": "𝕐", "Z": "ℤ"
    }
};

const styles = [
    { id: "bold", name: "Bold", demo: "𝐁𝐨𝐥𝐝 𝐓𝐞𝐱𝐭" },
    { id: "italic", name: "Italic", demo: "𝘐𝘵𝘢𝘭𝘪𝘤 𝘛𝘦𝘹𝘵" },
    { id: "monospace", name: "Monospace", demo: "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎" },
    { id: "script", name: "Script", demo: "𝒮𝒸𝓇𝒾𝓅𝓉 𝐹𝑜𝓃𝓉" },
    { id: "circled", name: "Circled", demo: "Ⓒⓘⓡⓒⓛⓔⓓ" },
    { id: "doublestruck", name: "Double Struck", demo: "𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜" },
];

export default function BioGeneratorPage() {
    const [input, setInput] = useState("Tools Toolioz");

    const transform = (text: string, styleId: string) => {
        const map = maps[styleId];
        return text.split('').map(char => map[char] || char).join('');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-5xl">
            <ToolHeader
                title="Instagram Bio Generator"
                description="Make your social media profiles stand out with custom stylish fonts."
            />

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {/* Input Section */}
                <div className="space-y-6">
                    <Card className="border-0 ring-1 ring-border/50 sticky top-24">
                        <CardContent className="p-6 md:p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Type something</label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => setInput("")}
                                >
                                    Clear
                                </Button>
                            </div>
                            <Textarea
                                placeholder="Type your bio here..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="min-h-[200px] text-lg p-4 resize-none rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary transition-colors bg-muted/20"
                            />
                            <p className="text-xs text-muted-foreground text-right">{input.length} characters</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preview & Copy</span>
                    </div>

                    <div className="space-y-4">
                        {styles.map((style) => (
                            <Card key={style.id} className="group overflow-hidden border-2 border-border/40 hover:border-primary/50 transition-all">
                                <CardContent className="p-0 flex">
                                    <div className="flex-1 p-5 min-w-0">
                                        <div className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-tight">{style.name}</div>
                                        <p className="text-lg md:text-xl truncate pr-4 text-foreground font-medium">
                                            {input ? transform(input, style.id) : <span className="text-muted-foreground/30">{style.demo}</span>}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(transform(input, style.id))}
                                        className="w-14 bg-muted/50 hover:bg-primary hover:text-white transition-colors flex items-center justify-center border-l-2 border-border/40 group-hover:border-primary/20"
                                        title="Copy to Clipboard"
                                    >
                                        <Copy className="h-5 w-5" />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
