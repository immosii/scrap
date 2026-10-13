import { bomById, factory, modelByCode } from "@/data/load";
import type { BomPart, ScrapRow } from "@/data/types";
import { FAMILY_LABEL, familyGroup, monthLabel, ORIGIN_LABEL } from "@/lib/format";
import type { GroupId, OriginFilter } from "@/lib/store";

export type Scope = {
  months: string[];
  group: GroupId;
  family: string;
  model: string;
  origin: OriginFilter;
};

export type PartStat = {
  id: string;
  title: string;
  family: string;
  unit: string;
  c: number;
  s: number;
  q: number;
  e: number;
  rate: number | null;
  load: number;
  dups: number;
  shared: boolean;
};

export type CauseStat = { reason: string; qty: number; rows: number };
export type UnmatchedStat = {
  title: string;
  code: string;
  qty: number;
  rows: number;
  guess: string;
};

export type FamilyStat = {
  id: string;
  label: string;
  n: number;
  rBom: number | null;
};

export type MonthStat = {
  key: string;
  label: string;
  n: number;
  q: number;
  rBom: number | null;
};

export type ModelStat = {
  code: string;
  name: string;
  family: string;
  color: string | null;
  pattern: boolean;
  n: number;
  nB: number;
  share: number | null;
};

export type View = {
  n: number;
  nAllFamily: number;
  nB: number;
  qRaw: number;
  emptyReason: number;
  rBom: number | null;
  months: MonthStat[];
  families: FamilyStat[];
  origins: { id: string; label: string; qty: number; rows: number }[];
  originMonth: { key: string; label: string; prod: number; contractor: number; both: number; unknown: number }[];
  parts: PartStat[];
  causes: CauseStat[];
  unmatched: UnmatchedStat[];
  models: ModelStat[];
  selected: ModelStat | null;
};

function monthOk(month: string, months: string[]): boolean {
  return months.length === 0 || months.includes(month);
}

function familyAllowed(family: string, scope: Scope): boolean {
  if (scope.family !== "all" && family !== scope.family) return false;
  if (scope.group !== "all" && familyGroup(family) !== scope.group) return false;
  return true;
}

function guessFamily(row: ScrapRow): string {
  const blob = `${row.title} ${row.note}`.toLowerCase();
  if (row.wh.includes("یخچال")) {
    if (blob.includes("c70") || blob.includes("fr16")) return "c70";
    if (blob.includes("rm5")) return "rm5";
    return "mini";
  }
  if (blob.includes("ظرفشو") || blob.includes("h-dw") || /(^|[^a-z])dw([^a-z]|$)/.test(blob)) return "dw";
  if (blob.includes("10kg")) return "wm10";
  if (/8t3|9t2|8ti3|9ti2|8tw3|9tw2/.test(blob)) return "wm8b";
  if (/8t2|9t1|8ti2|9ti1|8tw2|9tw1/.test(blob)) return "wm8a";
  if (/wm|لباس|sky/.test(blob)) return "wm8b";
  return "other";
}

function scrapVisible(row: ScrapRow, scope: Scope, honorFamily: boolean): boolean {
  if (!monthOk(row.month, scope.months)) return false;
  if (scope.origin !== "all" && row.origin !== scope.origin) return false;
  if (!honorFamily) return true;
  if (row.bomIds.length) {
    return row.bomIds.some((id) => {
      const part = bomById.get(id);
      return part ? familyAllowed(part.family, scope) : false;
    });
  }
  const guess = guessFamily(row);
  if (guess === "other") {
    return scope.group === "all" && scope.family === "all";
  }
  return familyAllowed(guess, scope);
}

function productionOf(scope: Scope, honorModel: boolean): Map<string, number> {
  const byFamily = new Map<string, number>();
  for (const cell of factory.prod) {
    if (!monthOk(cell.month, scope.months)) continue;
    const model = modelByCode.get(cell.code);
    if (!model) continue;
    if (!familyAllowed(model.family, scope)) continue;
    if (honorModel && scope.model !== "all" && model.code !== scope.model) continue;
    byFamily.set(model.family, (byFamily.get(model.family) ?? 0) + cell.qty);
  }
  return byFamily;
}

