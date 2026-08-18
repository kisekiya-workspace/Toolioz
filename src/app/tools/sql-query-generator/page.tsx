"use client";

import { useState, useEffect } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/sociials-ui/select";
import { Checkbox } from "@/components/sociials-ui/checkbox";
import { Copy, AlertTriangle, Plus, Trash2, Play, Table as TableIcon, LayoutList, Terminal, Info, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/sociials-ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/sociials-ui/alert";


// New Components
import { TableSchema, Column } from "./types";
import { SqlSchemaDisplay } from "./SqlSchemaDisplay";
import { SqlResultDisplay } from "./SqlResultDisplay";
import { SqlCheatSheet } from "./SqlCheatSheet";

// --- Mock Data & Schema ---

const INITIAL_SCHEMAS: Record<string, TableSchema> = {
    users: {
        name: "users",
        columns: [
            { name: "id", type: "INT" },
            { name: "name", type: "VARCHAR" },
            { name: "email", type: "VARCHAR" },
            { name: "age", type: "INT" },
            { name: "role", type: "VARCHAR" }
        ]
    },
    orders: {
        name: "orders",
        columns: [
            { name: "id", type: "INT" },
            { name: "user_id", type: "INT" },
            { name: "amount", type: "DECIMAL" },
            { name: "item", type: "VARCHAR" },
            { name: "status", type: "VARCHAR" }
        ]
    }
};

const INITIAL_DATA = {
    users: [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 28, role: "Admin" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", age: 34, role: "User" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", age: 22, role: "User" },
        { id: 4, name: "Diana Prince", email: "diana@example.com", age: 30, role: "Editor" },
    ],
    orders: [
        { id: 101, user_id: 1, amount: 250.50, item: "Laptop Stand", status: "Delivered" },
        { id: 102, user_id: 2, amount: 15.99, item: "Mouse Pad", status: "Shipped" },
        { id: 103, user_id: 1, amount: 1200.00, item: "Monitor", status: "Processing" },
        { id: 104, user_id: 3, amount: 45.00, item: "Keyboard", status: "Delivered" },
        { id: 105, user_id: 99, amount: 500.00, item: "Ghost Order", status: "Cancelled" },
    ]
};

type Mode = "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "CREATE" | "DROP" | "TRUNCATE";

