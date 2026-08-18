import { Metadata } from "next";
import { JsonLd } from "@/components/sociials-seo/JsonLd";

export const metadata: Metadata = {
    title: "Audio Converter | Toolioz Tools",
    description: "Convert audio files between different formats (MP3, WAV, OGG) directly in your browser.",
    keywords: ["audio converter","mp3 converter","wav to mp3"],
    alternates: {
        canonical: "/tools/audio-converter",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Audio Converter",
        "description": "Convert audio files between different formats (MP3, WAV, OGG) directly in your browser.",
        "applicationCategory": "MultimediaApplication",
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
