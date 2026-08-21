export const calculatorPageStyles = {
  wrapper: 'min-h-[calc(100vh-64px)] bg-white text-zinc-950 pb-16 dark:bg-zinc-950 dark:text-zinc-50 max-[900px]:pb-32',
  header: 'mx-auto max-w-5xl px-4 pb-6 pt-8 text-center sm:px-6 md:pb-8 md:pt-10',
  title: 'mb-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl dark:text-zinc-50',
  subtitle: 'mx-auto max-w-3xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400',
  grid: 'mx-auto max-w-7xl grid items-start gap-8 px-4 sm:px-6 lg:px-8 lg:grid-cols-[minmax(0,1fr)_440px]',
  inputCard: 'rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900',
  inputGroup: 'flex flex-col gap-6',
  selectGroup: 'flex flex-col gap-2',
  label: 'text-sm font-semibold text-zinc-800 dark:text-zinc-200',
  select:
    'rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm font-medium text-zinc-950 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50',
  resultCol: 'flex flex-col gap-6',
  resultCard:
    'rounded-2xl border border-white/10 p-6 text-center text-white sm:p-8 relative overflow-hidden',
  resultLabel: 'mb-2 text-xs font-bold uppercase tracking-wider text-white/90',
  resultValue: 'mb-6 break-words font-mono text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white',
  stats: 'mb-6 flex flex-col gap-3.5 border-t border-white/20 pt-6',
  statItem: 'flex items-center justify-between text-sm',
  statLabel: 'text-white/90 font-medium',
  statVal: 'font-bold font-mono text-white',
  btn: '!w-full !rounded-xl !bg-white !py-3 !font-bold !text-zinc-950 !border-0 hover:!bg-zinc-100 transition-all flex items-center justify-center gap-2 cursor-pointer',
  infoBox:
    'flex gap-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900',
  infoIcon: 'text-blue-600 shrink-0 mt-0.5',
  infoText: 'text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400',
  mobileResultBar:
    'fixed bottom-0 left-0 z-50 hidden w-full items-center justify-between border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900 max-[900px]:flex',
  mobileInfo: 'min-w-0',
  mobileLabel: 'text-xs font-semibold text-zinc-500',
  mobileValue: 'text-xl font-extrabold text-blue-600',
  mobileAction:
    'rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700',
} as const;
