import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { Note, Panel, qtyText, rateText } from "@/components/widgets";
import { COLOR_LABEL, FAMILY_LABEL, faNum, faPct, ORIGIN_LABEL } from "@/lib/format";
import { buildView, scrapRowsForPart, type PartStat } from "@/lib/metrics";
import { useFilters } from "@/lib/store";

export const Route = createFileRoute("/quality")({ component: QualityPage });

type SortKey = "rate" | "load" | "q" | "s";

function QualityPage() {
  const filters = useFilters();
  const scope = {
    months: filters.months,
    group: filters.group,
    family: filters.family,
    model: filters.model,
    origin: filters.origin,
  };
  const view = useMemo(() => buildView(scope), [filters.months, filters.group, filters.family, filters.model, filters.origin]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("rate");
  const [onlyScrap, setOnlyScrap] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const parts = view.parts
    .filter((p) => (onlyScrap ? p.q > 0 : true))
    .filter((p) => {
      if (!q.trim()) return true;
      return `${p.title} ${FAMILY_LABEL[p.family] ?? ""}`.includes(q.trim());
    })
    .sort((a, b) => {
      if (sort === "q") return b.q - a.q;
      if (sort === "load") return b.load - a.load;
      if (sort === "s") return b.s - a.s || (b.rate ?? 0) - (a.rate ?? 0);
      return (b.rate ?? -1) - (a.rate ?? -1) || b.load - a.load;
    });

  const openPart = parts.find((p) => p.id === open) ?? view.parts.find((p) => p.id === open) ?? null;
  const trace = open ? scrapRowsForPart(open, scope) : [];

  return (
    <Shell>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">تحلیل کنترل کیفیت</h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted">
          مقایسه مدل‌ها مستقل از اینکه ضایعات را به مدل نسبت بدهیم. نرخ قطعه فقط جایی مدل‌محور است که نام ضایعات رنگ را گفته باشد.
        </p>
      </div>

      <Panel title="روند در برابر حجم تولید" subtitle="اگر تولید بالا برود و نرخ واقعی بالا بماند، مسئله سیستمی است نه یک ماه کم‌تیراژ.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="text-xs text-fg-muted">
                <Th>ماه</Th>
                <Th>تولید</Th>
                <Th>ضایعات خام</Th>
                <Th>خام / دستگاه</Th>
                <Th>وصل به ضریب</Th>
                <Th>نرخ واقعی</Th>
              </tr>
            </thead>
            <tbody>
              {view.months.map((m) => (
                <tr key={m.key} className="border-t border-border">
                  <td className="py-2.5">{m.label}</td>
                  <Td>{faNum(m.n)}</Td>
                  <Td>{qtyText(m.q)}</Td>
                  <Td>{m.rawPerUnit == null ? "—" : faNum(m.rawPerUnit, 2)}</Td>
                  <Td>{qtyText(m.qMatched)}</Td>
                  <Td>{rateText(m.rBom)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-4">
        <Panel
          title="مدل‌ها، مستقل از ماه"
          subtitle="جمع تولید در بازه فیلتر. نرخ خانواده برای همه مدل‌های آن خانواده یکی است چون ضایعات سریال مدل ندارد."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="text-xs text-fg-muted">
                  <Th>مدل</Th>
                  <Th>خانواده</Th>
                  <Th>تولید</Th>
                  <Th>سهم خانواده</Th>
                  <Th>درجه B</Th>
                  <Th>درصد B</Th>
                </tr>
              </thead>
              <tbody>
                {view.models.map((m) => (
                  <tr
                    key={m.code}
                    className={m.code === filters.model ? "border-t border-border bg-bg-subtle" : "border-t border-border"}
                  >
                    <td className="max-w-xs py-2.5">
                      <p>{m.name}</p>
                      <p className="text-xs text-fg-subtle">{m.code}</p>
                    </td>
                    <td className="py-2.5">{FAMILY_LABEL[m.family]}</td>
                    <Td>{faNum(m.n)}</Td>
                    <Td>{faPct(m.share, 1)}</Td>
                    <Td>{faNum(m.nB)}</Td>
                    <Td>{m.n > 0 ? faPct((m.nB / m.n) * 100, 2) : "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="mt-4">
        <Panel
          title="قطعات هم‌رنگ"
          subtitle="اگر نام ضایعات رنگ داشته باشد، مخرج فقط تولید همان رنگ در خانواده است. این نرخ داخل شاخص کل BOM جایگزین نشده."
        >
          {view.colorParts.length === 0 ? (
            <p className="text-sm text-fg-muted">در این فیلتر ضایعات رنگیِ وصل‌شده به ضریب نیست.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] text-sm">
                <thead>
                  <tr className="text-xs text-fg-muted">
                    <Th>قطعه</Th>
                    <Th>رنگ</Th>
                    <Th>مقدار</Th>
                    <Th>تولید رنگ</Th>
                    <Th>ضریب</Th>
                    <Th>نرخ رنگ</Th>
                  </tr>
                </thead>
                <tbody>
                  {view.colorParts.slice(0, 12).map((p) => (
                    <tr key={`${p.id}-${p.color}`} className="border-t border-border">
                      <td className="py-2.5">{p.title}</td>
                      <td className="py-2.5">{COLOR_LABEL[p.color] ?? p.color}</td>
                      <Td>{qtyText(p.q)}</Td>
                      <Td>{faNum(p.nColor)}</Td>
                      <Td>{faNum(p.c, 2)}</Td>
                      <Td>{p.nColor === 0 ? "مخرج صفر" : rateText(p.rate)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="قطعات، ضریب و نرخ" subtitle="کلیک روی ردیف، ردیف‌های خام و جای‌گذاری فرمول را نشان می‌دهد.">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجوی نام قطعه"
              className="h-10 flex-1 rounded-sm border border-border bg-bg px-3 text-sm outline-none"
            />
            <select
              aria-label="مرتب‌سازی"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-sm border border-border bg-bg px-2 text-sm"
            >
              <option value="rate">نرخ واقعی</option>
              <option value="load">بار وزنی</option>
              <option value="s">درجه اهمیت</option>
              <option value="q">مقدار خام</option>
            </select>
            <button
              type="button"
              onClick={() => setOnlyScrap((v) => !v)}
              className="h-10 rounded-sm border border-border bg-bg-subtle px-3 text-xs"
            >
              {onlyScrap ? "فقط دارای ضایعات" : "کل BOM"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-sm">
              <thead>
                <tr className="text-xs text-fg-muted">
                  <Th>قطعه</Th>
                  <Th>C</Th>
                  <Th>S</Th>
                  <Th>Q</Th>
                  <Th>E = N×C</Th>
                  <Th>نرخ</Th>
                  <Th>Q×S</Th>
                </tr>
              </thead>
              <tbody>
                {parts.slice(0, 80).map((p) => (
                  <PartRows
                    key={p.id}
                    part={p}
                    open={open === p.id}
                    onToggle={() => setOpen(open === p.id ? null : p.id)}
                    trace={open === p.id ? trace : []}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {parts.length > 80 ? (
            <p className="mt-2 text-xs text-fg-muted">۸۰ ردیف اول این مرتب‌سازی نشان داده شده. جست‌وجو را محدود کنید.</p>
          ) : null}
        </Panel>
      </div>

      {openPart ? null : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <Panel title="علت‌های همین فیلتر" subtitle="مقدار خام. علت ضریب مصرف ندارد و وارد نرخ واقعی نمی‌شود.">
          <CauseFamily scopeReady={view.causes.slice(0, 8)} />
        </Panel>
        <div>
          <Note tone="warn" title="مخرج کوچک">
            اگر مصرف مورد انتظار زیر ۵ باشد نرخ را ناپایدار بدانید. در جدول، این ردیف‌ها با مرتب‌سازی نرخ ممکن است بالا بیایند؛ ستون E را با نرخ بخوانید.
          </Note>
          <div className="mt-3">
            <Note tone="info" title="شرح خالی">
              {faNum(view.emptyReason)} ردیف در این فیلتر شرح ایراد ندارد و در علت‌ها زیر «بدون شرح ایراد» جمع شده است.
            </Note>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function CauseFamily({ scopeReady }: { scopeReady: { reason: string; qty: number }[] }) {
  return (
    <div>
      {scopeReady.map((c) => (
        <div key={c.reason} className="border-t border-border py-2.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate">{c.reason}</span>
            <span className="tabular">{qtyText(c.qty)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PartRows({
  part,
  open,
  onToggle,
  trace,
}: {
  part: PartStat;
  open: boolean;
  onToggle: () => void;
  trace: { id: number; date: string; reason: string; origin: string; qty: number; title: string; note: string }[];
}) {
  const unstable = part.e > 0 && part.e < 5 && part.q > 0;
  return (
    <>
      <tr className="border-t border-border">
        <td className="py-2.5">
          <button type="button" onClick={onToggle} className="text-right">
            <span className="block">{part.title}</span>
            <span className="text-xs text-fg-subtle">
              {FAMILY_LABEL[part.family]}
              {part.unit ? ` · ${part.unit}` : ""}
              {part.shared ? " · مشترک دو خط" : ""}
              {part.dups > 1 ? " · ردیف تکراری BOM جمع شد" : ""}
              {unstable ? " · مخرج کوچک" : ""}
            </span>
          </button>
        </td>
        <Td>{faNum(part.c, 3)}</Td>
        <Td>{faNum(part.s, 0)}</Td>
        <Td>{qtyText(part.q)}</Td>
        <Td>{faNum(part.e, 1)}</Td>
        <Td>{rateText(part.rate)}</Td>
        <Td>{qtyText(part.load)}</Td>
      </tr>
      {open ? (
        <tr className="border-t border-border bg-bg-subtle">
          <td colSpan={7} className="px-2 py-3 text-xs leading-relaxed text-fg-muted">
            <p>
              نرخ = Q ÷ (N × C) × ۱۰۰ = {qtyText(part.q)} ÷ {faNum(part.e, 2)} × ۱۰۰ = {rateText(part.rate)}. اهمیت S=
              {faNum(part.s, 0)} فقط در شاخص وزنی خانواده اثر دارد، نه در نرخ خود قطعه. بار وزنی = Q × S = {qtyText(part.load)}.
            </p>
            {part.shared ? (
              <p className="mt-1">این نام در دو شیت لباسشویی ۸/۹ بوده و مقدار به نسبت مصرف مورد انتظار دو خط شکسته شده است.</p>
            ) : null}
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-xs">
                <thead>
                  <tr className="text-fg-subtle">
                    <th className="pb-1 text-right font-medium">تاریخ نیاز</th>
                    <th className="pb-1 text-right font-medium">علت</th>
                    <th className="pb-1 text-right font-medium">منشأ</th>
                    <th className="pb-1 text-left font-medium">مقدار</th>
                  </tr>
                </thead>
                <tbody>
                  {trace.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className="py-1.5">{row.date}</td>
                      <td className="py-1.5">{row.reason || "بدون شرح"}</td>
                      <td className="py-1.5">{ORIGIN_LABEL[row.origin] ?? row.origin}</td>
                      <td className="py-1.5 text-left tabular">{qtyText(row.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {trace.length === 0 ? <p className="mt-2">ردیفی از ضایعات به این قطعه وصل نیست.</p> : null}
          </td>
        </tr>
      ) : null}
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="pb-2 text-right font-medium">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="py-2.5 tabular">{children}</td>;
}