function rateBlock(scope: Scope, nByFamily: Map<string, number>, nSplit: Map<string, number>) {
  const partQ = new Map<string, number>();
  const shared = new Set<string>();
  for (const row of factory.scrap) {
    if (!scrapVisible(row, scope, true)) continue;
    if (row.match !== "exact" && row.match !== "canon") continue;
    const linked = row.bomIds
      .map((id) => bomById.get(id))
      .filter((p): p is BomPart => !!p);
    if (!linked.length) continue;
    if (linked.length > 1) linked.forEach((p) => shared.add(p.id));
    const weights = linked.map((p) => (nSplit.get(p.family) ?? 0) * p.c);
    const sum = weights.reduce((a, b) => a + b, 0);
    linked.forEach((p, i) => {
      if (!familyAllowed(p.family, scope)) return;
      if ((nByFamily.get(p.family) ?? 0) <= 0) return;
      const share = sum > 0 ? weights[i]! / sum : 0;
      if (share <= 0) return;
      partQ.set(p.id, (partQ.get(p.id) ?? 0) + row.qty * share);
    });
  }

  let num = 0;
  let den = 0;
  const parts: PartStat[] = [];
  for (const part of factory.bom) {
    if (!familyAllowed(part.family, scope)) continue;
    const n = nByFamily.get(part.family) ?? 0;
    if (n <= 0) continue;
    const e = n * part.c;
    const q = partQ.get(part.id) ?? 0;
    const load = q * part.s;
    den += e * part.s;
    num += load;
    parts.push({
      id: part.id,
      title: part.title,
      family: part.family,
      unit: part.unit,
      c: part.c,
      s: part.s,
      q,
      e,
      rate: e > 0 ? (q / e) * 100 : null,
      load,
      dups: part.dups,
      shared: shared.has(part.id),
    });
  }
  return {
    parts,
    rBom: den > 0 ? (num / den) * 100 : null,
  };
}

