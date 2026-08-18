import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "EMI Calculator | Toolioz Tools",
    description: "Calculate your monthly EMI for home, car, and personal loans.",
    keywords: ["emi calculator","loan calculator","mortgage calculator"],
    alternates: {
        canonical: "/tools/emi-calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "EMI Calculator",
        "description": "Calculate your monthly EMI for home, car, and personal loans.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "brand": {
            "@type": "Brand",
            "name": "Toolioz Tools"
        },
        "potentialAction": {
            "@type": "CalculateAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://toolioz.com/tools/emi-calculator",
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            }
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            {children}
        </>
    );
}
