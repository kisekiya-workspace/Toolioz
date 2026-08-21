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
    answer: "A JWT consists of 3 dot-separated base64url-encoded parts: Header (algorithm & token type), Payload (claims and user data), and Signature (verifies integrity)."
  },
  {
    question: "Is it safe to decode JWT tokens online?",
    answer: "Yes, on Toolioz decoding happens entirely in your browser using JavaScript. No tokens, secrets, or payloads are transmitted to any server."
  },
  {
    question: "What is the difference between HS256 and RS256 in JWT?",
    answer: "HS256 uses a single shared secret key for both signing and verification. RS256 uses an asymmetric key pair: a private key for signing and a public key for verification."
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
                    <span className={`text-sm font-semibold ${isExpired ? 'text-[#ef4444]' : 'text-[#10b981]'}`}>{expDate} {isExpired ? '(Expired)' : '(Valid)'}</span>
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
                            Advanced JWT Debugger
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
                            Decode tokens, verify HS256 signatures, and inspect payload schemas accurately.
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
                                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#ef4444' }}>
                                            Verification is currently only supported for HS256 algorithms. Token specifies: {header.alg}.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex items-center gap-3 rounded-md bg-[rgba(16,185,129,0.1)] p-4 text-sm font-semibold text-[#065f46]">
                                    <ShieldCheck size={16} color="#10b981" />
                                    <span>Processed securely in your browser using Web Crypto APIs.</span>
                                </div>
                            </Card>
                        </div>

                        <div>
                            <Card className="flex h-full flex-col">
                                <div className="mb-6 flex items-center gap-3">
                                    <h3 className="text-lg font-extrabold uppercase tracking-widest" style={{ color: '#ec4899' }}>Header <span style={{ opacity: 0.7, fontSize: '0.8rem', fontWeight: 500 }}>ALGORITHM & TTYP</span></h3>
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

                            <Card className="flex h-full flex-col" style={{ marginTop: '1.5rem' }}>
                                <div className="mb-6 flex items-center gap-3">
                                    <h3 className="text-lg font-extrabold uppercase tracking-widest" style={{ color: '#8b5cf6' }}>Payload <span style={{ opacity: 0.7, fontSize: '0.8rem', fontWeight: 500 }}>CLAIMS</span></h3>
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
                    title="Advanced Online JWT Decoder & Verifier"
                    description="A powerful developer tool to decode, inspect, and mathematically verify JSON Web Tokens (JWT) locally. Parse expiration dates, calculate mathematical signatures via HS256, and ensure your identity tokens are secure."
                    howToUse={[
                        "Paste your JSON Web Token (ey...) string into the left input area.",
                        "If you know the symmetric secret used to sign the token (for HS256), enter it into the Verify block to cryptographically check if the token is valid.",
                        "Inspect the parsed JSON structures on the right side. Any Unix timestamps like 'iat' or 'exp' will be automatically parsed into human-readable local time."
                    ]}
                    benefits={[
                        "Cryptographic Verification: Utilize Web Crypto API to ensure your token signatures haven't been tampered.",
                        "Timestamp Expansion: No more opening secondary timestamp converters; expiration states are visually flagged.",
                        "Absolute Privacy: Handled 100% Client-Side. Your tokens or secrets are never dispatched to our networks."
                    ]}
                />

                <section className="container section" style={{ padding: '2rem 0 6rem' }}>
                    <Card style={{ padding: '3rem', background: 'var(--bg-secondary)', border: 'none' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>What is Signature Verification?</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                            A standard <strong>JSON Web Token (JWT)</strong> acts as an identity passport. But without checking the cryptographic stamp—the signature—there is no guarantee the passport hasn't been forged. By implementing a <strong>secure JWT verification tool</strong> inside the browser using `crypto.subtle` APIs, developers can input their `HS256` secret and securely test exactly how their token will be processed on backend servers without installing Postman dependencies.
                        </p>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>JWT Expiration Details</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                            Understanding token validity periods is crucial. Our debugger strictly identifies standard claims like `exp` (Expiration Time), `nbf` (Not Before), and `iat` (Issued At). It natively transforms these obscure Unix Epoch numeric stamps into your browser's localized timezone, rendering clear indicators if a token has breached its allowed lifespan.
                        </p>
                    </Card>
                </section>
                <FAQSchema faqs={JWT_FAQS} />
            </div>
            <Footer />
        </div>
    );
}
