"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Label } from "@/components/sociials-ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Slider } from "@/components/sociials-ui/slider";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Plus, Minus, Settings2, Trash2, Copy, RefreshCw, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/sociials-ui/popover";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";

interface FlexItem {
    id: number;
    text: string;
    flexGrow: number;
    flexShrink: number;
    flexBasis: string;
    alignSelf: string;
    width: string;
    height: string;
}

export default function FlexboxPlaygroundPage() {
    // Parent Properties
    const [flexDirection, setFlexDirection] = useState("row");
    const [justifyContent, setJustifyContent] = useState("flex-start");
    const [alignItems, setAlignItems] = useState("stretch");
    const [alignContent, setAlignContent] = useState("normal");
    const [flexWrap, setFlexWrap] = useState("nowrap");
    const [gap, setGap] = useState([16]);

    // Items State
    const [items, setItems] = useState<FlexItem[]>([
        { id: 1, text: "1", flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", width: "100px", height: "100px" },
        { id: 2, text: "2", flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", width: "100px", height: "100px" },
        { id: 3, text: "3", flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", width: "100px", height: "100px" },
    ]);

    const addItem = () => {
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        setItems([...items, {
            id: newId,
            text: `${newId}`,
            flexGrow: 0,
            flexShrink: 1,
            flexBasis: "auto",
            alignSelf: "auto",
            width: "100px",
            height: "100px"
        }]);
    };

    const removeItem = () => {
        if (items.length > 0) {
            setItems(items.slice(0, -1));
        }
    };

    const updateItem = (id: number, key: keyof FlexItem, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [key]: value } : item));
    };

    const deleteItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const reset = () => {
        setFlexDirection("row");
        setJustifyContent("flex-start");
        setAlignItems("stretch");
        setAlignContent("normal");
        setFlexWrap("nowrap");
        setGap([16]);
        setItems([
            { id: 1, text: "1", flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", width: "100px", height: "100px" },
            { id: 2, text: "2", flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", width: "100px", height: "100px" },
            { id: 3, text: "3", flexGrow: 0, flexShrink: 1, flexBasis: "auto", alignSelf: "auto", width: "100px", height: "100px" },
        ]);
    };

    const generateCSS = () => {
        return `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  align-content: ${alignContent};
  flex-wrap: ${flexWrap};
  gap: ${gap[0]}px;
}

${items.map(item => `.item-${item.id} {
  flex-grow: ${item.flexGrow};
  flex-shrink: ${item.flexShrink};
  flex-basis: ${item.flexBasis};
  align-self: ${item.alignSelf};
  width: ${item.width};
  height: ${item.height};
}`).join('\n')}`;
    };

    const copyCSS = () => {
        navigator.clipboard.writeText(generateCSS());
        toast.success("CSS copied to clipboard!");
    };

    return (
        <div className="container px-4 py-8 m-auto max-w-[1400px]">
            <ToolHeader
                title="Advanced Flexbox Playground"
                description="Master CSS Flexbox with this powerful interactive layout generator."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
                {/* Visual Preview */}
                <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col gap-4">
                    <div className="bg-muted/30 rounded-xl border-dashed border-2 border-border p-4 relative h-[600px] overflow-auto">
                        <div
                            className="bg-background border w-full min-h-full rounded-lg transition-all duration-300"
                            style={{
                                display: 'flex',
                                flexDirection: flexDirection as any,
                                justifyContent: justifyContent,
                                alignItems: alignItems,
                                alignContent: alignContent,
                                flexWrap: flexWrap as any,
                                gap: `${gap[0]}px`,
                                padding: '24px'
                            }}
                        >
                            {items.map((item) => (
                                <Popover key={item.id}>
                                    <PopoverTrigger asChild>
                                        <div
                                            className="bg-primary/10 border-2 border-primary/20 hover:border-primary cursor-pointer rounded-xl flex items-center justify-center font-bold text-xl text-primary relative group transition-all"
                                            style={{
                                                flexGrow: item.flexGrow,
                                                flexShrink: item.flexShrink,
                                                flexBasis: item.flexBasis,
                                                alignSelf: item.alignSelf,
                                                width: item.width,
                                                height: item.height
                                            }}
                                        >
                                            <span className="z-10">{item.text}</span>
                                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Settings2 className="w-4 h-4 text-primary/50" />
                                            </div>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <h4 className="font-medium text-sm">Item {item.id} properties</h4>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => deleteItem(item.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">flex-grow</Label>
                                                    <Input type="number" value={item.flexGrow} onChange={(e) => updateItem(item.id, 'flexGrow', Number(e.target.value))} className="h-8" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">flex-shrink</Label>
                                                    <Input type="number" value={item.flexShrink} onChange={(e) => updateItem(item.id, 'flexShrink', Number(e.target.value))} className="h-8" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">flex-basis</Label>
                                                    <Input value={item.flexBasis} onChange={(e) => updateItem(item.id, 'flexBasis', e.target.value)} className="h-8" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">align-self</Label>
                                                    <Select value={item.alignSelf} onValueChange={(val) => updateItem(item.id, 'alignSelf', val)}>
                                                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="auto">auto</SelectItem>
                                                            <SelectItem value="flex-start">flex-start</SelectItem>
                                                            <SelectItem value="flex-end">flex-end</SelectItem>
                                                            <SelectItem value="center">center</SelectItem>
                                                            <SelectItem value="stretch">stretch</SelectItem>
                                                            <SelectItem value="baseline">baseline</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">width</Label>
                                                    <Input value={item.width} onChange={(e) => updateItem(item.id, 'width', e.target.value)} className="h-8" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">height</Label>
                                                    <Input value={item.height} onChange={(e) => updateItem(item.id, 'height', e.target.value)} className="h-8" />
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ))}
                        </div>
                    </div>
                    {/* CSS Output */}
                    <Card>
                        <CardContent className="p-0 relative bg-slate-900 text-slate-100 rounded-lg overflow-hidden group">
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" onClick={copyCSS}>
                                    <Copy className="h-3 w-3 mr-2" /> Copy CSS
                                </Button>
                            </div>
                            <pre className="p-4 font-mono text-sm overflow-x-auto max-h-[200px]">
                                {generateCSS()}
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Controls */}
                <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
                    <Card className="border-0 ring-1 ring-border/50 sticky top-4">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b">
                                <h3 className="font-semibold">Container Properties</h3>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="outline" onClick={reset} title="Reset">
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" onClick={removeItem} disabled={items.length === 0} title="Remove Item">
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" onClick={addItem} title="Add Item">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>flex-direction</Label>
                                    <Select value={flexDirection} onValueChange={setFlexDirection}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="row">row</SelectItem>
                                            <SelectItem value="row-reverse">row-reverse</SelectItem>
                                            <SelectItem value="column">column</SelectItem>
                                            <SelectItem value="column-reverse">column-reverse</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>flex-wrap</Label>
                                    <Select value={flexWrap} onValueChange={setFlexWrap}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nowrap">nowrap</SelectItem>
                                            <SelectItem value="wrap">wrap</SelectItem>
                                            <SelectItem value="wrap-reverse">wrap-reverse</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>justify-content</Label>
                                    <Select value={justifyContent} onValueChange={setJustifyContent}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="flex-start">flex-start</SelectItem>
                                            <SelectItem value="flex-end">flex-end</SelectItem>
                                            <SelectItem value="center">center</SelectItem>
                                            <SelectItem value="space-between">space-between</SelectItem>
                                            <SelectItem value="space-around">space-around</SelectItem>
                                            <SelectItem value="space-evenly">space-evenly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>align-items</Label>
                                    <Select value={alignItems} onValueChange={setAlignItems}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="stretch">stretch</SelectItem>
                                            <SelectItem value="flex-start">flex-start</SelectItem>
                                            <SelectItem value="flex-end">flex-end</SelectItem>
                                            <SelectItem value="center">center</SelectItem>
                                            <SelectItem value="baseline">baseline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>align-content</Label>
                                    <Select value={alignContent} onValueChange={setAlignContent}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="normal">normal</SelectItem>
                                            <SelectItem value="flex-start">flex-start</SelectItem>
                                            <SelectItem value="flex-end">flex-end</SelectItem>
                                            <SelectItem value="center">center</SelectItem>
                                            <SelectItem value="space-between">space-between</SelectItem>
                                            <SelectItem value="space-around">space-around</SelectItem>
                                            <SelectItem value="stretch">stretch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex justify-between">
                                        <Label>gap</Label>
                                        <span className="font-mono text-muted-foreground">{gap[0]}px</span>
                                    </div>
                                    <Slider value={gap} onValueChange={setGap} min={0} max={64} step={4} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
