"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { ToolContentSection, ToolFAQ } from "@/components/sociials-tools/ToolContent";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Slider } from "@/components/sociials-ui/slider";
import { Label } from "@/components/sociials-ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { Switch } from "@/components/sociials-ui/switch";
import { Copy, RefreshCw, Check, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { v1, v3, v4, v5, validate } from 'uuid';

export default function UUIDGeneratorPage() {
    const [count, setCount] = useState(1);
    const [uuids, setUuids] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    // Configuration State
    const [version, setVersion] = useState("v4");
    const [namespace, setNamespace] = useState("");
    const [name, setName] = useState("");

    // Formatting State
    const [uppercase, setUppercase] = useState(false);
    const [hyphens, setHyphens] = useState(true);
    const [braces, setBraces] = useState(false);

    // Pre-defined namespaces for convenience
    const DNS_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    const URL_NAMESPACE = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";

    const generate = () => {
        try {
            const newUuids: string[] = [];

            for (let i = 0; i < count; i++) {
                let uuid = "";

                switch (version) {
                    case "v1":
                        uuid = v1();
                        break;
                    case "v3":
                        if (!name) throw new Error("Name is required for v3 UUIDs");
                        if (!namespace || !validate(namespace)) throw new Error("Valid Namespace UUID is required for v3");
                        uuid = v3(name, namespace);
                        break;
                    case "v4":
                        uuid = v4();
                        break;
                    case "v5":
                        if (!name) throw new Error("Name is required for v5 UUIDs");
                        if (!namespace || !validate(namespace)) throw new Error("Valid Namespace UUID is required for v5");
                        uuid = v5(name, namespace);
                        break;
                }

                // Apply Formatting
                if (!hyphens) uuid = uuid.replace(/-/g, "");
                if (uppercase) uuid = uuid.toUpperCase();
                if (braces) uuid = `{${uuid}}`;

                newUuids.push(uuid);
            }

            setUuids(newUuids);
            setCopied(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to generate UUIDs");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(uuids.join("\n"));
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNamespacePreset = (preset: string) => {
        setNamespace(preset);
    };

    return (
        <div className="container px-6 py-12 m-auto">
            <ToolHeader
                title="UUID Generator"
                description="Generate standard-compliant UUIDs (Versions 1, 3, 4, 5) with custom formatting options for developers."
            />

            <div className="max-w-4xl mx-auto mb-16 space-y-8">
                <Card className="border-2">
                    <CardContent className="p-8 space-y-8">
                        {/* Configuration Controls */}
                        <div className="space-y-6">
                            <Tabs defaultValue="v4" onValueChange={setVersion} className="w-full">
                                <TabsList className="grid w-full grid-cols-4 mb-4">
                                    <TabsTrigger value="v1">Version 1</TabsTrigger>
                                    <TabsTrigger value="v3">Version 3</TabsTrigger>
                                    <TabsTrigger value="v4">Version 4</TabsTrigger>
                                    <TabsTrigger value="v5">Version 5</TabsTrigger>
                                </TabsList>

                                <TabsContent value="v1">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Timestamp-based UUID. Uses the current time and MAC address (simulated).
                                    </p>
                                </TabsContent>
                                <TabsContent value="v3">
                                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                        <p className="text-sm text-muted-foreground">
                                            MD5 hash-based UUID. Requires a namespace and a name.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Namespace UUID</Label>
                                                <Input
                                                    value={namespace}
                                                    onChange={(e) => setNamespace(e.target.value)}
                                                    placeholder="e.g. 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                                                />
                                                <div className="flex gap-2 text-xs">
                                                    <button onClick={() => handleNamespacePreset(DNS_NAMESPACE)} className="underline hover:text-primary">Use DNS</button>
                                                    <button onClick={() => handleNamespacePreset(URL_NAMESPACE)} className="underline hover:text-primary">Use URL</button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="v4">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Randomly generated UUID. The most common and secure choice for general use.
                                    </p>
                                </TabsContent>
                                <TabsContent value="v5">
                                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                        <p className="text-sm text-muted-foreground">
                                            SHA-1 hash-based UUID. Requires a namespace and a name. Superior collision resistance to v3.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Namespace UUID</Label>
                                                <Input
                                                    value={namespace}
                                                    onChange={(e) => setNamespace(e.target.value)}
                                                    placeholder="e.g. 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                                                />
                                                <div className="flex gap-2 text-xs">
                                                    <button onClick={() => handleNamespacePreset(DNS_NAMESPACE)} className="underline hover:text-primary">Use DNS</button>
                                                    <button onClick={() => handleNamespacePreset(URL_NAMESPACE)} className="underline hover:text-primary">Use URL</button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                                <div className="space-y-4">
                                    <Label className="text-base flex items-center gap-2"><Settings2 size={16} /> Formatting</Label>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="uppercase" className="font-normal cursor-pointer">Uppercase</Label>
                                            <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="hyphens" className="font-normal cursor-pointer">Hyphens</Label>
                                            <Switch id="hyphens" checked={hyphens} onCheckedChange={setHyphens} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="braces" className="font-normal cursor-pointer">Wrap in Braces {'{}'}</Label>
                                            <Switch id="braces" checked={braces} onCheckedChange={setBraces} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Label className="text-base">Quantity: {count}</Label>
                                    </div>
                                    <Slider
                                        value={[count]}
                                        onValueChange={(vals) => setCount(vals[0])}
                                        min={1} max={100} step={1}
                                        className="py-4"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button size="lg" className="h-14 flex-1 text-lg font-bold" onClick={generate}>
                                <RefreshCw className="mr-2" /> Generate {version.toUpperCase()}
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 w-14 p-0 shrink-0" onClick={copyToClipboard} disabled={uuids.length === 0}>
                                {copied ? <Check /> : <Copy />}
                            </Button>
                        </div>

                        {/* Output */}
                        <div className="bg-muted rounded-xl p-6 font-mono text-sm max-h-[400px] overflow-y-auto border border-border/50 relative group">
                            {uuids.length > 0 ? (
                                <pre className="whitespace-pre-wrap break-all">{uuids.join("\n")}</pre>
                            ) : (
                                <p className="text-muted-foreground italic text-center py-8">Click generate to create UUIDs</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <ToolContentSection title="Understanding UUID Versions">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">Version 1 (Time-based)</h3>
                            <p className="text-sm text-muted-foreground">Generated from the current time and the MAC address of the computer generating it. Helpful when you need to sort IDs by creation time.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">Version 3 (MD5 Namespaced)</h3>
                            <p className="text-sm text-muted-foreground">Generated from a namespace identifier and a name using MD5 hashing. Same namespace + same name = same UUID.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">Version 4 (Random)</h3>
                            <p className="text-sm text-muted-foreground">Generated using random numbers. The most common version. Probability of collision is astronomically low.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg">Version 5 (SHA-1 Namespaced)</h3>
                            <p className="text-sm text-muted-foreground">Similar to v3 but uses SHA-1 hashing, which is stronger. Preferred over v3 for new applications requiring name-based IDs.</p>
                        </div>
                    </div>
                </ToolContentSection>

                <ToolFAQ questions={[
                    { q: "Are these UUIDs unique?", a: "Yes, v4 UUIDs are practically unique. v1 depends on time/MAC. v3/v5 are unique for their specific inputs." },
                    { q: "Which version should I use?", a: "Use v4 for most database/key purposes. Use v5 if you need deterministic IDs based on a name (like a URL)." }
                ]} />
            </div>
        </div>
    );
}