export function buildView(scope: Scope): View {
  const nSplit = productionOf(
    { months: scope.months, group: "all", family: "all", model: "all", origin: "all" },
    false,
  );
  const nFamily = productionOf(scope, false);
  const nModel = productionOf(scope, true);
  let n = 0;
  let nB = 0;
  let nAllFamily = 0;
  for (const v of nModel.values()) n += v;
  for (const v of nFamily.values()) nAllFamily += v;
  for (const cell of factory.prod) {
    if (!monthOk(cell.month, scope.months)) continue;
    const model = modelByCode.get(cell.code);
    if (!model || !familyAllowed(model.family, scope)) continue;
    if (scope.model !== "all" && model.code !== scope.model) continue;
    if (cell.grade === "B") nB += cell.qty;
  }

  const rated = rateBlock(scope, nFamily, nSplit);
  let qRaw = 0;
  let emptyReason = 0;
  const originQty = new Map<string, { qty: number; rows: number }>();
  const causeMap = new Map<string, CauseStat>();
  const unmatchedMap = new Map<string, UnmatchedStat>();
  const originMonth = new Map<string, { prod: number; contractor: number; both: number; unknown: number }>();

  for (const row of factory.scrap) {
    if (!scrapVisible(row, scope, true)) continue;
    qRaw += row.qty;
    if (!row.reason) emptyReason += 1;
    const bucket = originQty.get(row.origin) ?? { qty: 0, rows: 0 };
    bucket.qty += row.qty;
    bucket.rows += 1;
    originQty.set(row.origin, bucket);
    const om = originMonth.get(row.month) ?? { prod: 0, contractor: 0, both: 0, unknown: 0 };
    om[row.origin] += row.qty;
    originMonth.set(row.month, om);
    const reason = row.reason || "بدون شرح ایراد";
    const cause = causeMap.get(reason) ?? { reason, qty: 0, rows: 0 };
    cause.qty += row.qty;
    cause.rows += 1;
    causeMap.set(reason, cause);
    if (row.match !== "exact" && row.match !== "canon") {
      const key = `${row.code}|${row.title}`;
      const item = unmatchedMap.get(key) ?? {
        title: row.title,
        code: row.code,
        qty: 0,
        rows: 0,
        guess: FAMILY_LABEL[guessFamily(row)] ?? "نامشخص",
      };
      item.qty += row.qty;
      item.rows += 1;
      unmatchedMap.set(key, item);
    }
  }

  const months: MonthStat[] = factory.months.map((key) => {
    const sub: Scope = { ...scope, months: [key] };
    const nMap = productionOf(sub, false);
    let nn = 0;
    for (const v of nMap.values()) nn += v;
    const block = rateBlock(sub, nMap, nSplit);
    let q = 0;
    for (const row of factory.scrap) {
      if (!scrapVisible(row, sub, true)) continue;
      q += row.qty;
    }
    return {
      key,
      label: monthLabel(key),
      n: nn,
      q,
      rBom: block.rBom,
    };
  });

  const familyIds = ["mini", "rm5", "c70", "wm10", "wm8a", "wm8b", "dw"];
  const families: FamilyStat[] = familyIds
    .filter((id) => scope.group === "all" || familyGroup(id) === scope.group)
    .filter((id) => scope.family === "all" || scope.family === id)
    .map((id) => {
      const sub: Scope = { ...scope, family: id, group: "all", model: "all" };
      const nMap = productionOf(sub, false);
      const nn = nMap.get(id) ?? 0;
      const block = rateBlock(sub, nMap, nSplit);
      return {
        id,
        label: FAMILY_LABEL[id] ?? id,
        n: nn,
        rBom: block.rBom,
      };
    });

  const nByModel = new Map<string, { n: number; nB: number }>();
  for (const cell of factory.prod) {
    if (!monthOk(cell.month, scope.months)) continue;
    const model = modelByCode.get(cell.code);
    if (!model || !familyAllowed(model.family, scope)) continue;
    const cur = nByModel.get(cell.code) ?? { n: 0, nB: 0 };
    cur.n += cell.qty;
    if (cell.grade === "B") cur.nB += cell.qty;
    nByModel.set(cell.code, cur);
  }
  const models: ModelStat[] = factory.models
    .filter((m) => familyAllowed(m.family, { ...scope, model: "all" }))
    .map((m) => {
      const stat = nByModel.get(m.code) ?? { n: 0, nB: 0 };
      const famN = nFamily.get(m.family) ?? 0;
      return {
        code: m.code,
        name: m.name,
        family: m.family,
        color: m.color,
        pattern: m.pattern,
        n: stat.n,
        nB: stat.nB,
        share: famN > 0 ? (stat.n / famN) * 100 : null,
      };
    })
    .filter((m) => m.n > 0)
    .sort((a, b) => b.n - a.n);

  const selected = scope.model === "all" ? null : (models.find((m) => m.code === scope.model) ?? null);

  return {
    n,
    nAllFamily,
    nB,
    qRaw,
    emptyReason,
    rBom: rated.rBom,
    months,
    families,
    origins: ["prod", "contractor", "both", "unknown"].map((id) => ({
      id,
      label: ORIGIN_LABEL[id] ?? id,
      qty: originQty.get(id)?.qty ?? 0,
      rows: originQty.get(id)?.rows ?? 0,
    })),
    originMonth: factory.months.map((key) => ({
      key,
      label: monthLabel(key),
      ...(originMonth.get(key) ?? { prod: 0, contractor: 0, both: 0, unknown: 0 }),
    })),
    parts: rated.parts.sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1) || b.load - a.load),
    causes: [...causeMap.values()].sort((a, b) => b.qty - a.qty),
    unmatched: [...unmatchedMap.values()].sort((a, b) => b.qty - a.qty),
    models,
    selected,
  };
}

export function scrapRowsForPart(partId: string, scope: Scope): ScrapRow[] {
  return factory.scrap.filter(
    (row) =>
      row.bomIds.includes(partId) &&
      scrapVisible(row, scope, true) &&
      (row.match === "exact" || row.match === "canon"),
  );
}
