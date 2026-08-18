export const calculatorPageStyles = {
  wrapper: 'min-h-[calc(100vh-64px)] bg-[var(--bg-secondary)] pb-16 max-[900px]:pb-32',
  header: 'px-6 py-8 text-center md:py-16',
  title: 'mb-4 text-[1.75rem] font-extrabold text-[var(--text-primary)] sm:text-[2.5rem]',
  subtitle: 'text-lg text-[var(--text-secondary)]',
  grid: 'grid items-start gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_400px]',
  inputCard: 'p-6 sm:p-10',
  inputGroup: 'flex flex-col gap-6',
  selectGroup: 'flex flex-col gap-2',
  label: 'text-sm font-medium text-[var(--text-secondary)]',
  select:
    'rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-3 text-base text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)]',
  resultCol: 'flex flex-col gap-8',
  resultCard:
    'border-none bg-[var(--primary)] p-6 text-center text-white sm:p-10',
  resultLabel: 'mb-2 text-base font-medium opacity-90',
  resultValue: 'mb-8 break-words text-[2rem] font-extrabold sm:text-[3rem]',
  stats: 'mb-8 flex flex-col gap-4 border-t border-white/20 pt-6',
  statItem: 'flex items-center justify-between text-sm',
  statLabel: 'opacity-80',
  statVal: 'font-semibold',
  btn: '!border-white !bg-white !font-bold !text-[var(--primary)] hover:!bg-[var(--bg-secondary)]',
  infoBox:
    'flex gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-6',
  infoIcon: 'text-[var(--primary)]',
  infoText: 'text-sm leading-7 text-[var(--text-secondary)]',
  mobileResultBar:
    'fixed bottom-0 left-0 z-[1000] hidden w-full items-center justify-between border-t border-[var(--border)] bg-white px-6 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] max-[900px]:flex',
  mobileInfo: 'min-w-0',
  mobileLabel: 'text-xs font-semibold text-[var(--text-secondary)]',
  mobileValue: 'text-xl font-extrabold text-[var(--primary)]',
  mobileAction:
    'rounded-[var(--radius-md)] bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white',
} as const;
