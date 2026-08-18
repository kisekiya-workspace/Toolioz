import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Percentage Calculator | Toolioz Tools",
    description: "Calculate percentages, percentage change, and more.",
    keywords: ["percentage calculator","math tools","percent"],
    alternates: {
        canonical: "/tools/percentage-calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Percentage Calculator",
        "description": "Calculate percentages, percentage change, and more.",
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