export default function SqlQueryGeneratorPage() {
    const [mode, setMode] = useState<Mode>("SELECT");

    // Database State
    const [schemas, setSchemas] = useState<Record<string, TableSchema>>(INITIAL_SCHEMAS);
    const [dbState, setDbState] = useState<any>(INITIAL_DATA);

    // Query Config
    const [selectedTable, setSelectedTable] = useState("users");
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(true);
    const [whereClauses, setWhereClauses] = useState<{ col: string, op: string, val: string, table?: string }[]>([]);
    const [joinConfig, setJoinConfig] = useState<{ enabled: boolean, type: string, targetTable: string, onLeft: string, onRight: string }>({
        enabled: false,
        type: "INNER JOIN",
        targetTable: "orders",
        onLeft: "users.id",
        onRight: "orders.user_id"
    });

    // Mutation Inputs
    const [insertValues, setInsertValues] = useState<Record<string, string>>({});
    const [updateValues, setUpdateValues] = useState<Record<string, string>>({});

    // Create Table Inputs
    const [newTableName, setNewTableName] = useState("");
    const [newTableColumns, setNewTableColumns] = useState<Column[]>([{ name: "id", type: "INT" }]);

    // Results
    const [lastResult, setLastResult] = useState<any[] | null>(null);
    const [sqlQuery, setSqlQuery] = useState("");
    const [executionMessage, setExecutionMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    // Reset when switching modes/tables
    useEffect(() => {
        setWhereClauses([]);
        setInsertValues({});
        setUpdateValues({});
        setExecutionMessage(null);
        setLastResult(null);
        if (mode === "SELECT") {
            setSelectAll(true);
            setSelectedColumns([]);
        }
        if (!schemas[selectedTable] && mode !== 'CREATE') {
            const firstAvailable = Object.keys(schemas)[0];
            if (firstAvailable) setSelectedTable(firstAvailable);
        }
    }, [mode, selectedTable, schemas]);

    // --- LOGIC ---

    // 1. Generate SQL
    useEffect(() => {
        let sql = "";
        const schema = schemas[selectedTable];

        const formatVal = (val: string, type?: string) => {
            const isNum = type?.includes("INT") || type?.includes("DECIMAL");
            return isNum ? (val || "0") : `'${val}'`;
        };

        const buildWhere = () => {
            if (whereClauses.length === 0) return "";
            const clauses = whereClauses.map(w => {
                let colType = "VARCHAR";
                const table = w.table || selectedTable;
                const col = schemas[table]?.columns.find(c => c.name === w.col);
                if (col) colType = col.type;
                const colRef = w.table ? `${w.table}.${w.col}` : w.col;
                return `${colRef} ${w.op} ${formatVal(w.val, colType)}`;
            });
            return ` WHERE ${clauses.join(" AND ")}`;
        };

        if (mode === "SELECT") {
            if (!schema) return;
            let cols = "*";
            if (!selectAll && selectedColumns.length > 0) cols = selectedColumns.join(", ");
            sql = `SELECT ${cols} FROM ${selectedTable}`;
            if (joinConfig.enabled) {
                sql += ` ${joinConfig.type} ${joinConfig.targetTable} ON ${joinConfig.onLeft} = ${joinConfig.onRight}`;
            }
            sql += buildWhere();
        }
        else if (mode === "INSERT") {
            if (!schema) return;
            const keys = Object.keys(insertValues).filter(k => insertValues[k]);
            const vals = keys.map(k => {
                const col = schema.columns.find(c => c.name === k);
                return formatVal(insertValues[k], col?.type);
            });
            sql = `INSERT INTO ${selectedTable} (${keys.join(", ")}) VALUES (${vals.join(", ")})`;
        }
        else if (mode === "UPDATE") {
            if (!schema) return;
            const updates = Object.keys(updateValues).filter(k => updateValues[k]).map(k => {
                const col = schema.columns.find(c => c.name === k);
                return `${k} = ${formatVal(updateValues[k], col?.type)}`;
            });
            sql = `UPDATE ${selectedTable} SET ${updates.join(", ")}`;
            sql += buildWhere();
        }
        else if (mode === "DELETE") {
            sql = `DELETE FROM ${selectedTable}`;
            sql += buildWhere();
        }
        else if (mode === "TRUNCATE") {
            sql = `TRUNCATE TABLE ${selectedTable}`;
        }
        else if (mode === "DROP") {
            sql = `DROP TABLE ${selectedTable}`;
        }
        else if (mode === "CREATE") {
            const cols = newTableColumns.map(c => `${c.name} ${c.type}`).join(", ");
            sql = `CREATE TABLE ${newTableName || 'new_table'} (${cols})`;
        }

        setSqlQuery(sql + (sql ? ";" : ""));
    }, [mode, selectedTable, selectAll, selectedColumns, whereClauses, joinConfig, insertValues, updateValues, schemas, newTableName, newTableColumns]);

    // 2. Validate & Execute
    const runSimulation = () => {
        try {
            let result: any[] = [];
            let msg = "Query executed successfully.";
            let newDb = { ...dbState };
            let newSchemas = { ...schemas };

            // Helper: Check WHERE conditions
            const checkCondition = (row: any, tableName: string) => {
                return whereClauses.every(w => {
                    if (w.table && w.table !== tableName) return true;
                    if (!w.table && !(w.col in row)) return true;
                    const val = row[w.col];
                    const target = w.val;
                    if (w.op === "=") return val == target;
                    if (w.op === ">") return val > target;
                    if (w.op === "<") return val < target;
                    if (w.op === "LIKE") return String(val).includes(target);
                    return true;
                });
            };

            // VALIDATION: Foreign Keys, Types, Duplicates
            if (mode === "INSERT" || mode === "UPDATE") {
                const schema = schemas[selectedTable];
                const vals = mode === "INSERT" ? insertValues : updateValues;

                // Duplicate ID Check (Primary Key Simulation)
                if (mode === "INSERT" && vals["id"] && schema.columns.some(c => c.name === "id")) {
                    const exists = dbState[selectedTable].some((r: any) => r.id == vals["id"]);
                    if (exists) throw new Error(`Duplicate entry '${vals["id"]}' for key 'PRIMARY' (id).`);
                }

                for (const [key, val] of Object.entries(vals)) {
                    if (!val) continue;
                    const col = schema.columns.find(c => c.name === key);

                    // Type Check
                    if (col?.type === "INT" && isNaN(Number(val))) throw new Error(`Invalid value for '${key}': Expected INT, got '${val}'`);
                    if (col?.type === "DECIMAL" && isNaN(Number(val))) throw new Error(`Invalid value for '${key}': Expected DECIMAL, got '${val}'`);

                    // FK Check (Naive implementation looking for _id)
                    if (key.endsWith("_id")) {
                        const targetTable = key.replace("_id", "") + "s"; // e.g. user_id -> users
                        if (schemas[targetTable]) {
                            const exists = dbState[targetTable].some((r: any) => r.id == val);
                            if (!exists) throw new Error(`Foreign Key Constraint Failed: Key (${key})=(${val}) is missing in table '${targetTable}'.`);
                        }
                    }
                }
            }
            if ((mode === "UPDATE" || mode === "DELETE") && whereClauses.length === 0) {
                msg = `Warning: ${mode} executed without a WHERE clause affected ALL ${dbState[selectedTable].length} rows.`;
            }

            // DROP Check: Foreign Key Dependencies
            if (mode === "DROP") {
                const tableRef = selectedTable.slice(0, -1) + "_id"; // e.g. users -> user_id
                const dependingTable = Object.keys(schemas).find(t =>
                    t !== selectedTable && schemas[t].columns.some(c => c.name === tableRef)
                );
                if (dependingTable) {
                    throw new Error(`Cannot Drop Table '${selectedTable}': it is referenced by foreign key '${tableRef}' in table '${dependingTable}'.`);
                }
            }

            // EXECUTION
            if (mode === "SELECT") {
                let sourceData = [...dbState[selectedTable]];
                if (joinConfig.enabled) {
                    const targetData = dbState[joinConfig.targetTable];
                    const joined: any[] = [];
                    const [leftTable, leftCol] = joinConfig.onLeft.split('.');
                    const [rightTable, rightCol] = joinConfig.onRight.split('.');
                    sourceData.forEach((leftRow: any) => {
                        const matches = targetData.filter((rightRow: any) => String(leftRow[leftCol]) === String(rightRow[rightCol]));
                        if (joinConfig.type === "INNER JOIN") {
                            matches.forEach((m: any) => joined.push({ ...leftRow, ...m }));
                        } else if (joinConfig.type === "LEFT JOIN") {
                            if (matches.length > 0) matches.forEach((m: any) => joined.push({ ...leftRow, ...m }));
                            else joined.push({ ...leftRow, ...Object.fromEntries(Object.keys(targetData[0] || {}).map(k => [k, null])) });
                        }
                    });
                    sourceData = joined;
                }
                result = sourceData.filter(row => checkCondition(row, selectedTable));
                // Projection
                if (!selectAll && selectedColumns.length > 0 && !joinConfig.enabled) {
                    result = result.map(row => {
                        const newRow: any = {};
                        selectedColumns.forEach(c => newRow[c] = row[c]);
                        return newRow;
                    });
                }
                msg = `✔ SELECT successful. Retrieved ${result.length} rows.`;
            }
            else if (mode === "INSERT") {
                let newRow: any = { ...insertValues };
                // Auto-generate ID if not provided (simple max + 1)
                if (!newRow.id && schemas[selectedTable].columns.some(c => c.name === 'id' && c.type === 'INT')) {
                    const maxId = dbState[selectedTable].reduce((max: number, r: any) => Math.max(max, parseInt(r.id) || 0), 0);
                    newRow.id = maxId + 1;
                }

                schemas[selectedTable].columns.forEach(col => {
                    if (col.type === "INT") newRow[col.name] = parseInt(newRow[col.name]);
                    if (col.type === "DECIMAL") newRow[col.name] = parseFloat(newRow[col.name]);
                });
                newDb[selectedTable] = [...newDb[selectedTable], newRow];
                msg = "✔ 1 Row inserted successfully.";
            }
            else if (mode === "UPDATE") {
                let count = 0;
                newDb[selectedTable] = newDb[selectedTable].map((row: any) => {
                    if (checkCondition(row, selectedTable)) {
                        count++;
                        return { ...row, ...updateValues };
                    }
                    return row;
                });
                msg = `✔ Updated ${count} rows.`;
            }
            else if (mode === "DELETE") {
                const initial = newDb[selectedTable].length;
                newDb[selectedTable] = newDb[selectedTable].filter((row: any) => !checkCondition(row, selectedTable));
                msg = `✔ Deleted ${initial - newDb[selectedTable].length} rows.`;
            }
            else if (mode === "TRUNCATE") {
                newDb[selectedTable] = [];
                msg = `✔ Table '${selectedTable}' was truncated.`;
            }
            else if (mode === "DROP") {
                delete newDb[selectedTable];
                delete newSchemas[selectedTable];
                msg = `✔ Table '${selectedTable}' was dropped.`;
            }
            else if (mode === "CREATE") {
                if (!newTableName) throw new Error("Table name is required");
                if (schemas[newTableName]) throw new Error("Table already exists");
                newSchemas[newTableName] = { name: newTableName, columns: newTableColumns };
                newDb[newTableName] = [];
                msg = `✔ Table '${newTableName}' created successfully.`;
                setSelectedTable(newTableName);
            }

            setSchemas(newSchemas);
            setDbState(newDb);
            setLastResult(mode === "SELECT" ? result : null);
            setExecutionMessage({ type: 'success', text: msg });

        } catch (e: any) {
            setExecutionMessage({ type: 'error', text: e.message });
        }
    };

    const resetDb = () => {
        setSchemas(INITIAL_SCHEMAS);
        setDbState(INITIAL_DATA);
        setExecutionMessage({ type: 'info', text: "Database reset to initial state." });
        setLastResult(null);
        setSelectedTable("users");
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-[1400px]">
            <ToolHeader
                title="Interactive SQL Simulator"
                description="Simulate real SQL queries with JOINS and DDL commands on a live mock database."
            />

            <Alert className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">Browser-Based Simulation</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                    This environment simulates a SQL database entirely in your browser using JavaScript.
                    Data is strictly local, temporary, and resets on page reload.
                    It validates basic types (INT, DECIMAL) and simple constraints to help you learn SQL safely.
                </AlertDescription>
            </Alert>

            <div className="grid lg:grid-cols-12 gap-8 mb-16">
                {/* LEFT: Controls */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="border-0 shadow-lg ring-1 ring-border/50 h-full">
                        <CardHeader className="pb-4 border-b bg-muted/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-muted-foreground" />
                                    <CardTitle className="text-lg">Query Builder</CardTitle>
                                </div>
                                {mode !== 'CREATE' && (
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs text-muted-foreground">Target:</Label>
                                        <Select value={selectedTable} onValueChange={setSelectedTable}>
                                            <SelectTrigger className="w-[120px] h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(schemas).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Mode Select */}
                            <div className="grid grid-cols-4 gap-2">
                                {(["SELECT", "INSERT", "UPDATE", "DELETE"] as Mode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`text-xs font-semibold py-2 rounded-md transition-all border ${mode === m ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground hover:bg-muted border-transparent"}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {(["CREATE", "DROP", "TRUNCATE"] as Mode[]).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`text-xs font-semibold py-2 rounded-md transition-all border ${mode === m ? "bg-slate-800 text-white border-slate-900" : "bg-muted/30 text-muted-foreground hover:bg-muted border-transparent"}`}
                                    >
                                        {m} TABLE
                                    </button>
                                ))}
                            </div>

                            <div className="border rounded-xl p-4 bg-muted/10 space-y-4">
                                {/* CREATE TABLE UI */}
                                {mode === "CREATE" && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">New Table Name</Label>
                                            <Input value={newTableName} onChange={(e) => setNewTableName(e.target.value)} placeholder="e.g. products" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Columns</Label>
                                                <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => setNewTableColumns([...newTableColumns, { name: "", type: "VARCHAR" }])}><Plus className="w-3 h-3 mr-1" />Add Column</Button>
                                            </div>
                                            <div className="space-y-2 max-h-[250px] overflow-auto pr-1">
                                                {newTableColumns.map((c, i) => (
                                                    <div key={i} className="flex gap-2 items-center">
                                                        <div className="grid grid-cols-5 gap-2 flex-1">
                                                            <Input placeholder="Column Name" value={c.name} onChange={(e) => {
                                                                const n = [...newTableColumns]; n[i].name = e.target.value; setNewTableColumns(n);
                                                            }} className="col-span-3 h-8 text-xs" />
                                                            <Select value={c.type} onValueChange={(v) => {
                                                                const n = [...newTableColumns]; n[i].type = v; setNewTableColumns(n);
                                                            }}>
                                                                <SelectTrigger className="col-span-2 h-8 text-xs"><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="INT">INT</SelectItem>
                                                                    <SelectItem value="VARCHAR">VARCHAR</SelectItem>
                                                                    <SelectItem value="DECIMAL">DECIMAL</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setNewTableColumns(newTableColumns.filter((_, idx) => idx !== i))}><Trash2 className="w-4 h-4" /></Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SELECT: Joins & Columns */}
                                {mode === "SELECT" && schemas[selectedTable] && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/10 p-2 rounded-md">
                                            <Checkbox id="join" checked={joinConfig.enabled} onCheckedChange={(c) => setJoinConfig({ ...joinConfig, enabled: !!c })} />
                                            <label htmlFor="join" className="text-sm font-medium cursor-pointer">Enable JOIN Query</label>
                                        </div>

                                        {joinConfig.enabled && (
                                            <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg space-y-3 border border-blue-100 dark:border-blue-900/20">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Select value={joinConfig.type} onValueChange={(v) => setJoinConfig({ ...joinConfig, type: v })}>
                                                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="INNER JOIN">INNER JOIN</SelectItem>
                                                            <SelectItem value="LEFT JOIN">LEFT JOIN</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Select value={joinConfig.targetTable} onValueChange={(v) => setJoinConfig({ ...joinConfig, targetTable: v })}>
                                                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {Object.keys(schemas).filter(t => t !== selectedTable).map(t => (
                                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                                                    <span className="font-mono bg-muted px-1 rounded">{joinConfig.onLeft}</span>
                                                    <span>=</span>
                                                    <span className="font-mono bg-muted px-1 rounded">{joinConfig.onRight}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Columns</Label>
                                                <button className="text-[10px] text-blue-600 hover:underline" onClick={() => { setSelectAll(true); setSelectedColumns([]); }}>Select All</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge
                                                    variant={selectAll ? "default" : "outline"}
                                                    className={`cursor-pointer transition-colors ${selectAll ? "hover:bg-primary/90" : "hover:bg-muted"}`}
                                                    onClick={() => setSelectAll(!selectAll)}
                                                >
                                                    * (All)
                                                </Badge>
                                                {!joinConfig.enabled && schemas[selectedTable]?.columns.map(c => (
                                                    <Badge
                                                        key={c.name}
                                                        variant={selectedColumns.includes(c.name) && !selectAll ? "default" : "outline"}
                                                        className="cursor-pointer transition-colors"
                                                        onClick={() => {
                                                            setSelectAll(false);
                                                            setSelectedColumns(prev => prev.includes(c.name) ? prev.filter(x => x !== c.name) : [...prev, c.name]);
                                                        }}
                                                    >
                                                        {c.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* INSERT / UPDATE Inputs */}
                                {(mode === "INSERT" || mode === "UPDATE") && schemas[selectedTable] && (
                                    <div className="space-y-3 animate-in fade-in duration-300">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{mode === "INSERT" ? "Values to Insert" : "New Values (SET)"}</Label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {schemas[selectedTable].columns.map(c => {
                                                if (c.name === 'id' && mode === 'INSERT') return null; // Hide ID processing for insert as it might be auto-gen, or optional
                                                return (
                                                    <div key={c.name} className="grid grid-cols-3 gap-2 items-center">
                                                        <Label className="text-xs text-muted-foreground text-right truncate" title={c.name}>{c.name} <span className="text-[10px] opacity-70">({c.type})</span></Label>
                                                        <Input
                                                            placeholder="Value"
                                                            className="col-span-2 h-8 text-xs"
                                                            onChange={(e) => {
                                                                const setter = mode === "INSERT" ? setInsertValues : setUpdateValues;
                                                                const current = mode === "INSERT" ? insertValues : updateValues;
                                                                setter({ ...current, [c.name]: e.target.value });
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                            {/* Allow explicit ID insert if needed, but for now hidden by filter above. You can uncomment or adjust logic here. */}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground text-center">
                                            {mode === "INSERT" ? "* ID will be auto-generated if omitted" : ""}
                                        </div>
                                    </div>
                                )}

                                {/* WHERE CLAUSES */}
                                {["SELECT", "UPDATE", "DELETE"].includes(mode) && (
                                    <div className="space-y-3 pt-4 border-t animate-in fade-in duration-300">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Conditions (WHERE)</Label>
                                            </div>
                                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setWhereClauses([...whereClauses, { col: "id", op: "=", val: "", table: selectedTable }])}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {whereClauses.length === 0 && (
                                            <div className="text-xs text-muted-foreground italic text-center py-2 bg-muted/20 rounded">
                                                No conditions. {mode === "SELECT" ? "Fetching all rows." : "Operation affects all rows."}
                                            </div>
                                        )}
                                        {whereClauses.map((w, i) => (
                                            <div key={i} className="flex gap-1 items-center bg-background p-1 rounded border shadow-sm">
                                                {joinConfig.enabled && (
                                                    <Select value={w.table} onValueChange={(v) => {
                                                        const newW = [...whereClauses]; newW[i].table = v; setWhereClauses(newW);
                                                    }}>
                                                        <SelectTrigger className="h-7 w-[70px] text-[10px] px-1 border-0 bg-transparent"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={selectedTable}>{selectedTable}</SelectItem>
                                                            <SelectItem value={joinConfig.targetTable}>{joinConfig.targetTable}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                                <Select value={w.col} onValueChange={(v) => {
                                                    const newW = [...whereClauses]; newW[i].col = v; setWhereClauses(newW);
                                                }}>
                                                    <SelectTrigger className="h-7 flex-1 text-[10px] px-1 border-0 bg-transparent font-medium"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {schemas[w.table || selectedTable]?.columns.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Select value={w.op} onValueChange={(v) => {
                                                    const newW = [...whereClauses]; newW[i].op = v; setWhereClauses(newW);
                                                }}>
                                                    <SelectTrigger className="h-7 w-[50px] text-[10px] px-1 border-0 bg-muted/50"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="=">=</SelectItem>
                                                        <SelectItem value=">">&gt;</SelectItem>
                                                        <SelectItem value="<">&lt;</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input className="h-7 w-[60px] text-xs px-1 border-0 focus-visible:ring-0 bg-muted/20" placeholder="Val" value={w.val} onChange={(e) => {
                                                    const newW = [...whereClauses]; newW[i].val = e.target.value; setWhereClauses(newW);
                                                }} />
                                                <button onClick={() => setWhereClauses(whereClauses.filter((_, idx) => idx !== i))}><Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-500" /></button>
                                            </div>
                                        ))}

                                        {/* Unsafe Warning Box */}
                                        {(mode === "UPDATE" || mode === "DELETE") && whereClauses.length === 0 && (
                                            <Alert variant="destructive" className="py-2 mt-2">
                                                <AlertTriangle className="h-4 w-4" />
                                                <div className="ml-2">
                                                    <AlertTitle className="text-xs font-bold">Unsafe {mode}</AlertTitle>
                                                    <AlertDescription className="text-[10px] leading-tight opacity-90">
                                                        Missing WHERE clause: This query will modify ALL rows in the table!
                                                    </AlertDescription>
                                                </div>
                                            </Alert>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: Results & Simulation */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Code Output */}
                    <Card className="bg-slate-900 text-slate-100 border-slate-800 shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/50 border-b border-white/5">
                            <span className="text-xs font-mono text-slate-500 flex items-center gap-2"><Terminal className="w-3 h-3" /> SQL Preview</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs hover:bg-white/10 text-slate-400 hover:text-white" onClick={() => { navigator.clipboard.writeText(sqlQuery); toast.success("Copied!"); }}>
                                    <Copy className="h-3 w-3 mr-1" /> Copy
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-4 relative group">
                            <div className="font-mono text-sm sm:text-base text-green-400 whitespace-pre-wrap break-all leading-relaxed">
                                {sqlQuery}
                                <span className="animate-pulse inline-block w-2 H-4 bg-green-500/50 ml-1 aligned-middle"> </span>
                            </div>

                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" className="h-9 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20" onClick={runSimulation}>
                                    <Play className="h-3 w-3 mr-2 fill-current" /> Run Query
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Simulation Result / Message */}
                    {executionMessage ? (
                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 border shadow-sm animate-in zoom-in-95 duration-200
                            ${executionMessage.type === 'success' ? "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50" :
                                executionMessage.type === 'error' ? "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50" :
                                    "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50"}`}>
                            <div className={`p-2 rounded-full ${executionMessage.type === 'success' ? "bg-green-200 dark:bg-green-800" : executionMessage.type === 'error' ? "bg-red-200 dark:bg-red-800" : "bg-blue-200 dark:bg-blue-800"}`}>
                                {executionMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-700 dark:text-green-300" />}
                                {executionMessage.type === 'error' && <XCircle className="w-5 h-5 text-red-700 dark:text-red-300" />}
                                {executionMessage.type === 'info' && <Info className="w-5 h-5 text-blue-700 dark:text-blue-300" />}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-xs uppercase opacity-70 mb-0.5">{executionMessage.type}</p>
                                <p>{executionMessage.text}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-16 border rounded-xl border-dashed flex items-center justify-center text-muted-foreground text-sm bg-muted/10">
                            Run a query to see results...
                        </div>
                    )}

                    {/* Extracted Components */}
                    <SqlResultDisplay result={lastResult} mode={mode} />

                    <SqlSchemaDisplay schemas={schemas} dbState={dbState} onReset={resetDb} />

                    <SqlCheatSheet />
                </div>
            </div>
        </div>
    );
}
