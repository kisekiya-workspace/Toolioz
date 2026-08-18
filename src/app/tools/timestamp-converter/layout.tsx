import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Timestamp Converter | Toolioz Tools",
    description: "Convert Unix timestamps to human-readable dates and vice versa.",
    keywords: ["timestamp converter","unix time","epoch time"],
    alternates: {
        canonical: "/tools/timestamp-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Timestamp Converter",
        "description": "Convert Unix timestamps to human-readable dates and vice versa.",
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
