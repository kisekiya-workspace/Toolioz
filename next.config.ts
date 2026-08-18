import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  serverExternalPackages: ['pdfjs-dist', 'pdf-lib'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
