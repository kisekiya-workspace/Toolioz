import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export function ResultCard({
  label,
  value,
  stats,
  gradient,
}: {
  label: string;
  value: string;
  stats?: Array<[string, string]>;
  gradient: string;
}) {
  return (
    <div className={styles.resultCard} style={{ background: gradient }}>
      <p className={styles.resultLabel}>{label}</p>
      <p className={styles.resultValue}>{value}</p>
      {stats && stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map(([k, v]) => (
            <div key={k} className={styles.statItem}>
              <span className={styles.statLabel}>{k}</span>
              <span className={styles.statVal}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
