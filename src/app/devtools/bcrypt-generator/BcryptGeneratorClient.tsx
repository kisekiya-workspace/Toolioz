'use client';

import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/Footer';
import { SEOSection } from '@/components/ui/SEOSection';
import { Asterisk, CheckCircle2, XCircle, Copy, Check, Loader2 } from 'lucide-react';

export default function BcryptGeneratorClient() {
    const [plainText, setPlainText] = useState('');
    const [rounds, setRounds] = useState(10);
    const [hashResult, setHashResult] = useState('');
    const [isHashing, setIsHashing] = useState(false);
    const [copied, setCopied] = useState(false);

    // Verification state
    const [checkHash, setCheckHash] = useState('');
    const [checkString, setCheckString] = useState('');
    const [isMatch, setIsMatch] = useState<boolean | null>(null);

    const generateHash = () => {
        if (!plainText) return;
        setIsHashing(true);
        // Defer to next tick so UI loader renders
        setTimeout(() => {
            try {
                const salt = bcrypt.genSaltSync(rounds);
                const hash = bcrypt.hashSync(plainText, salt);
                setHashResult(hash);
            } catch (err) {
                console.error(err);
            } finally {
                setIsHashing(false);
            }
        }, 50);
    };

    const copyToClipboard = () => {
        if (!hashResult) return;
        navigator.clipboard.writeText(hashResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Live verification check
    useEffect(() => {
        if (checkHash && checkString) {
            try {
                const match = bcrypt.compareSync(checkString, checkHash);
                setIsMatch(match);
            } catch {
                setIsMatch(false);
            }
        } else {
            setIsMatch(null);
        }
    }, [checkHash, checkString]);

    return (
        <div className="flex min-h-screen flex-col justify-between bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
            <div>
                <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-3 inline-flex items-center gap-2">
                            <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
                                Cryptographic Security
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
                            Bcrypt Generator & Verifier
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                            Generate secure hashes and verify passwords safely directly in your browser.
                        </p>
                    </div>
                </header>

                <section className="mx-auto max-w-5xl px-4 pb-16 pt-2 sm:px-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Generate Card */}
                        <Card className="flex flex-col p-6 sm:p-8 space-y-5 shadow-xs">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Asterisk size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 uppercase tracking-wider">
                                    Generate Hash
                                </h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                    String to Hash
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs sm:text-sm font-mono text-zinc-900 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                                    placeholder="Enter password or string..."
                                    value={plainText}
                                    onChange={(e) => setPlainText(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                    <span>Salt Rounds</span>
                                    <span className="font-mono text-blue-600 dark:text-blue-400">{rounds}</span>
                                </div>
                                <input
                                    type="range"
                                    min="4"
                                    max="14"
                                    value={rounds}
                                    onChange={(e) => setRounds(parseInt(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Higher rounds = more secure compute cost. 10 is standard.</span>
                            </div>

                            <Button
                                onClick={generateHash}
                                className="w-full"
                                disabled={isHashing || !plainText}
                            >
                                {isHashing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                                {isHashing ? 'Hashing...' : 'Generate Bcrypt Hash'}
                            </Button>

                            {hashResult && (
                                <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs dark:bg-zinc-950">
                                    <div className="flex-1 select-all break-all font-mono text-zinc-200">{hashResult}</div>
                                    <button
                                        className="ml-3 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition"
                                        onClick={copyToClipboard}
                                        title="Copy Hash"
                                    >
                                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            )}
                        </Card>

                        {/* Check Card */}
                        <Card className="flex flex-col p-6 sm:p-8 space-y-5 shadow-xs">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <CheckCircle2 size={18} />
                                </div>
                                <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 uppercase tracking-wider">
                                    Verify Hash Match
                                </h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                    Hash to Check Against
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs sm:text-sm font-mono text-zinc-900 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                                    placeholder="e.g. $2a$10$..."
                                    value={checkHash}
                                    onChange={(e) => setCheckHash(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                    String to Test
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs sm:text-sm font-mono text-zinc-900 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                                    placeholder="Enter candidate password..."
                                    value={checkString}
                                    onChange={(e) => setCheckString(e.target.value)}
                                />
                            </div>

                            <div className="mt-auto pt-4">
                                {isMatch === null ? (
                                    <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 p-4 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                        Enter hash and string above to test verification.
                                    </div>
                                ) : isMatch ? (
                                    <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/30 p-4 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                        <CheckCircle2 size={16} />
                                        <span>Match! The string validates successfully against the hash.</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/30 p-4 text-xs font-bold text-rose-800 dark:text-rose-300">
                                        <XCircle size={16} />
                                        <span>No Match. The string does not match the hashed value.</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </section>

                <SEOSection
                    title="Bcrypt Password Hash Generator & Checker"
                    description="A vital utility for backend developers to quickly generate and verify Bcrypt password hashes without setting up a server or compromising plaintext passwords. Select custom salt rounds securely online."
                    howToUse={[
                        "To generate: Enter your plaintext string and select the cost factor (salt rounds), then click Generate.",
                        "To test: Paste a known Bcrypt hash (e.g. $2a$10$...) and type the suspected string. Verification is instant.",
                        "The check automatically extracts the embedded salt and verifies if the inputted text matches the algorithmic output.",
                        "Easily copy the generated hash output to seed your database or integration tests."
                    ]}
                    benefits={[
                        "100% Client-Side Processing keeps passwords safe from man-in-the-middle attacks.",
                        "Visual verification lets you instantly know if a hash matches.",
                        "Adjustable rounds (cost factors) let you simulate different security setups and compute times."
                    ]}
                />
            </div>
            <Footer />
        </div>
    );
}
