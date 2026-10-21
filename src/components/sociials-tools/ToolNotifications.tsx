'use client';

import { Toaster } from 'sonner';

/** Shared feedback for the imported utilities, which already call sonner. */
export function ToolNotifications() {
  return <Toaster position="bottom-right" richColors closeButton toastOptions={{ style: { background: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' } }} />;
}
