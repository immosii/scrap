import { faNum, faPct } from "@/lib/format";

export function Kpi({
  label,
  value,
  unit,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  unit: string;
  hint: string;
  tone?: "default" | "danger" | "warn";
}) {
  const valueColor = tone === "danger" ? "text-danger" : tone === "warn" ? "text-warn" : "text-fg";
  return (
    <article className="rounded-lg bg-bg-elevated p-4 shadow-border">
      <p className="text-xs text-fg-muted">{label}</p>
      <p className={`mt-2 text-2xl font-semibold tabular tracking-tight ${valueColor}`}>{value}</p>
      <p className="mt-1 text-xs text-fg-subtle">{unit}</p>
      <p className="mt-2 text-xs leading-relaxed text-fg-muted">{hint}</p>
    </article>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg bg-bg-elevated p-4 shadow-border">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs leading-relaxed text-fg-muted">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Note({
  tone,
  title,
  children,
}: {
  tone: "warn" | "danger" | "info";
  title: string;
  children: React.ReactNode;
}) {
  const cls =
    tone === "danger"
      ? "bg-danger-bg text-danger"
      : tone === "warn"
        ? "bg-warn-bg text-warn"
        : "bg-bg-subtle text-fg-muted";
  return (
    <article className={`rounded-lg p-4 ${cls}`}>
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed">{children}</p>
    </article>
  );
}

export function BarRow({
  index,
  label,
  meta,
  value,
  width,
}: {
  index: number;
  label: string;
  meta?: string;
  value: string;
  width: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-border py-2.5 text-sm">
      <div className="min-w-0">
        <p className="truncate">
          <span className="tabular text-fg-subtle">{faNum(index)}. </span>
          {label}
          {meta ? <span className="mr-2 text-xs text-fg-subtle">{meta}</span> : null}
        </p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-subtle">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, width))}%` }} />
        </div>
      </div>
      <p className="tabular text-left">{value}</p>
    </div>
  );
}

export function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-fg-subtle">{label}</p>
      <p className="mt-1 text-sm font-medium tabular">{value}</p>
    </div>
  );
}

export function pctWidth(value: number, max: number): number {
  if (max <= 0) return 0;
  return (value / max) * 100;
}

export function rateText(rate: number | null): string {
  return faPct(rate, 2);
}

export function qtyText(n: number): string {
  return faNum(n, n >= 100 || Number.isInteger(n) ? 0 : 1);
}
