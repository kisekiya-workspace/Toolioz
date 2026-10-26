'use client';

import React, { useState, useEffect } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { SEOSection } from '@/components/ui/SEOSection';

import { Key, AlertCircle, ShieldCheck } from 'lucide-react';

import { FAQSchema } from '@/components/ui/FAQSchema';
import { RelatedTools } from '@/components/ui/RelatedTools';
// Help functions
function base64UrlToBase64(str: string) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }
    return base64;
}

async function verifyHS256(token: string, secret: string): Promise<boolean> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const data = parts[0] + '.' + parts[1];
        const signatureBase64Url = parts[2];
        const signatureBase64 = base64UrlToBase64(signatureBase64Url);
        const signatureBytes = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0));

        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        return await crypto.subtle.verify(
            'HMAC',
            key,
            signatureBytes,
            encoder.encode(data)
        );
    } catch {
        return false;
    }
}

const JWT_FAQS = [
  {
    question: "What are the 3 parts of a JWT token?",
    answer: "A JWT has three dot-separated base64url parts: the header names the algorithm, the payload holds the claims, and the signature covers the first two parts."
  },
  {
    question: "Is it safe to decode JWT tokens online?",
    answer: "On this page, decoding runs in the browser. The token and any typed HS256 secret are not uploaded. Decoding still does not prove the signature is valid."
  },
  {
    question: "What is the difference between HS256 and RS256 in JWT?",
    answer: "HS256 uses one shared secret to sign and to check a token. RS256 uses a private key to sign and a public key to check. This page can check HS256 only."
  }
];

