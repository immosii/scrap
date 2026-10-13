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
import { FAMILY_LABEL, faNum, faPct, importanceLabel } from "@/lib/format";
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
    ? `با انتخاب «${view.selected.name}» تعداد تولید و درجه B فقط همین مدل است. درصد ضایعات برای کل ${FAMILY_LABEL[view.selected.family] ?? "خانواده"} مانده، چون ردیف ضایعات نام مدل ندارد.`
    : null;

  return (
    <Shell>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">نمای مدیریت ضایعات</h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted">
          درصد ضایعات هر قطعه، مقدار ضایعات همان قلم تقسیم بر ضریب مصرف ضربدر تعداد تولید است. شاخص کلان همین نسبت را با درجه اهمیت وزن می‌کند.
        </p>
      </div>

      {modelNote ? (
        <Note tone="info" title="فیلتر مدل">
          {modelNote}
        </Note>
      ) : null}

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="حجم تولید"
          value={faNum(view.n)}
          unit="دستگاه"
          hint={
            view.selected
              ? `همین مدل. کل ${FAMILY_LABEL[view.selected.family] ?? "خانواده"} در این بازه: ${faNum(view.nAllFamily)} دستگاه.`
              : "شمارش سریال فایل تولید. درجه A و B هر دو داخل تعداد تولید هستند."
          }
        />
        <Kpi
          label="مقدار ضایعات"
          value={qtyText(view.qRaw)}
          unit="جمع ستون مقدار"
          hint="این عدد رتبه قطعه نیست. درصد ضایعات از روی ضریب مصرف و اهمیت ساخته می‌شود."
        />
        <Kpi
          label="نرخ واقعی درصد ضایعات"
          value={rateText(view.rBom)}
          unit="شاخص کلان"
          hint="صورت: جمع اهمیت × مقدار ضایعات. مخرج: جمع ضریب مصرف × اهمیت × تعداد تولید."
          tone={view.rBom != null && view.rBom >= 1 ? "danger" : "default"}
        />
        <Kpi
          label="درجه B محصول نهایی"
          value={faNum(view.nB)}
          unit={`دستگاه · ${view.n > 0 ? faNum((view.nB / view.n) * 100, 2) : "—"}٪ از تولید همین نما`}
          hint="درجه کیفی سریال است و از تعداد تولید کم نشده است."
        />
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-3">
        <Note tone="danger" title={worstFamily ? `بحرانی‌ترین خانواده: ${worstFamily.label}` : "خانواده"}>
          {worstFamily
            ? `نرخ واقعی درصد ضایعات ${rateText(worstFamily.rBom)} است، با تولید ${faNum(worstFamily.n)} دستگاه. این خانواده بالاترین شاخص کلان را در نمای فعلی دارد.`
            : "در این فیلتر خانواده‌ای با تعداد تولید و ضریب مصرف نیست."}
        </Note>
        <Note tone="warn" title={worstMonth ? `ماه اوج شاخص: ${worstMonth.label}` : "روند ماه"}>
          {worstMonth
            ? `نرخ واقعی درصد ضایعات ${rateText(worstMonth.rBom)} است، در برابر تولید ${faNum(worstMonth.n)} دستگاه. ماه‌های با تولید کمتر از ۱۰۰ دستگاه از این انتخاب کنار گذاشته شده‌اند.`
            : "ماه واجد شرایطی برای مقایسه نیست."}
        </Note>
        <Note tone="info" title="علت پرتکرار از نظر مقدار">
          {topCause
            ? `«${topCause.reason}» با ${qtyText(topCause.qty)} عدد در ${faNum(topCause.rows)} ردیف. این فهرست روی جمع مقدار است، چون علت ضریب مصرف ندارد.`
            : "علتی در این فیلتر نیست."}
        </Note>
      </section>

      <div className="mt-4 grid gap-3 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Panel
            title="روند ماهانه"
            subtitle="ستون فقط تعداد تولید است. خط، نرخ واقعی درصد ضایعات است. مقدار ضایعات کنار تولید کشیده نشده تا مقیاس‌ها با هم اشتباه گرفته نشوند."
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
                    if (name === "درصد ضایعات") return [faPct(n, 2), name];
                    return [faNum(n), name];
                  }}
                />
                <Legend />
                <Bar yAxisId="qty" dataKey="n" name="تولید" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="rate" dataKey="rBom" name="درصد ضایعات" stroke="var(--color-danger)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        </div>
        <div className="xl:col-span-2">
          <Panel title="مقایسه خانواده" subtitle="مرتب‌شده با نرخ واقعی درصد ضایعات.">
            {view.families
              .slice()
              .sort((a, b) => (b.rBom ?? -1) - (a.rBom ?? -1))
              .map((f, i) => (
                <BarRow
                  key={f.id}
                  index={i + 1}
                  label={f.label}
                  meta={`${faNum(f.n)} دستگاه`}
                  value={f.rBom == null ? "تعریف نشده" : rateText(f.rBom)}
                  width={pctWidth(f.rBom ?? 0, Math.max(...view.families.map((x) => x.rBom ?? 0), 0.01))}
                />
              ))}
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Panel
          title="بالاترین درصد ضایعات قطعه"
          subtitle="درصد ضایعات یک قلم = مقدار ضایعات همان قلم ÷ (ضریب مصرف × تعداد تولید). فقط قطعاتی که مصرف مورد انتظارشان حداقل ۵ است، تا درصد روی تعداد خیلی کم بالا نرود."
        >
          {byRate.length === 0 ? (
            <p className="text-sm text-fg-muted">قطعه‌ای با این شرط در فیلتر نیست.</p>
          ) : (
            byRate.map((p, i) => (
              <BarRow
                key={p.id}
                index={i + 1}
                label={p.title}
                meta={`${FAMILY_LABEL[p.family] ?? p.family} · ${importanceLabel(p.s)}`}
                value={rateText(p.rate)}
                width={pctWidth(p.rate ?? 0, maxRate)}
              />
            ))
          )}
          <Link to="/quality" className="mt-3 inline-block text-xs text-primary">
            جدول کامل قطعات
          </Link>
        </Panel>
        <Panel
          title="بیشترین اثر در شاخص کلان"
          subtitle="اثر قطعه = مقدار ضایعات × درجه اهمیت. اهمیت ۳ بسیار بحرانی، ۲ بحرانی و ۱ غیر بحرانی است. این عدد خودش درصد نیست."
        >
          {byLoad.map((p, i) => (
            <BarRow
              key={p.id}
              index={i + 1}
              label={p.title}
              meta={`درصد ضایعات ${rateText(p.rate)}`}
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
        <Panel title="علت‌ها بر اساس مقدار" subtitle="جمع ستون مقدار. علت در فرمول درصد ضایعات نیست.">
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
