import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "JSON to CSV | Toolioz Tools",
    description: "Convert JSON data to CSV format for spreadsheets.",
    keywords: ["json to csv","json converter","csv tools"],
    alternates: {
        canonical: "/tools/json-to-csv",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "JSON to CSV",
        "description": "Convert JSON data to CSV format for spreadsheets.",
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
