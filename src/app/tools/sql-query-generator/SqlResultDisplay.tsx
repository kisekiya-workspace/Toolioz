"use client";

import { Card, CardHeader, CardTitle } from "@/components/sociials-ui/card";
import { Table as TableIcon } from "lucide-react";

interface SqlResultDisplayProps {
    result: any[] | null;
    mode: string;
}

export function SqlResultDisplay({ result, mode }: SqlResultDisplayProps) {
    if (mode !== "SELECT" || !result) return null;

    return (
        <Card className="overflow-hidden border-2 border-primary/10">
            <CardHeader className="py-2 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-muted-foreground" />
                    Result Set <span className="text-xs font-normal text-muted-foreground">({result.length} rows)</span>
                </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground bg-muted/20 uppercase sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                            {result.length > 0 ? Object.keys(result[0]).map(k => <th key={k} className="px-4 py-3 font-semibold tracking-wider border-b">{k}</th>) : <th className="px-4 py-2">Result</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {result.length > 0 ? result.map((row, i) => (
                            <tr key={i} className="hover:bg-muted/30 transition-colors group">
                                {Object.values(row).map((val: any, j) => (
                                    <td key={j} className="px-4 py-2 font-mono text-xs text-foreground/80 group-hover:text-foreground">{String(val)}</td>
                                ))}
                            </tr>
                        )) : (
                            <tr><td className="px-4 py-12 text-center text-muted-foreground italic" colSpan={99}>Query returned no results.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
