import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/sociials-ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/sociials-ui/accordion";
import { Badge } from "@/components/sociials-ui/badge";
import { BookOpen, ArrowRight, PlayCircle, Database, Filter, Layers, PlusCircle, AlertTriangle } from "lucide-react";

export function SqlCheatSheet() {
    return (
        <Card className="mt-12 border-muted/60 shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <div>
                        <CardTitle className="text-lg">SQL Interactive Guide</CardTitle>
                        <CardDescription>A step-by-step tutorial for mastering SQL operations</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">

                    {/* CHAPTER 1: BASICS */}
                    <AccordionItem value="basics" className="border-b px-4 transition-colors hover:bg-muted/5">
                        <AccordionTrigger className="hover:no-underline py-4 group">
                            <div className="flex items-center gap-4 text-left">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 font-mono text-sm font-bold ring-2 ring-transparent group-hover:ring-blue-200 transition-all">1</span>
                                <div>
                                    <h4 className="font-semibold text-sm">The Basics: SELECT</h4>
                                    <p className="text-xs text-muted-foreground font-normal">Retrieving data from a table</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pb-4 pl-12 pr-4">
                            <p className="text-sm text-foreground/80">
                                SQL (Structured Query Language) starts with the <code>SELECT</code> statement. It tells the database which columns you want to see.
                            </p>
                            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                <h5 className="text-xs font-semibold mb-2 flex items-center gap-2">
                                    <PlayCircle className="w-3 h-3 text-green-500" /> Try this:
                                </h5>
                                <div className="space-y-2">
                                    <code className="block bg-slate-950 text-slate-200 p-2 rounded text-xs font-mono shadow-inner border border-slate-800">
                                        SELECT * FROM users;
                                    </code>
                                    <p className="text-[10px] text-muted-foreground">
                                        The asterisk (<code>*</code>) means "all columns". This fetches every piece of info for every user.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                <h5 className="text-xs font-semibold mb-2">Refining the View:</h5>
                                <div className="space-y-2">
                                    <code className="block bg-slate-950 text-slate-200 p-2 rounded text-xs font-mono shadow-inner border border-slate-800">
                                        SELECT name, email FROM users;
                                    </code>
                                    <p className="text-[10px] text-muted-foreground">
                                        Listing specific columns makes your query faster and cleaner in real databases.
                                    </p>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* CHAPTER 2: FILTERING */}
                    <AccordionItem value="filtering" className="border-b px-4 transition-colors hover:bg-muted/5">
                        <AccordionTrigger className="hover:no-underline py-4 group">
                            <div className="flex items-center gap-4 text-left">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 font-mono text-sm font-bold ring-2 ring-transparent group-hover:ring-indigo-200 transition-all">2</span>
                                <div>
                                    <h4 className="font-semibold text-sm">Filtering: WHERE</h4>
                                    <p className="text-xs text-muted-foreground font-normal">Finding exactly what you need</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pb-4 pl-12 pr-4">
                            <p className="text-sm text-foreground/80">
                                The <code>WHERE</code> clause acts like a filter. It only allows rows that match specific conditions to pass through.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <h5 className="text-xs font-semibold mb-1 flex items-center gap-1"><Filter className="w-3 h-3" /> Exact Match</h5>
                                    <code className="block bg-slate-950 text-slate-200 p-2 rounded text-xs font-mono mb-1">
                                        ... WHERE id = 1;
                                    </code>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <h5 className="text-xs font-semibold mb-1 flex items-center gap-1"><Filter className="w-3 h-3" /> Greater Than</h5>
                                    <code className="block bg-slate-950 text-slate-200 p-2 rounded text-xs font-mono mb-1">
                                        ... WHERE age &gt; 25;
                                    </code>
                                </div>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
                                <h5 className="text-xs font-semibold text-yellow-800 dark:text-yellow-400 mb-1 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Important Note
                                </h5>
                                <p className="text-xs text-yellow-700 dark:text-yellow-300/80">
                                    When you add multiple conditions in this tool, they act as an <b>AND</b> operator. All conditions must be true for a row to be shown.
                                </p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* CHAPTER 3: JOINS */}
                    <AccordionItem value="joins" className="border-b px-4 transition-colors hover:bg-muted/5">
                        <AccordionTrigger className="hover:no-underline py-4 group">
                            <div className="flex items-center gap-4 text-left">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 font-mono text-sm font-bold ring-2 ring-transparent group-hover:ring-purple-200 transition-all">3</span>
                                <div>
                                    <h4 className="font-semibold text-sm">Relationships: JOIN</h4>
                                    <p className="text-xs text-muted-foreground font-normal">Connecting data across tables</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pb-4 pl-12 pr-4">
                            <p className="text-sm text-foreground/80">
                                Real power comes from relating data. The <code>users</code> table has an ID, and the <code>orders</code> table references it via <code>user_id</code>.
                            </p>

                            <div className="space-y-3">
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <h5 className="text-xs font-semibold mb-2">INNER JOIN (The Common Ground)</h5>
                                    <p className="text-[10px] text-muted-foreground mb-2">Only shows rows that exist in BOTH tables.</p>
                                    <code className="block bg-slate-950 text-slate-200 p-2 rounded text-xs font-mono">
                                        SELECT * FROM users <br />
                                        INNER JOIN orders <br />
                                        ON users.id = orders.user_id;
                                    </code>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <h5 className="text-xs font-semibold mb-2">LEFT JOIN (Keep the Left)</h5>
                                    <p className="text-[10px] text-muted-foreground mb-2">Shows ALL users, even if they have zero orders (orders will show as NULL).</p>
                                    <code className="block bg-slate-950 text-slate-200 p-2 rounded text-xs font-mono">
                                        SELECT * FROM users <br />
                                        LEFT JOIN orders <br />
                                        ON users.id = orders.user_id;
                                    </code>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* CHAPTER 4: DML */}
                    <AccordionItem value="dml" className="border-b px-4 transition-colors hover:bg-muted/5">
                        <AccordionTrigger className="hover:no-underline py-4 group">
                            <div className="flex items-center gap-4 text-left">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 font-mono text-sm font-bold ring-2 ring-transparent group-hover:ring-green-200 transition-all">4</span>
                                <div>
                                    <h4 className="font-semibold text-sm">Managing Data: DML</h4>
                                    <p className="text-xs text-muted-foreground font-normal">Insert, Update, Delete</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pb-4 pl-12 pr-4">
                            <div className="grid gap-3">
                                <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                                    <PlusCircle className="w-4 h-4 text-green-500 mt-1" />
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">INSERT</h5>
                                        <p className="text-xs mb-2">Adds new rows. If you skip the <code>id</code>, this tool auto-generates it.</p>
                                        <code className="block bg-slate-950 text-slate-200 p-2 rounded text-[10px] font-mono">
                                            INSERT INTO users (name, role) VALUES ('New User', 'Guest');
                                        </code>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                                    <Database className="w-4 h-4 text-blue-500 mt-1" />
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">UPDATE</h5>
                                        <p className="text-xs mb-2">Modifies existing data. Always use a <code>WHERE</code> clause!</p>
                                        <code className="block bg-slate-950 text-slate-200 p-2 rounded text-[10px] font-mono">
                                            UPDATE users SET role = 'Admin' WHERE id = 2;
                                        </code>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                                    <div className="flex-1">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-1">DELETE</h5>
                                        <p className="text-xs mb-2 text-foreground/80">Removes rows permanently. Dangerous without filters.</p>
                                        <code className="block bg-slate-950 text-slate-200 p-2 rounded text-[10px] font-mono">
                                            DELETE FROM users WHERE age &lt; 18;
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* CHAPTER 5: DDL */}
                    <AccordionItem value="ddl" className="px-4 transition-colors hover:bg-muted/5">
                        <AccordionTrigger className="hover:no-underline py-4 group">
                            <div className="flex items-center gap-4 text-left">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono text-sm font-bold ring-2 ring-transparent group-hover:ring-slate-300 transition-all">5</span>
                                <div>
                                    <h4 className="font-semibold text-sm">Schema: DDL</h4>
                                    <p className="text-xs text-muted-foreground font-normal">Creating and Destroying Tables</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pb-4 pl-12 pr-4">
                            <div className="space-y-4">
                                <div>
                                    <h5 className="text-sm font-semibold mb-2">Data Types</h5>
                                    <ul className="grid grid-cols-3 gap-2 text-xs">
                                        <li className="bg-muted p-2 rounded text-center border"><strong className="block mb-1 text-primary">INT</strong> Whole numbers</li>
                                        <li className="bg-muted p-2 rounded text-center border"><strong className="block mb-1 text-primary">VARCHAR</strong> Text strings</li>
                                        <li className="bg-muted p-2 rounded text-center border"><strong className="block mb-1 text-primary">DECIMAL</strong> Money / Math</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h5 className="text-sm font-semibold">Creating a Table</h5>
                                    <code className="block bg-slate-950 text-slate-200 p-2 rounded text-xs font-mono">
                                        CREATE TABLE products (id INT, price DECIMAL, name VARCHAR);
                                    </code>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </CardContent>
        </Card>
    );
}