export default function JwtDecoderClient() {
    const [token, setToken] = useState<string>('');
    const [secret, setSecret] = useState<string>('');

    // Parsed Data
    const [header, setHeader] = useState<any>(null);
    const [payload, setPayload] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Verification Status
    const [sigStatus, setSigStatus] = useState<'neutral' | 'verified' | 'invalid'>('neutral');

    useEffect(() => {
        if (!token.trim()) {
            setHeader(null);
            setPayload(null);
            setError(null);
            setSigStatus('neutral');
            return;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Must contain 3 parts separated by dots.');
            }

            const decodedHeader = JSON.parse(atob(base64UrlToBase64(parts[0])));
            const decodedPayload = JSON.parse(atob(base64UrlToBase64(parts[1])));

            setHeader(decodedHeader);
            setPayload(decodedPayload);
            setError(null);

            // Trigger signature check if secret is provided and algorithm is HS256
            if (decodedHeader.alg === 'HS256') {
                if (secret) {
                    verifyHS256(token, secret).then(isValid => {
                        setSigStatus(isValid ? 'verified' : 'invalid');
                    });
                } else {
                    setSigStatus('neutral');
                }
            } else if (secret) {
                // Not HS256 but secret provided
                setSigStatus('invalid');
            } else {
                setSigStatus('neutral');
            }

        } catch (e: any) {
            setHeader(null);
            setPayload(null);
            setError(e.message || 'Invalid token structure');
            setSigStatus('invalid');
        }
    }, [token, secret]);

    // Parse absolute times
    const renderTimePills = () => {
        if (!payload) return null;

        const now = Math.floor(Date.now() / 1000);
        let expNode = null;
        let iatNode = null;

        if (payload.exp) {
            const isExpired = payload.exp < now;
            const expDate = new Date(payload.exp * 1000).toLocaleString();
            expNode = (
                <div className={`flex min-w-[140px] flex-1 flex-col rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3`}>
                    <span className="mb-1 text-xs font-bold uppercase text-[var(--text-secondary)]">Expiration (exp)</span>
                    <span className={`text-sm font-semibold ${isExpired ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>{expDate} {isExpired ? '(Expired)' : '(Not expired)'}</span>
                </div>
            );
        }

        if (payload.iat) {
            const iatDate = new Date(payload.iat * 1000).toLocaleString();
            iatNode = (
                <div className="flex min-w-[140px] flex-1 flex-col rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                    <span className="mb-1 text-xs font-bold uppercase text-[var(--text-secondary)]">Issued At (iat)</span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{iatDate}</span>
                </div>
            );
        }

        if (payload.nbf) {
            const nbfDate = new Date(payload.nbf * 1000).toLocaleString();
            iatNode = (
                <>
                    {iatNode}
                    <div className="flex min-w-[140px] flex-1 flex-col rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                        <span className="mb-1 text-xs font-bold uppercase text-[var(--text-secondary)]">Not Before (nbf)</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{nbfDate}</span>
                    </div>
                </>
            );
        }

        if (!expNode && !iatNode) return null;

        return (
            <div className="mt-4 flex flex-wrap gap-3">
                {iatNode}
                {expNode}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
            <div>
                <header className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-3 inline-flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/80 px-3 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                                Auth & Token Debugger
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl dark:text-zinc-50">
                            JWT Decoder
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                            A JWT has three base64url parts. Header and payload are decoded with atob. crypto.subtle.verify checks HS256 only when a secret is typed. (Not expired) compares exp with the current time and is not a signature result.
                        </p>
                    </div>
                </header>

                <section className="container pb-12 pt-2 sm:pt-4">
                    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-2">
                        <div>
                            <Card className="flex h-full flex-col">
                                <div className="mb-6 flex items-center gap-3">
                                    <Key className="text-[#f43f5e]" />
                                    <h3 className="text-lg font-extrabold uppercase tracking-widest">Encoded Token</h3>
                                </div>
                                <textarea
                                    className="mb-6 min-h-[200px] w-full flex-1 resize-none break-all rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] p-6 font-mono text-[0.9375rem] leading-relaxed text-[var(--text-primary)] outline-none transition-colors focus:border-[#f43f5e] lg:min-h-[300px]"
                                    placeholder="Paste your JWT here (ey...)"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    spellCheck="false"
                                />

                                {/* Signature Verification Block */}
                                <div className="rounded-md border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Verify Signature</h4>
                                        {sigStatus === 'neutral' && <span className="rounded-full bg-[var(--border)] px-3 py-1.5 text-xs font-extrabold uppercase text-[var(--text-secondary)]">Unverified</span>}
                                        {sigStatus === 'verified' && <span className="rounded-full bg-[rgba(16,185,129,0.15)] px-3 py-1.5 text-xs font-extrabold uppercase text-[#10b981]">Signature Verified</span>}
                                        {sigStatus === 'invalid' && <span className="rounded-full bg-[rgba(239,68,68,0.15)] px-3 py-1.5 text-xs font-extrabold uppercase text-[#ef4444]">Invalid Signature</span>}
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-[var(--border)] bg-[var(--bg-primary)] p-3.5 font-mono text-[0.9375rem] text-[var(--text-primary)] outline-none transition-colors focus:border-[#f43f5e]"
                                        placeholder="Secret Key (HMAC / HS256)"
                                        value={secret}
                                        onChange={(e) => setSecret(e.target.value)}
                                    />
                                    {header?.alg && header.alg !== 'HS256' && secret && (
                                        <div className="mt-3 text-sm text-red-500">
                                            Verification is currently only supported for HS256 algorithms. Token specifies: {header.alg}.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex items-center gap-3 rounded-md bg-[rgba(16,185,129,0.1)] p-4 text-sm font-semibold text-[#065f46]">
                                    <ShieldCheck size={16} color="#10b981" />
                                    <span>HS256 checks use the Web Crypto API in this tab. The secret is not uploaded.</span>
                                </div>
                            </Card>
                        </div>

                        <div>
                            <Card className="flex h-full flex-col">
                                <div className="mb-6 flex items-center gap-3">
                                    <h3 className="text-lg font-extrabold uppercase tracking-widest text-pink-500">Header <span className="text-sm font-medium opacity-70">ALGORITHM AND TYPE</span></h3>
                                </div>
                                {error ? (
                                    <div className="flex items-center gap-3 rounded-md bg-[rgba(239,68,68,0.1)] p-6 font-semibold text-[#b91c1c]">
                                        <AlertCircle size={20} />
                                        <span>{error}</span>
                                    </div>
                                ) : header ? (
                                    <pre className="min-h-[100px] overflow-x-auto rounded-md bg-[#1e293b] p-6 font-mono text-[0.9375rem] leading-relaxed text-[#e2e8f0]">{JSON.stringify(header, null, 2)}</pre>
                                ) : (
                                    <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] py-12 text-center font-medium text-[var(--text-secondary)]">Waiting for token...</div>
                                )}
                            </Card>

                            <Card className="mt-6 flex h-full flex-col">
                                <div className="mb-6 flex items-center gap-3">
                                    <h3 className="text-lg font-extrabold uppercase tracking-widest text-violet-500">Payload <span className="text-sm font-medium opacity-70">CLAIMS</span></h3>
                                </div>
                                {payload ? (
                                    <>
                                        <pre className="min-h-[100px] overflow-x-auto rounded-md bg-[#1e293b] p-6 font-mono text-[0.9375rem] leading-relaxed text-[#e2e8f0]">{JSON.stringify(payload, null, 2)}</pre>
                                        {renderTimePills()}
                                    </>
                                ) : (
                                    <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] py-12 text-center font-medium text-[var(--text-secondary)]">Waiting for token...</div>
                                )}
                            </Card>
                        </div>
                    </div>
                </section>

                <SEOSection
                    title="JWT decoder"
                    description="A JWT has three base64url parts. This page decodes the header and payload with atob. An HS256 signature is checked with crypto.subtle.verify only when a secret is typed and the header alg is HS256. The exp label compares exp with the current time and does not prove the signature."
                    howToUse={[
                        "The token is split on the dots. The header and payload are base64url-decoded and parsed as JSON.",
                        "If the header alg is HS256 and a secret is typed, crypto.subtle.verify checks HMAC-SHA-256. Other algorithms are not checked.",
                        "exp, iat, and nbf are shown with toLocaleString(), which is local time. (Not expired) means exp is not earlier than now."
                    ]}
                    benefits={[
                        "The signature check is HMAC-SHA-256 through the Web Crypto API.",
                        "exp is compared with the current Unix time. (Not expired) is not a signature result.",
                        "RS256 is not checked, and the page does not fetch a JWKS. The token is not uploaded."
                    ]}
                />

                <section className="container py-8 pb-24">
                    <Card className="border-0 bg-secondary p-8 sm:p-12">
                        <h2 className="mb-6 text-2xl font-extrabold text-foreground sm:text-3xl">What is JWT signature verification?</h2>
                        <p className="mb-6 text-base leading-relaxed text-secondary-foreground/80">
                            Signature verification checks that a JWT payload still matches the HS256 signature produced with a shared secret. Decoding the header and payload does not prove the token is authentic.
                        </p>
                        <h2 className="mb-6 text-2xl font-extrabold text-foreground sm:text-3xl">How are JWT expiration claims read?</h2>
                        <p className="mb-6 text-base leading-relaxed text-secondary-foreground/80">
                            The exp, iat, and nbf claims are Unix times in seconds. This page shows them with toLocaleString(), which is the browser's local time. (Not expired) means exp is not earlier than now. It does not mean the signature was checked. nbf is displayed and is not compared with the current time.
                        </p>
                    </Card>
                </section>
                <FAQSchema faqs={JWT_FAQS} />
            </div>
            <Footer />
        </div>
    );
}
