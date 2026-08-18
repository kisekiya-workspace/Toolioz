import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Snowflake Generator | Toolioz Tools",
    description: "Generate unique snowflake IDs (like Twitter/Discord).",
    keywords: ["snowflake generator","id generator","unique id"],
    alternates: {
        canonical: "/tools/snowflakes",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Snowflake Generator",
        "description": "Generate unique snowflake IDs (like Twitter/Discord).",
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
