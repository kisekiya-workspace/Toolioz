import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "CSS Button Generator | Toolioz Tools",
    description: "Design custom CSS buttons and get the HTML/CSS code instantly.",
    keywords: ["css button","button generator","css maker"],
    alternates: {
        canonical: "/tools/css-button-generator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "CSS Button Generator",
        "description": "Design custom CSS buttons and get the HTML/CSS code instantly.",
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
