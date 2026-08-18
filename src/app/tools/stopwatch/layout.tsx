import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Online Stopwatch | Toolioz Tools",
    description: "A simple, accurate stopwatch with lap times.",
    keywords: ["stopwatch","timer","online clock"],
    alternates: {
        canonical: "/tools/stopwatch",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Online Stopwatch",
        "description": "A simple, accurate stopwatch with lap times.",
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
