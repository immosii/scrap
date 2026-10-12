import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Bar,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Shell } from "@/components/shell";
import { BarRow, Kpi, Note, Panel, pctWidth, qtyText, rateText } from "@/components/widgets";
import { FAMILY_LABEL, faNum, faPct } from "@/lib/format";
import { buildView } from "@/lib/metrics";
import { useFilters } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const filters = useFilters();
  const view = useMemo(
    () =>
      buildView({
        months: filters.months,
        group: filters.group,
        family: filters.family,
        model: filters.model,
        origin: filters.origin,
      }),
    [filters.months, filters.group, filters.family, filters.model, filters.origin],
  );

  const ranked = view.parts.filter((p) => p.q > 0 && p.e >= 5);
  const byRate = [...ranked].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0)).slice(0, 6);
  const byLoad = [...view.parts].filter((p) => p.q > 0).sort((a, b) => b.load - a.load).slice(0, 6);
  const maxRate = byRate[0]?.rate ?? 1;
  const maxLoad = byLoad[0]?.load ?? 1;
  const worstMonth = [...view.months].filter((m) => m.n >= 100 && m.rBom != null).sort((a, b) => (b.rBom ?? 0) - (a.rBom ?? 0))[0];
  const worstFamily = [...view.families].filter((f) => f.rBom != null && f.n > 0).sort((a, b) => (b.rBom ?? 0) - (a.rBom ?? 0))[0];
  const topCause = view.causes[0];
  const maxOrigin = Math.max(...view.origins.map((o) => o.qty), 1);
  const modelNote = view.selected
    ? `فیلتر مدل فقط حجم تولید و درجه B را به «${view.selected.name}» محدود کرده. نرخ واقعی همچنان برای کل خانواده ${FAMILY_LABEL[view.selected.family] ?? ""} است، چون ضایعات شماره مدل ندارد.`
    : null;

  return (
    <Shell>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">نمای مدیریت ضایعات</h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted">
          تولید از روی سریال جمع‌آوری‌شده و ضایعات از روی مقدار ثبت‌شده است. رتبه اصلی با نرخ واقعی است، نه با تعداد خام.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Note tone="warn" title="نرخ واقعی، کل ضایعات نیست">
          {faPct(view.cover, 1)} از مقدار ضایعات به فایل ضریب وصل شده و در شاخص آمده است.{" "}
          {qtyText(view.qRaw - view.qMatched)} عدد، از جمله خیلی از نیم‌ساخته‌ها، ضریب ندارند و حذف نشده‌اند؛ در بخش داده‌ها مانده‌اند.
        </Note>
        {modelNote ? (
          <Note tone="info" title="فیلتر مدل">
            {modelNote}
          </Note>
        ) : (
          <Note tone="info" title="دو عدد را با هم نخوانید">
            نرخ خام، عدد ضایعات بر دستگاه است. نرخ واقعی، درصد مصرف مورد انتظار بعد از ضریب مصرف و درجه اهمیت است.
          </Note>
        )}
      </div>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi
          label="حجم تولید"
          value={faNum(view.n)}
          unit="دستگاه"
          hint={
            view.selected
              ? `همین مدل. کل خانواده در این فیلتر: ${faNum(view.nAllFamily)} دستگاه.`
              : "شمارش سریال فایل تولید، درجه A و B هر دو."
          }
        />
        <Kpi
          label="ضایعات خام"
          value={qtyText(view.qRaw)}
          unit="عدد (ستون مقدار)"
          hint="جمع مقدار، هر ردیف یک‌بار. این عدد رتبه قطعه نیست."
        />
        <Kpi
          label="نرخ خام"
          value={view.rawPerUnit == null ? "—" : faNum(view.rawPerUnit, 2)}
          unit="عدد به ازای هر دستگاه خانواده"
          hint="ضایعات خام ÷ تولید خانواده. بدون ضریب مصرف و بدون اهمیت."
        />
        <Kpi
          label="نرخ واقعی کل BOM"
          value={rateText(view.rBom)}
          unit="درصد از مصرف مورد انتظار وزنی"
          hint="صورت: مقدار × اهمیت. مخرج: تولید × ضریب مصرف × اهمیت، برای همه قطعات دارای ضریب."
          tone={view.rBom != null && view.rBom >= 1 ? "danger" : "default"}
        />
        <Kpi
          label="نرخ قطعات ضایعات‌دار"
          value={rateText(view.rOcc)}
          unit="درصد، فقط قطعاتی که ضایعات داشته‌اند"
          hint="همان وزن‌ها، ولی مخرج فقط قطعات با مقدار بزرگ‌تر از صفر است."
          tone="warn"
        />
        <Kpi
          label="درجه B محصول نهایی"
          value={faNum(view.nB)}
          unit={`دستگاه · ${faPct(view.n > 0 ? (view.nB / view.n) * 100 : null, 2)} از تولید همین نما`}
          hint="درجه کیفی سریال است، جدا از ضایعات قطعه. در مخرج تولید هم شمرده می‌شود."
        />
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-3">
        <Note tone="danger" title={worstFamily ? `بحرانی‌ترین خانواده: ${worstFamily.label}` : "خانواده"}>
          {worstFamily
            ? `نرخ واقعی ${rateText(worstFamily.rBom)} با تولید ${faNum(worstFamily.n)} دستگاه. پوشش ضریب این خانواده ${faPct(worstFamily.cover, 0)} است.`
            : "در این فیلتر خانواده‌ای با مخرج تولید و ضریب نیست."}
        </Note>
        <Note tone="warn" title={worstMonth ? `ماه اوج شاخص: ${worstMonth.label}` : "روند ماه"}>
          {worstMonth
            ? `نرخ واقعی ${rateText(worstMonth.rBom)} در برابر تولید ${faNum(worstMonth.n)} دستگاه. ماه‌های با تولید کمتر از ۱۰۰ دستگاه از این انتخاب کنار گذاشته شده‌اند.`
            : "ماه واجد شرایطی برای مقایسه نیست."}
        </Note>
        <Note tone="info" title="علت پرتکرار از نظر مقدار">
          {topCause
            ? `«${topCause.reason}» با ${qtyText(topCause.qty)} عدد در ${faNum(topCause.rows)} ردیف. این رتبه خام است چون علت، ضریب مصرف ندارد.`
            : "علتی در این فیلتر نیست."}
        </Note>
      </section>

      <div className="mt-4 grid gap-3 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Panel
            title="روند ماهانه"
            subtitle="ستون، تولید و ضایعات خام است. خط، نرخ واقعی کل BOM بر حسب درصد."
          >
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={view.months} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-bg-subtle)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "var(--color-fg-muted)", fontSize: 12 }} />
                <YAxis yAxisId="qty" tick={{ fill: "var(--color-fg-muted)", fontSize: 12 }} />
                <YAxis yAxisId="rate" orientation="right" tick={{ fill: "var(--color-danger)", fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value);
                    if (name === "نرخ واقعی") return [faPct(n, 2), name];
                    return [faNum(n), name];
                  }}
                />
                <Legend />
                <Bar yAxisId="qty" dataKey="n" name="تولید" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="qty" dataKey="q" name="ضایعات خام" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="rate" dataKey="rBom" name="نرخ واقعی" stroke="var(--color-danger)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        </div>
        <div className="xl:col-span-2">
          <Panel title="مقایسه خانواده" subtitle="مرتب‌شده با نرخ واقعی، نه با تعداد ضایعات.">
            {view.families
              .slice()
              .sort((a, b) => (b.rBom ?? -1) - (a.rBom ?? -1))
              .map((f, i) => (
                <BarRow
                  key={f.id}
                  index={i + 1}
                  label={f.label}
                  meta={`${faNum(f.n)} دستگاه`}
                  value={f.rBom == null ? "نرخ ندارد" : rateText(f.rBom)}
                  width={pctWidth(f.rBom ?? 0, Math.max(...view.families.map((x) => x.rBom ?? 0), 0.01))}
                />
              ))}
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Panel title="بالاترین نرخ واقعی قطعه" subtitle="فقط قطعات با مصرف مورد انتظار حداقل ۵. واحد: درصد مصرف همان قطعه.">
          {byRate.length === 0 ? (
            <p className="text-sm text-fg-muted">قطعه‌ای با این شرط در فیلتر نیست.</p>
          ) : (
            byRate.map((p, i) => (
              <BarRow
                key={p.id}
                index={i + 1}
                label={p.title}
                meta={`${FAMILY_LABEL[p.family] ?? p.family} · اهمیت ${faNum(p.s, 0)}`}
                value={rateText(p.rate)}
                width={pctWidth(p.rate ?? 0, maxRate)}
              />
            ))
          )}
          <Link to="/quality" className="mt-3 inline-block text-xs text-primary">
            جدول کامل قطعات
          </Link>
        </Panel>
        <Panel title="بالاترین بار وزنی" subtitle="مقدار × درجه اهمیت. این رتبه هنوز تعداد خامِ بی‌وزن نیست.">
          {byLoad.map((p, i) => (
            <BarRow
              key={p.id}
              index={i + 1}
              label={p.title}
              meta={`نرخ ${rateText(p.rate)}`}
              value={qtyText(p.load)}
              width={pctWidth(p.load, maxLoad)}
            />
          ))}
        </Panel>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Panel title="منشأ ضایعات" subtitle="مقدار خام. ردیف مشترک در تولید و پیمانکار دوباره جمع نشده؛ ستون جدا دارد.">
          {view.origins.map((o, i) => (
            <BarRow
              key={o.id}
              index={i + 1}
              label={o.label}
              meta={`${faNum(o.rows)} ردیف`}
              value={qtyText(o.qty)}
              width={pctWidth(o.qty, maxOrigin)}
            />
          ))}
          {filters.origin !== "all" ? (
            <p className="mt-2 text-xs leading-relaxed text-fg-muted">
              فیلتر منشأ فقط صورت کسر را محدود کرده. مخرج مصرف مورد انتظار همان تولید کل خانواده است.
            </p>
          ) : null}
        </Panel>
        <Panel title="علت‌ها بر اساس مقدار" subtitle="واحد: عدد. بدون ضریب. برای اولویت ظاهری است نه شاخص رسمی.">
          {view.causes.slice(0, 6).map((c, i) => (
            <BarRow
              key={c.reason}
              index={i + 1}
              label={c.reason}
              meta={`${faNum(c.rows)} ردیف`}
              value={qtyText(c.qty)}
              width={pctWidth(c.qty, view.causes[0]?.qty ?? 1)}
            />
          ))}
        </Panel>
      </div>
    </Shell>
  );
}
