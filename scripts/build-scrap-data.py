#!/usr/bin/env python3
"""Build src/data/factory.json from the three source workbooks.

Matching policy (conservative, documented in the app):
- Exact normalized name, or the same name after dropping only status/color/family tokens.
- Subset match only when extra tokens are 1–2 characters (codes like M/G), never real words.
- Conflicting dimension tokens reject the match.
- wm-8t3 sheet codes are ignored (they are a shifted copy of the wm-10 template).
- A part name that lands on more than one family stays unmatched, except
  لباسشویی 8T2/9T1 and 8T3/9T2 sharing the same name (one physical part, two lines).
"""
from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import datetime, date
from openpyxl import load_workbook

TRANS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
YEH = str.maketrans({"ي": "ی", "ك": "ک", "ة": "ه", "أ": "ا", "إ": "ا"})
DROP = set(
    """
    mini minim min c70 c60 c2s fr16 h wm dw sky
    نیمه ساخته رنگ شده abs جدید قرمز مشکی سفید آبی سبز صورتی مات براق استخوانی پاستیلی
    اینوکس استیل هاردستون bl gr bk bk02 wh re pi
    مشترک lm70 lm60 lm70c lm70rc
    """.split()
)

FAMILIES = ["mini", "rm5", "c70", "wm10", "wm8a", "wm8b", "dw"]


