import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Age Calculator | Toolioz Tools",
    description: "Calculate your exact age in years, months, and days. Find out the difference between dates.",
    keywords: ["age calculator","date difference","birthday calculator"],
    alternates: {
        canonical: "/tools/age-calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Age Calculator",
        "description": "Calculate your exact age in years, months, and days. Find out the difference between dates.",
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
