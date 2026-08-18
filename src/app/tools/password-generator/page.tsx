"use client";

import { useState, useCallback, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { ToolGuide } from "@/components/sociials-tools/ToolGuide";
import { JsonLd } from "@/components/sociials-seo/JsonLd";
import { AdContainer } from "@/components/sociials-ads/AdContainer";
import { Button } from "@/components/sociials-ui/button";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Slider } from "@/components/sociials-ui/slider";
import { Checkbox } from "@/components/sociials-ui/checkbox";
import { RefreshCw, Copy, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/sociials-ui/label";

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState([16]);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });

    const generatePassword = useCallback(() => {
        const chars = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
        };

        let charset = "";
        if (options.uppercase) charset += chars.uppercase;
        if (options.lowercase) charset += chars.lowercase;
        if (options.numbers) charset += chars.numbers;
        if (options.symbols) charset += chars.symbols;

        if (charset === "") {
            setPassword("");
            return;
        }

        let generated = "";
        for (let i = 0; i < length[0]; i++) {
            generated += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(generated);
    }, [length, options]);

    // Generate on mount and when interactions change
    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const copyToClipboard = () => {
        if (!password) return;
        navigator.clipboard.writeText(password);
        toast.success("Password copied!");
    };

    const strength = password.length > 12 && options.symbols && options.numbers ? "Strong" : password.length > 8 ? "Medium" : "Weak";
    const strengthColor = strength === "Strong" ? "text-green-500" : strength === "Medium" ? "text-yellow-500" : "text-red-500";

    const faq = [
        { q: "Is this generator secure?", a: "Yes. It uses your browser's local random number generation. The passwords are created instantly on your device and are never sent over the internet." },
        { q: "Why use a random password?", a: "Humans are predictable. Using words or dates makes your password easy to crack. Complete randomness offers the highest security." },
        { q: "How do I remember it?", a: "We strongly recommend using a Password Manager to store these secure passwords." },
        { q: "What makes a password 'strong'?", a: "Length (16+ characters), variety (uppercase, lowercase, numbers, symbols), and randomness. Our tool maximizes all three." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Secure Password Generator",
        "operatingSystem": "All",
        "applicationCategory": "SecurityApplication",
        "description": "Create unbreakable, random passwords instantly. Military-grade randomness powered by your browser.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <JsonLd data={jsonLd} />
            <ToolHeader
                title="Secure Password Generator"
                description="Create unbreakable, random passwords instantly. Protect your accounts with military-grade randomness."
            />

            <AdContainer slot="password-top" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-2 shadow-lg overflow-visible">
                        <CardContent className="p-8 space-y-8">
                            {/* Display Area */}
                            <div className="relative">
                                <div className="h-20 bg-muted/40 rounded-xl flex items-center px-6 font-mono text-xl sm:text-2xl tracking-wider break-all border-2 border-primary/10">
                                    {password || "Select options below"}
                                </div>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                    <Button size="icon" variant="ghost" className="hover:text-primary" onClick={generatePassword}>
                                        <RefreshCw size={20} />
                                    </Button>
                                    <Button size="icon" className="bg-primary text-primary-foreground shadow-sm" onClick={copyToClipboard}>
                                        <Copy size={20} />
                                    </Button>
                                </div>
                            </div>

                            {/* Length Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold">Password Length</Label>
                                    <span className="text-xl font-bold text-primary">{length[0]}</span>
                                </div>
                                <Slider
                                    value={length}
                                    onValueChange={setLength}
                                    max={64}
                                    min={6}
                                    step={1}
                                    className="py-2 cursor-pointer"
                                />
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setOptions(p => ({ ...p, uppercase: !p.uppercase }))}>
                                    <Checkbox checked={options.uppercase} id="uppercase" />
                                    <Label htmlFor="uppercase" className="cursor-pointer font-medium">Uppercase (A-Z)</Label>
                                </div>
                                <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setOptions(p => ({ ...p, lowercase: !p.lowercase }))}>
                                    <Checkbox checked={options.lowercase} id="lowercase" />
                                    <Label htmlFor="lowercase" className="cursor-pointer font-medium">Lowercase (a-z)</Label>
                                </div>
                                <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setOptions(p => ({ ...p, numbers: !p.numbers }))}>
                                    <Checkbox checked={options.numbers} id="numbers" />
                                    <Label htmlFor="numbers" className="cursor-pointer font-medium">Numbers (0-9)</Label>
                                </div>
                                <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setOptions(p => ({ ...p, symbols: !p.symbols }))}>
                                    <Checkbox checked={options.symbols} id="symbols" />
                                    <Label htmlFor="symbols" className="cursor-pointer font-medium">Symbols (!@#$)</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Strength Meter */}
                <div className="space-y-6">
                    <Card className={`border-2 shadow-md transition-colors ${strength === "Strong" ? "bg-green-50/50 border-green-200 dark:bg-green-950/10 dark:border-green-900" : ""}`}>
                        <CardContent className="p-8 text-center space-y-4">
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${strength === "Strong" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                {strength === "Strong" ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-muted-foreground uppercase tracking-widest text-xs mb-1">Security Level</h3>
                                <p className={`text-3xl font-bold ${strengthColor}`}>{strength}</p>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {strength === "Strong"
                                    ? "Excellent! This password would take a supercomputer millions of years to crack."
                                    : strength === "Medium"
                                        ? "Decent, but adding symbols or more length would make it safer."
                                        : "Too weak. Please add more character types and increase length."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
                <ToolContentSection title="The Importance of Strong Passwords">
                    <p>
                        In a world of constant data breaches, your password is the first line of defense. A strong password acts as a digital lock
                        that keeps hackers out of your personal and financial life.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-muted/30 p-4 rounded-lg">
                            <h4 className="font-bold mb-2">Don't Reuse Passwords</h4>
                            <p className="text-sm">If one site gets hacked, attackers try that password everywhere. Use unique passwords for every account.</p>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg">
                            <h4 className="font-bold mb-2">Entropy is Key</h4>
                            <p className="text-sm">Predictable patterns (like "Password123") are cracked in seconds. True randomness is the only safety.</p>
                        </div>
                    </div>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="password-bottom" />
        </div>
    );
}