def norm(s: object) -> str:
    s = str(s or "").translate(TRANS).translate(YEH)
    s = s.replace("\u200c", " ").replace("\xa0", " ").lower()
    s = s.replace("×", "x").replace("*", "x")
    s = re.sub(r"[()\[\]\{\}\-–—_:،,./\\«»\"+]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def canon_tokens(n: str) -> list[str]:
    return [t for t in n.split() if t not in DROP and t != "با" and len(t) > 1]


def num(x: object) -> float | None:
    if x is None or x == "":
        return None
    if isinstance(x, (int, float)):
        return float(x)
    s = str(x).translate(TRANS).strip().replace("٫", ".").replace("/", ".").replace(",", "")
    try:
        return float(s)
    except ValueError:
        return None


def jalali_month(value: object) -> str:
    if isinstance(value, (datetime, date)):
        return f"{value.year:04d}/{value.month:02d}"
    s = str(value or "").translate(TRANS).strip()
    m = re.match(r"(\d{4})[/-](\d{1,2})", s)
    if not m:
        return ""
    return f"{int(m.group(1)):04d}/{int(m.group(2)):02d}"


def jalali_date(value: object) -> str:
    if isinstance(value, (datetime, date)):
        return f"{value.year:04d}/{value.month:02d}/{value.day:02d}"
    s = str(value or "").translate(TRANS).strip().replace("-", "/")
    m = re.match(r"(\d{4})/(\d{1,2})/(\d{1,2})", s)
    if not m:
        return jalali_month(value)
    return f"{int(m.group(1)):04d}/{int(m.group(2)):02d}/{int(m.group(3)):02d}"


def parse_sheet(ws, mode: str) -> list[dict]:
    acc: dict[str, dict] = {}
    order: list[str] = []
    for i, r in enumerate(ws.iter_rows(values_only=True)):
        if i < 2:
            continue
        rr = list(r)
        if mode == "c":
            title, unit, qty, imp = (rr + [None] * 6)[2:6]
        else:
            title, unit, qty, imp = (rr + [None] * 4)[:4]
        if not title:
            continue
        t = str(title).strip()
        if t.startswith("مجموع"):
            continue
        q, im = num(qty), num(imp)
        if q is None or im is None:
            continue
        n = norm(t)
        if n not in acc:
            acc[n] = {
                "title": t,
                "n": n,
                "ct": canon_tokens(n),
                "unit": str(unit or "").strip(),
                "c": q,
                "w": q * float(im),
                "s": float(im),
                "dups": 1,
            }
            order.append(n)
        else:
            acc[n]["c"] += q
            acc[n]["w"] += q * float(im)
            acc[n]["s"] = acc[n]["w"] / acc[n]["c"] if acc[n]["c"] else float(im)
            acc[n]["dups"] += 1
    return [acc[key] for key in order]


def parse_bom(path: str) -> list[dict]:
    """Sheets are the coefficient file only. Foam injection is part of mini output, not its own line."""
    wb = load_workbook(path, data_only=True, read_only=True)
    specs = [
        ("wm10", "wm-10", "c"),
        ("wm8a", "wm-8t2-9t1", "p"),
        ("wm8b", "wm-8t3-9t2", "c"),
        ("dw", "DW", "p"),
        ("mini", "MINI", "p"),
        ("mini", "فوم", "p"),
        ("c70", "C70", "p"),
    ]
    bom: list[dict] = []
    seq: dict[str, int] = defaultdict(int)
    for fam, sheet, mode in specs:
        if sheet not in wb.sheetnames:
            continue
        for p in parse_sheet(wb[sheet], mode):
            p["family"] = fam
            p["id"] = f"{fam}-{seq[fam]}"
            seq[fam] += 1
            p.pop("w", None)
            bom.append(p)
    wb.close()
    return bom


def prefer(sn: str, fams: list[str]) -> list[str]:
    if "c70" in sn or "fr16" in sn:
        return [f for f in fams if f == "c70"]
    if "mini" in sn or "minim" in sn:
        return [f for f in fams if f == "mini"]
    if any(x in sn for x in ["8t3", "9t2", "8ti3", "9ti2", "8tw3", "9tw2"]):
        return [f for f in fams if f == "wm8b"]
    if any(x in sn for x in ["8t2", "9t1", "8ti2", "9ti1", "8tw2", "9tw1"]):
        return [f for f in fams if f == "wm8a"]
    if "10kg" in sn:
        return [f for f in fams if f == "wm10"]
    if "ظرفشو" in sn or "h dw" in sn or sn.startswith("dw ") or " dw " in f" {sn} ":
        return [f for f in fams if f == "dw"]
    return fams


def match_title(title: str, wh: str, bom: list[dict]) -> tuple[str, list[dict], str]:
    sn = norm(title)
    allow = {"mini", "c70"} if "یخچال" in (wh or "") else {"wm10", "wm8a", "wm8b", "dw"}
    ct = canon_tokens(sn)
    hits: list[tuple[int, dict]] = []
    for p in bom:
        if p["family"] not in allow:
            continue
        if sn == p["n"]:
            hits.append((100, p))
            continue
        pt = p["ct"]
        if not ct or not pt:
            continue
        na = [t for t in ct if re.search(r"\d", t)]
        nb = [t for t in pt if re.search(r"\d", t)]
        if na and nb and set(na) != set(nb):
            continue
        if ct == pt:
            hits.append((90, p))
            continue
        a, b = set(ct), set(pt)
        if a <= b or b <= a:
            short, long_ = (a, b) if len(a) <= len(b) else (b, a)
            extra = long_ - short
            strong = len(short) >= 2 or (len(short) == 1 and min(len(t) for t in short) >= 6)
            if strong and extra and all(len(t) <= 2 for t in extra):
                hits.append((80, p))
    if not hits:
        return "none", [], ""
    top = max(s for s, _ in hits)
    tops = [p for s, p in hits if s == top]
    fams = prefer(sn, list({p["family"] for p in tops}))
    chosen = [p for p in tops if p["family"] in fams]
    if not chosen:
        return "none", [], "پیشوند خانواده با BOM مقصد نخواند"
    fam_set = {p["family"] for p in chosen}
    if fam_set <= {"wm8a", "wm8b"} and len(fam_set) >= 1:
        # keep both lines when the name is shared; caller gets every chosen part
        note = "exact" if top == 100 else "گونه‌نویسی یکسان پس از حذف رنگ/وضعیت"
        return ("exact" if top == 100 else "canon"), chosen, note
    if len(fam_set) != 1:
        names = "، ".join(sorted(fam_set))
        return "ambiguous", chosen, f"نام در چند خانواده هست: {names}"
    # one part per family (duplicates already merged)
    best = chosen[0]
    note = "exact" if top == 100 else "گونه‌نویسی یکسان پس از حذف رنگ/وضعیت"
    return ("exact" if top == 100 else "canon"), [best], note


def scrap_color(title: str) -> str | None:
    if "صورتی" in title:
        return "pink"
    if "آبی" in title or "Bl-01" in title or "BL-01" in title:
        return "blue"
    if "سبز" in title or "Gr-01" in title:
        return "green"
    if "قرمز" in title:
        return "red"
    if "استخوانی" in title or "سفید" in title:
        return "white"
    if "مات" in title or "BK02" in title or "BK2" in title:
        return "matte"
    if "مشکی" in title or "براق" in title:
        return "gloss"
    if "استیل" in title:
        return "steel"
    if "اینوکس" in title:
        return "inox"
    if "طرح" in title:
        return "pattern"
    return None


def classify_product(name: str, code: str) -> str:
    u = name.upper().replace(" ", "")
    if "ظرفشو" in name or code.startswith("5222"):
        return "dw"
    if "لباس" in name or code.startswith("5221"):
        if "H10" in u or "CWM" in u or "10کیلو" in name.replace(" ", ""):
            return "wm10"
        if any(x in u for x in ["8TI3", "8TW3", "9TI2", "9TW2"]):
            return "wm8b"
        if any(x in u for x in ["8TI2", "8TW2", "9TI1", "9TW1"]):
            return "wm8a"
        return "wm8b"
    if "RM5" in u:
        return "rm5"
    return "mini"


def color_of(name: str) -> str | None:
    u = name.upper()
    if "صورتی" in name or "PI1" in u or "PI3" in u:
        return "pink"
    if "آبی" in name:
        return "blue"
    if "سبز" in name:
        return "green"
    if "قرمز" in name:
        return "red"
    if "استیل" in name or "ST1" in u:
        return "steel"
    if "اینوکس" in name or re.search(r"TI\d", u):
        return "inox"
    if "مات" in name or "BK2" in u or re.search(r"B2\b", u):
        return "matte"
    if "براق" in name or "BK1" in u or "BK3" in u or re.search(r"B1\b", u):
        return "gloss"
    if "سفید" in name or "WH" in u or re.search(r"TW\d|VW\d", u):
        return "white"
    return None


def origin_of(prod: float, con: float) -> str:
    if prod > 0 and con > 0:
        return "both"
    if prod > 0:
        return "prod"
    if con > 0:
        return "contractor"
    return "unknown"


def main() -> None:
    root = "/workspace/attachments"
    bom = parse_bom(f"{root}/شدت اهمیت - ضریب مصرف  (2).xlsx")

    wb = load_workbook(f"{root}/ضایعات (2).xlsx", data_only=True, read_only=True)
    scrap_rows = list(wb[wb.sheetnames[0]].iter_rows(values_only=True))[1:]
    wb.close()
    scrap = []
    for i, r in enumerate(scrap_rows):
        if not r or r[3] is None:
            continue
        title = str(r[3]).strip()
        wh = str(r[0] or "").strip()
        kind, parts, note = match_title(title, wh, bom)
        pq, cq = num(r[5]) or 0, num(r[6]) or 0
        scrap.append(
            {
                "id": i + 1,
                "month": jalali_month(r[1]),
                "date": jalali_date(r[1]),
                "wh": wh,
                "code": "" if r[2] is None else str(r[2]).split(".")[0].strip(),
                "title": title,
                "reason": "" if r[4] is None else str(r[4]).strip(),
                "origin": origin_of(pq, cq),
                "qty": num(r[7]) or 0,
                "match": kind,
                "bomIds": [p["id"] for p in parts] if kind in ("exact", "canon") else [],
                "color": scrap_color(title),
                "note": "" if note == "exact" else note,
            }
        )

    wb = load_workbook(f"{root}/کل تولیدات 6 ماهه اول (2).xlsx", data_only=True, read_only=True)
    prod_rows = list(wb[wb.sheetnames[0]].iter_rows(values_only=True))[1:]
    wb.close()
    models: dict[str, dict] = {}
    cells: dict[tuple, int] = defaultdict(int)
    serials = []
    for r in prod_rows:
        if not r or r[3] is None:
            continue
        code = str(r[3]).split(".")[0].strip()
        name = str(r[2] or "").strip()
        grade = str(r[0] or "A").strip().upper()
        if grade not in ("A", "B"):
            grade = "A"
        month = jalali_month(r[5])
        if code not in models:
            models[code] = {
                "code": code,
                "name": name,
                "family": classify_product(name, code),
                "color": color_of(name),
                "pattern": "طرح" in name,
            }
        cells[(code, month, grade)] += 1
        serials.append(
            {
                "grade": grade,
                "serial": str(r[1] or "").strip(),
                "code": code,
                "month": month,
            }
        )

    bom_out = [
        {
            "id": p["id"],
            "family": p["family"],
            "title": p["title"],
            "unit": p["unit"],
            "c": round(p["c"], 6),
            "s": p["s"],
            "dups": p["dups"],
        }
        for p in bom
    ]
    issues = [
        {
            "level": "warn",
            "title": "بعضی ردیف‌های ضایعات در درصد نمی‌آیند",
            "detail": "اگر نام کالا در فایل ضریب مصرف نباشد، آن مقدار نه در صورت شاخص است و نه در مخرج. ردیف در جدول ضایعات می‌ماند.",
        },
        {
            "level": "warn",
            "title": "تولید C70 در فایل شش‌ماهه نیست",
            "detail": "برای این خانواده تعداد تولید صفر است، پس درصد ضایعات تعریف نمی‌شود و وارد شاخص کل نمی‌شود.",
        },
        {
            "level": "warn",
            "title": "یخچال CM-RM5 فایل ضریب جدا ندارد",
            "detail": "این مدل‌ها در تولید هستند. تا وقتی نام قطعه‌شان در شیت مینی یا C70 نباشد، در درصد ضایعات نمی‌آیند.",
        },
        {
            "level": "info",
            "title": "شیت تزریق فوم جزو یخچال مینی است",
            "detail": "قطعات شیت فوم با همان تعداد تولید مینی در مخرج می‌آیند، چون تولید جداگانه‌ای برای فوم ثبت نشده است.",
        },
    ]

    out = {
        "months": ["1405/01", "1405/02", "1405/03", "1405/04", "1405/05", "1405/06"],
        "models": list(models.values()),
        "bom": bom_out,
        "scrap": scrap,
        "prod": [
            {"code": c, "month": m, "grade": g, "qty": n}
            for (c, m, g), n in sorted(cells.items())
        ],
        "serials": serials,
        "issues": issues,
    }
    dest = "/workspace/src/data/factory.json"
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print("wrote", dest)
    # sanity
    from collections import Counter

    q = sum(s["qty"] for s in scrap)
    qm = sum(s["qty"] for s in scrap if s["match"] in ("exact", "canon"))
    print("models", len(models), "bom", len(bom_out), "scrap", len(scrap), "serials", len(serials))
    print("qty", q, "matched qty", qm, "cover", round(100 * qm / q, 2))
    print("match", Counter(s["match"] for s in scrap))
    print("origin", Counter(s["origin"] for s in scrap))
    print("families", Counter(m["family"] for m in models.values()))
    print("prod", sum(c["qty"] for c in out["prod"]), "B", sum(c["qty"] for c in out["prod"] if c["grade"] == "B"))


if __name__ == "__main__":
    main()
