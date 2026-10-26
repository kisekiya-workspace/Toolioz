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
        { q: "Is this generator secure?", a: "Each character uses Math.random, not crypto.getRandomValues. The password is not uploaded." },
        { q: "Why use a random password?", a: "A password built from a word or a date is easier to guess. This page still uses Math.random, which is not a cryptographic generator." },
        { q: "How is the password stored?", a: "The page does not save the password. A password manager can store the copied string." },
        { q: "What does the Strong label mean?", a: "Strong means the length is over 12 and both numbers and symbols are checked. It is not a crack-time estimate." }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Password Generator",
        "operatingSystem": "All",
        "applicationCategory": "SecurityApplication",
        "description": "Builds a password with Math.random from the selected sets. The default length is 16. The password is not uploaded.",
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
                description="Builds a password with Math.random from the selected sets. The default length is 16."
            />

            <AdContainer slot="password-top" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-2 overflow-visible">
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
                                    <Button size="icon" className="bg-primary text-primary-foreground" onClick={copyToClipboard}>
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
                    <Card className={`border-2 transition-colors ${strength === "Strong" ? "bg-green-50/50 border-green-200 dark:bg-green-950/10 dark:border-green-900" : ""}`}>
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
                                    ? "Strong means the length is over 12 and both numbers and symbols are on. It is not a crack-time estimate."
                                    : strength === "Medium"
                                        ? "Medium means the length is over 8 and the Strong rule is not met."
                                        : "Weak means the length is 8 or less."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
                <ToolContentSection title="How the password is built">
                    <p>
                        Each character is charset.charAt(Math.floor(Math.random() * charset.length)). The sets are 26 uppercase letters, 26 lowercase letters, 10 digits, and 30 symbols. The default length is 16. The page does not call crypto.getRandomValues.
                    </p>
                </ToolContentSection>

                <ToolFAQ questions={faq} />
            </div>

            <AdContainer slot="password-bottom" />
        </div>
    );
}
