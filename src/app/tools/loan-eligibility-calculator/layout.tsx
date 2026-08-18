import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Loan Eligibility Calculator | Toolioz Tools",
    description: "Check your eligibility for home or personal loans.",
    keywords: ["loan eligibility","loan calculator","bank loan"],
    alternates: {
        canonical: "/tools/loan-eligibility-calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "Loan Eligibility Calculator",
        "description": "Check your eligibility for home or personal loans.",
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
                "urlTemplate": "https://toolioz.com/tools/loan-eligibility-calculator",
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
