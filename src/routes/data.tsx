import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { Note, Panel, qtyText } from "@/components/widgets";
import { bomById, factory } from "@/data/load";
import type { ScrapRow } from "@/data/types";
import { FAMILY_LABEL, faNum, ORIGIN_LABEL } from "@/lib/format";
import { buildView } from "@/lib/metrics";
import { useFilters } from "@/lib/store";

export const Route = createFileRoute("/data")({ component: DataPage });

function DataPage() {
  const filters = useFilters();
  const scope = {
    months: filters.months,
    group: filters.group,
    family: filters.family,
    model: filters.model,
    origin: filters.origin,
  };
  const view = useMemo(() => buildView(scope), [filters.months, filters.group, filters.family, filters.model, filters.origin]);
  const [tab, setTab] = useState<"scrap" | "prod" | "gap">("scrap");
  const [q, setQ] = useState("");
  const query = q.trim();

  const scrap = useMemo(() => {
    return factory.scrap.filter((row) => {
      if (filters.months.length && !filters.months.includes(row.month)) return false;
      if (filters.origin !== "all" && row.origin !== filters.origin) return false;
      if (!query) return inFamily(row, filters.family, filters.group, view);
      const blob = `${row.title} ${row.code} ${row.reason} ${row.date}`;
      return blob.includes(query) && inFamily(row, filters.family, filters.group, view);
    });
  }, [filters.months, filters.origin, filters.family, filters.group, query, view]);

  const serials = factory.serials.filter((s) => {
    if (filters.months.length && !filters.months.includes(s.month)) return false;
    const model = factory.models.find((m) => m.code === s.code);
    if (!model) return false;
    if (filters.model !== "all" && s.code !== filters.model) return false;
    if (filters.family !== "all" && model.family !== filters.family) return false;
    if (!query) return true;
    return `${s.serial} ${model.name} ${s.code}`.includes(query);
  });

  return (
    <Shell>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">داده‌های فایل‌ها</h1>
          <p className="mt-1 text-sm text-fg-muted">ردیف‌ها همان فایل تولید و فایل ضایعات هستند. چیزی که نامش در فایل ضریب نیست، داخل درصد ضایعات نمی‌آید.</p>
        </div>
        <button
          type="button"
          onClick={() => exportScrap(scrap)}
          className="h-10 rounded-sm bg-primary px-3 text-xs font-medium text-primary-fg"
        >
          استخراج CSV ضایعات
        </button>
      </div>

      <div className="mb-3 flex gap-2">
        {(
          [
            ["scrap", "ضایعات"],
            ["prod", "تولید"],
            ["gap", "خارج از درصد"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={
              tab === id
                ? "rounded-sm bg-primary px-3 py-2 text-xs text-primary-fg"
                : "rounded-sm bg-bg-elevated px-3 py-2 text-xs shadow-border"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "gap" ? (
        <div className="grid gap-3">
          {factory.issues.map((issue) => (
            <Note key={issue.title} tone={issue.level === "info" ? "info" : issue.level} title={issue.title}>
              {issue.detail}
            </Note>
          ))}
          <Panel title="بزرگ‌ترین مقدارهای خارج از درصد" subtitle="نام این کالاها در فایل ضریب مصرف نیست، پس در شاخص کلان نیستند.">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-sm">
                <thead>
                  <tr className="text-xs text-fg-muted">
                    <th className="pb-2 text-right font-medium">عنوان</th>
                    <th className="pb-2 text-right font-medium">کد</th>
                    <th className="pb-2 text-right font-medium">خانواده احتمالی</th>
                    <th className="pb-2 text-left font-medium">مقدار</th>
                  </tr>
                </thead>
                <tbody>
                  {view.unmatched.slice(0, 25).map((row) => (
                    <tr key={`${row.code}-${row.title}`} className="border-t border-border">
                      <td className="py-2.5">{row.title}</td>
                      <td className="py-2.5 text-xs">{row.code}</td>
                      <td className="py-2.5">{row.guess}</td>
                      <td className="py-2.5 text-left tabular">{qtyText(row.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      ) : null}

      {tab !== "gap" ? (
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tab === "scrap" ? "جست‌وجوی قطعه، کد، علت یا تاریخ" : "جست‌وجوی سریال یا مدل"}
          className="mb-3 h-10 w-full rounded-sm border border-border bg-bg-elevated px-3 text-sm outline-none"
        />
      ) : null}

      {tab === "scrap" ? (
        <Panel title={`${faNum(scrap.length)} ردیف`} subtitle="فیلترهای بالای صفحه روی این جدول هم هست.">
          <div className="max-h-[32rem] overflow-auto">
            <table className="w-full min-w-[56rem] text-sm">
              <thead className="sticky top-0 bg-bg-elevated">
                <tr className="text-xs text-fg-muted">
                  <th className="pb-2 text-right font-medium">تاریخ</th>
                  <th className="pb-2 text-right font-medium">کد</th>
                  <th className="pb-2 text-right font-medium">عنوان</th>
                  <th className="pb-2 text-right font-medium">علت</th>
                  <th className="pb-2 text-right font-medium">منشأ</th>
                  <th className="pb-2 text-right font-medium">در درصد</th>
                  <th className="pb-2 text-left font-medium">مقدار</th>
                </tr>
              </thead>
              <tbody>
                {scrap.slice(0, 200).map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="py-2">{row.date}</td>
                    <td className="py-2 text-xs">{row.code}</td>
                    <td className="max-w-xs py-2">{row.title}</td>
                    <td className="py-2">{row.reason || "—"}</td>
                    <td className="py-2">{ORIGIN_LABEL[row.origin]}</td>
                    <td className="py-2 text-xs">
                      {row.match === "exact" || row.match === "canon" ? "داخل درصد" : "خارج از درصد"}
                    </td>
                    <td className="py-2 text-left tabular">{qtyText(row.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {scrap.length > 200 ? <p className="mt-2 text-xs text-fg-muted">۲۰۰ ردیف اول. برای بقیه جست‌وجو یا CSV را استفاده کنید.</p> : null}
        </Panel>
      ) : null}

      {tab === "prod" ? (
        <Panel title={`${faNum(serials.length)} سریال`} subtitle="هر سریال یک دستگاه است.">
          <div className="max-h-[32rem] overflow-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="sticky top-0 bg-bg-elevated">
                <tr className="text-xs text-fg-muted">
                  <th className="pb-2 text-right font-medium">سریال</th>
                  <th className="pb-2 text-right font-medium">مدل</th>
                  <th className="pb-2 text-right font-medium">ماه</th>
                  <th className="pb-2 text-right font-medium">درجه</th>
                </tr>
              </thead>
              <tbody>
                {serials.slice(0, 200).map((row) => {
                  const model = factory.models.find((m) => m.code === row.code);
                  return (
                    <tr key={row.serial} className="border-t border-border">
                      <td className="py-2 tabular">{row.serial}</td>
                      <td className="py-2">
                        {model?.name}
                        <span className="mr-2 text-xs text-fg-subtle">{FAMILY_LABEL[model?.family ?? ""]}</span>
                      </td>
                      <td className="py-2">{row.month}</td>
                      <td className="py-2">{row.grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : null}
    </Shell>
  );
}

function inFamily(
  row: ScrapRow,
  family: string,
  group: string,
  view: ReturnType<typeof buildView>,
): boolean {
  if (family === "all" && group === "all") return true;
  const allowed = new Set(view.families.map((f) => f.id));
  if (row.bomIds.length) {
    return row.bomIds.some((id) => {
      const part = bomById.get(id);
      return part ? allowed.has(part.family) || family === part.family : false;
    });
  }
  const guess = view.unmatched.find((u) => u.title === row.title && u.code === row.code)?.guess;
  if (!guess) {
    return family === "all";
  }
  const id = Object.entries(FAMILY_LABEL).find(([, label]) => label === guess)?.[0];
  if (!id) return family === "all" && group === "all";
  return allowed.has(id);
}

function exportScrap(rows: ScrapRow[]) {
  const header = ["تاریخ", "ماه", "انبار", "کد", "عنوان", "علت", "منشأ", "مقدار", "وضعیت در درصد", "قطعه", "یادداشت"];
  const body = rows.map((row) => [
    row.date,
    row.month,
    row.wh,
    row.code,
    row.title,
    row.reason,
    ORIGIN_LABEL[row.origin] ?? row.origin,
    String(row.qty),
    row.match,
    row.bomIds.map((id) => bomById.get(id)?.title ?? id).join(" | "),
    row.note,
  ]);
  const csv = [header, ...body]
    .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "scrap-filtered.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
