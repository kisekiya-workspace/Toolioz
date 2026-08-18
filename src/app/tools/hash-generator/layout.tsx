import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Hash Generator | Toolioz Tools",
    description: "Generate MD5, SHA-1, SHA-256 hashes for any text input.",
    keywords: ["hash generator","md5 generator","sha256 generator"],
    alternates: {
        canonical: "/tools/hash-generator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Hash Generator",
        "description": "Generate MD5, SHA-1, SHA-256 hashes for any text input.",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            {children}
        </>
    );
}
