import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Regex Tester | Toolioz Tools",
    description: "Test and debug Regular Expressions in real-time.",
    keywords: ["regex tester","regular expression","regex tool"],
    alternates: {
        canonical: "/tools/regex-tester",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Regex Tester",
        "description": "Test and debug Regular Expressions in real-time.",
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
