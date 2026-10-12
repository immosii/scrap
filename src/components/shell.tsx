import { Link } from "@tanstack/react-router";
import { factory } from "@/data/load";
import { FAMILY_LABEL, familyGroup, GROUP_LABEL, monthLabel, ORIGIN_LABEL } from "@/lib/format";
import { useFilters, type GroupId, type OriginFilter } from "@/lib/store";

const NAV = [
  { to: "/", label: "نمای مدیریت" },
  { to: "/quality", label: "کنترل کیفیت" },
  { to: "/data", label: "داده‌ها" },
  { to: "/method", label: "روش محاسبه" },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const f = useFilters();
  const families = ["mini", "rm5", "c70", "wm10", "wm8a", "wm8b", "dw"].filter(
    (id) => f.group === "all" || familyGroup(id) === f.group,
  );
  const models = factory.models.filter((m) => {
    if (f.group !== "all" && familyGroup(m.family) !== f.group) return false;
    if (f.family !== "all" && m.family !== f.family) return false;
    return true;
  });

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="truncate text-sm font-medium">آرتا گستر افق پارسیان</span>
              <span className="hidden text-xs text-fg-subtle sm:inline">کنترل کیفیت تولید</span>
            </div>
            <p className="text-xs text-fg-muted">رصد ضایعات · شش‌ماهه اول ۱۴۰۵</p>
          </div>
          <button
            type="button"
            onClick={() => f.reset()}
            className="rounded-sm border border-border bg-bg-elevated px-3 py-2 text-xs text-fg"
          >
            پاک کردن فیلتر
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 sm:px-5">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="shrink-0 rounded-sm px-3 py-2 text-sm text-fg-muted"
              activeProps={{ className: "shrink-0 rounded-sm bg-bg-subtle px-3 py-2 text-sm font-medium text-fg" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t border-border px-4 py-3 sm:px-6">
          <div className="flex gap-2 overflow-x-auto">
            <FilterChip active={f.months.length === 0} onClick={() => f.setAllMonths()}>
              کل دوره
            </FilterChip>
            {factory.months.map((m) => (
              <FilterChip key={m} active={f.months.includes(m)} onClick={() => f.toggleMonth(m)}>
                {monthLabel(m)}
              </FilterChip>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <Select
              label="گروه محصول"
              value={f.group}
              onChange={(v) => f.setGroup(v as GroupId)}
              options={[
                ["all", GROUP_LABEL.all],
                ["fridge", GROUP_LABEL.fridge],
                ["wm", GROUP_LABEL.wm],
                ["dw", GROUP_LABEL.dw],
              ]}
            />
            <Select
              label="خانواده / خط"
              value={f.family}
              onChange={(v) => f.setFamily(v)}
              options={[["all", "همه خانواده‌ها"], ...families.map((id) => [id, FAMILY_LABEL[id] ?? id] as [string, string])]}
            />
            <Select
              label="مدل"
              value={f.model}
              onChange={(v) => f.setModel(v)}
              options={[["all", "همه مدل‌ها"], ...models.map((m) => [m.code, m.name] as [string, string])]}
            />
            <Select
              label="منشأ ضایعات"
              value={f.origin}
              onChange={(v) => f.setOrigin(v as OriginFilter)}
              options={Object.entries(ORIGIN_LABEL)}
            />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">{children}</main>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "shrink-0 rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-fg"
          : "shrink-0 rounded-sm bg-bg-elevated px-3 py-2 text-xs text-fg shadow-border"
      }
    >
      {children}
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs text-fg-subtle">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-sm border border-border bg-bg-elevated px-2 text-sm text-fg outline-none"
      >
        {options.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
