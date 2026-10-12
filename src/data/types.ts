export type Origin = "prod" | "contractor" | "both" | "unknown";
export type MatchKind = "exact" | "canon" | "ambiguous" | "none";

export type ModelRow = {
  code: string;
  name: string;
  family: string;
  color: string | null;
  pattern: boolean;
};

export type BomPart = {
  id: string;
  family: string;
  title: string;
  unit: string;
  c: number;
  s: number;
  dups: number;
};

export type ScrapRow = {
  id: number;
  month: string;
  date: string;
  wh: string;
  code: string;
  title: string;
  reason: string;
  origin: Origin;
  qty: number;
  match: MatchKind;
  bomIds: string[];
  color: string | null;
  note: string;
};

export type ProdCell = {
  code: string;
  month: string;
  grade: "A" | "B";
  qty: number;
};

export type SerialRow = {
  grade: "A" | "B";
  serial: string;
  code: string;
  month: string;
};

export type Issue = {
  level: "warn" | "danger" | "info";
  title: string;
  detail: string;
};

export type FactoryData = {
  months: string[];
  models: ModelRow[];
  bom: BomPart[];
  scrap: ScrapRow[];
  prod: ProdCell[];
  serials: SerialRow[];
  issues: Issue[];
};
