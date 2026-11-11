import type { ReactNode } from "react";
import styles from "./admin-console.module.css";

type StatusTone = "neutral" | "success" | "warning" | "danger";

export function AdminKpi({ label, value, note, icon }: { label: string; value: string | number; note: string; icon?: ReactNode }) {
  return <article className={styles.kpiCard}>
    <div>{icon}<span>{label}</span></div>
    <strong>{value}</strong>
    <p>{note}</p>
  </article>;
}

export function AdminStatus({ label, tone = "neutral" }: { label: string; tone?: StatusTone }) {
  const toneClass = tone === "success" ? styles.badgeSuccess : tone === "warning" ? styles.badgeWarning : tone === "danger" ? styles.badgeDanger : styles.badgeNeutral;
  return <span className={`${styles.dataBadge} ${toneClass}`}>{label}</span>;
}

export function EmptyTableRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return <tr><td className={styles.emptyCell} colSpan={colSpan}>{children}</td></tr>;
}
