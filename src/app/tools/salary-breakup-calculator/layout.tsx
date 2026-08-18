import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Salary Breakup Calculator | Toolioz Tools",
    description: "Calculate your in-hand salary and tax deductions.",
    keywords: ["salary calculator","ctc calculator","salary breakdown"],
    alternates: {
        canonical: "/tools/salary-breakup-calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "Salary Breakup Calculator",
        "description": "Calculate your in-hand salary and tax deductions.",
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
                "urlTemplate": "https://toolioz.com/tools/salary-breakup-calculator",
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
