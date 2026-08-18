import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "GST Calculator | Toolioz Tools",
    description: "Calculate GST (Goods and Services Tax) inclusive and exclusive amounts.",
    keywords: ["gst calculator","tax calculator","india tax"],
    alternates: {
        canonical: "/tools/gst-calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "GST Calculator",
        "description": "Calculate GST (Goods and Services Tax) inclusive and exclusive amounts.",
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
                "urlTemplate": "https://toolioz.com/tools/gst-calculator",
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
