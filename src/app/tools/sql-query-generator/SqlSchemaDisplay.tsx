"use client";

import { Button } from "@/components/sociials-ui/button";
import { Label } from "@/components/sociials-ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { Badge } from "@/components/sociials-ui/badge";
import { RefreshCw, Database } from "lucide-react";
import { TableSchema } from "./types";

interface SqlSchemaDisplayProps {
    schemas: Record<string, TableSchema>;
    dbState: Record<string, any[]>;
    onReset: () => void;
}

export function SqlSchemaDisplay({ schemas, dbState, onReset }: SqlSchemaDisplayProps) {
    return (
        <div className="pt-8">
            <div className="flex items-center justify-between mb-4">
                <Label className="text-sm text-foreground font-bold flex items-center gap-2 bg-background px-3 py-1 rounded-full border">
                    <Database className="w-4 h-4 text-blue-500" /> Current Database State
                </Label>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 text-xs gap-2" onClick={onReset} title="Reset Database">
                        <RefreshCw className="h-3 w-3" /> Reset Data
                    </Button>
                </div>
            </div>

            <Tabs defaultValue={Object.keys(schemas)[0]} className="w-full">
                <TabsList className="bg-transparent p-0 border-b w-full justify-start h-auto rounded-none mb-4 gap-4 overflow-x-auto">
                    {Object.keys(schemas).map(t => (
                        <TabsTrigger
                            key={t}
                            value={t}
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 font-semibold text-muted-foreground data-[state=active]:text-foreground relative"
                        >
                            <span className="flex items-center gap-2">
                                {t}
                                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 min-w-[20px]">{dbState[t]?.length || 0}</Badge>
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.keys(schemas).map(table => (
                    <TabsContent key={table} value={table} className="mt-0 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="border rounded-xl overflow-hidden bg-background">
                            <div className="overflow-x-auto max-h-[300px]">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs bg-muted/40 text-muted-foreground sticky top-0 uppercase tracking-wider">
                                        <tr>
                                            {schemas[table].columns.map(c => (
                                                <th key={c.name} className="px-4 py-3 font-semibold border-b">
                                                    <div className="flex flex-col">
                                                        <span>{c.name}</span>
                                                        <span className="text-[9px] opacity-70 font-normal normal-case">{c.type}</span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {dbState[table]?.map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-muted/10">
                                                {schemas[table].columns.map(c => (
                                                    <td key={c.name} className="px-4 py-2 font-mono text-xs text-muted-foreground">{String(row[c.name])}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
