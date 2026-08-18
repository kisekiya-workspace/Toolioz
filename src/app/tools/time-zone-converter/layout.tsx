import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Time Zone Converter | Toolioz Tools",
    description: "Convert time between different world time zones.",
    keywords: ["time zone converter","world clock","time difference"],
    alternates: {
        canonical: "/tools/time-zone-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Time Zone Converter",
        "description": "Convert time between different world time zones.",
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
