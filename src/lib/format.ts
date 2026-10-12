const MONTHS: Record<string, string> = {
  "1405/01": "فروردین",
  "1405/02": "اردیبهشت",
  "1405/03": "خرداد",
  "1405/04": "تیر",
  "1405/05": "مرداد",
  "1405/06": "شهریور",
};

export function monthLabel(key: string): string {
  return MONTHS[key] ?? key;
}

export function faNum(n: number | null | undefined, digits = 0): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("fa-IR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function faPct(n: number | null | undefined, digits = 2): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${faNum(n, digits)}٪`;
}

export const FAMILY_LABEL: Record<string, string> = {
  mini: "یخچال مینی",
  rm5: "یخچال CM-RM5",
  c70: "یخچال C70",
  wm10: "لباسشویی ۱۰ کیلو",
  wm8a: "لباسشویی ۸T2 / ۹T1",
  wm8b: "لباسشویی ۸T3 / ۹T2",
  dw: "ظرفشویی",
};

export const GROUP_LABEL: Record<string, string> = {
  all: "همه گروه‌ها",
  fridge: "یخچال",
  wm: "لباسشویی",
  dw: "ظرفشویی",
};

export function familyGroup(id: string): "fridge" | "wm" | "dw" | "other" {
  if (id === "mini" || id === "rm5" || id === "c70") return "fridge";
  if (id === "wm10" || id === "wm8a" || id === "wm8b") return "wm";
  if (id === "dw") return "dw";
  return "other";
}

export const ORIGIN_LABEL: Record<string, string> = {
  all: "همه منشأها",
  prod: "تولید",
  contractor: "پیمانکار",
  both: "مشترک",
  unknown: "نامشخص",
};

export const COLOR_LABEL: Record<string, string> = {
  white: "سفید",
  gloss: "مشکی براق",
  matte: "مشکی مات",
  red: "قرمز",
  blue: "آبی",
  green: "سبز",
  pink: "صورتی",
  steel: "استیل",
  inox: "اینوکس",
  pattern: "طرح‌دار",
};
