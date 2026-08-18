import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Text Tools | Toolioz Tools",
    description: "Convert case, remove duplicates, and manipulate text.",
    keywords: ["text tools","case converter","text manipulation"],
    alternates: {
        canonical: "/tools/text-tools",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Text Tools",
        "description": "Convert case, remove duplicates, and manipulate text.",
        "applicationCategory": "Utility",
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
