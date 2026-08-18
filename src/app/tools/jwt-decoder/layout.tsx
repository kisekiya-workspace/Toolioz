import type { Metadata } from 'next';
import { metadataForImportedTool } from '@/lib/sociials-tool-metadata';
export const metadata: Metadata = metadataForImportedTool('jwt-decoder');
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
