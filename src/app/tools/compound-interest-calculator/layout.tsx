import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Compound Interest Calculator | Toolioz Tools",
    description: "Calculate the future value of your investments with compound interest.",
    keywords: ["compound interest","investment calculator","interest calculator"],
    alternates: {
        canonical: "/tools/compound-interest-calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "Compound Interest Calculator",
        "description": "Calculate the future value of your investments with compound interest.",
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
                "urlTemplate": "https://toolioz.com/tools/compound-interest-calculator",
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
