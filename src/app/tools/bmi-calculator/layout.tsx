import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "BMI Calculator | Toolioz Tools",
    description: "Calculate your Body Mass Index (BMI) and check your health category.",
    keywords: ["bmi calculator","body mass index","health calculator"],
    alternates: {
        canonical: "/tools/bmi-calculator",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "BMI Calculator",
        "description": "Calculate your Body Mass Index (BMI) and check your health category.",
        "applicationCategory": "HealthApplication",
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
