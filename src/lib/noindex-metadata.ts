import type { Metadata } from 'next';

export const noIndexFollow: Metadata = {
  robots: { index: false, follow: true },
};
