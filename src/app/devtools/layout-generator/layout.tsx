import { noIndexFollow } from '@/lib/noindex-metadata';

export const metadata = noIndexFollow;

export default function NoIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
