import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Scientific Calculator | Toolioz Tools",
    description: "A powerful, easy-to-use online scientific calculator for basic and advanced math.",
    keywords: ["scientific calculator","online calculator","math tool"],
    alternates: {
        canonical: "/tools/calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Scientific Calculator",
        "description": "A powerful, easy-to-use online scientific calculator for basic and advanced math.",
        "applicationCategory": "EducationalApplication",
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
