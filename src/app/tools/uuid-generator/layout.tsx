import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "UUID Generator | Toolioz Tools",
    description: "Generate random UUIDs (v1, v4) for your applications.",
    keywords: ["uuid generator","guid generator","random id"],
    alternates: {
        canonical: "/tools/uuid-generator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "UUID Generator",
        "description": "Generate random UUIDs (v1, v4) for your applications.",
        "applicationCategory": "DeveloperApplication",
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
