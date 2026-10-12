import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as qtyText, a as Note, c as Shell, f as factory, l as bomById, o as ORIGIN_LABEL, r as FAMILY_LABEL, s as Panel, u as faNum, y as useFilters } from "./widgets-DxwXF1wO.mjs";
import { t as buildView } from "./metrics-BdWMn0BD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-DCXDAPKL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DataPage() {
	const filters = useFilters();
	const scope = {
		months: filters.months,
		group: filters.group,
		family: filters.family,
		model: filters.model,
		origin: filters.origin
	};
	const view = (0, import_react.useMemo)(() => buildView(scope), [
		filters.months,
		filters.group,
		filters.family,
		filters.model,
		filters.origin
	]);
	const [tab, setTab] = (0, import_react.useState)("scrap");
	const [q, setQ] = (0, import_react.useState)("");
	const query = q.trim();
	const scrap = (0, import_react.useMemo)(() => {
		return factory.scrap.filter((row) => {
			if (filters.months.length && !filters.months.includes(row.month)) return false;
			if (filters.origin !== "all" && row.origin !== filters.origin) return false;
			if (!query) return inFamily(row, filters.family, filters.group, view);
			return `${row.title} ${row.code} ${row.reason} ${row.date}`.includes(query) && inFamily(row, filters.family, filters.group, view);
		});
	}, [
		filters.months,
		filters.origin,
		filters.family,
		filters.group,
		query,
		view
	]);
	const serials = factory.serials.filter((s) => {
		if (filters.months.length && !filters.months.includes(s.month)) return false;
		const model = factory.models.find((m) => m.code === s.code);
		if (!model) return false;
		if (filters.model !== "all" && s.code !== filters.model) return false;
		if (filters.family !== "all" && model.family !== filters.family) return false;
		if (!query) return true;
		return `${s.serial} ${model.name} ${s.code}`.includes(query);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "داده‌های خام و مغایرت"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-fg-muted",
				children: "هیچ ردیفی حذف نشده. چیزی که در شاخص نیست اینجا برچسب خورده است."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => exportScrap(scrap),
				className: "h-10 rounded-sm bg-primary px-3 text-xs font-medium text-primary-fg",
				children: "استخراج CSV ضایعات"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex gap-2",
			children: [
				["scrap", "ضایعات"],
				["prod", "تولید"],
				["gap", "مغایرت"]
			].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: tab === id ? "rounded-sm bg-primary px-3 py-2 text-xs text-primary-fg" : "rounded-sm bg-bg-elevated px-3 py-2 text-xs shadow-border",
				children: label
			}, id))
		}),
		tab === "gap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [factory.issues.map((issue) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
				tone: issue.level === "info" ? "info" : issue.level,
				title: issue.title,
				children: issue.detail
			}, issue.title)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "بزرگ‌ترین مقدارهای بدون ضریب",
				subtitle: "این‌ها در نرخ واقعی نیستند. حدس خانواده فقط برای گروه‌بندی است.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[36rem] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-xs text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "عنوان"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "کد"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "حدس"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-left font-medium",
									children: "مقدار"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.unmatched.slice(0, 25).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5",
									children: row.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 text-xs",
									children: row.code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5",
									children: row.guess
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 text-left tabular",
									children: qtyText(row.qty)
								})
							]
						}, `${row.code}-${row.title}`)) })]
					})
				})
			})]
		}) : null,
		tab !== "gap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: tab === "scrap" ? "جست‌وجوی قطعه، کد، علت یا تاریخ" : "جست‌وجوی سریال یا مدل",
			className: "mb-3 h-10 w-full rounded-sm border border-border bg-bg-elevated px-3 text-sm outline-none"
		}) : null,
		tab === "scrap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: `${faNum(scrap.length)} ردیف`,
			subtitle: "فیلترهای بالای صفحه روی این جدول هم هست.",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[32rem] overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[56rem] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-xs text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "تاریخ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "کد"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "عنوان"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "علت"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "منشأ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "تطبیق"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-left font-medium",
									children: "مقدار"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: scrap.slice(0, 200).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2",
								children: row.date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-xs",
								children: row.code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "max-w-xs py-2",
								children: row.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2",
								children: row.reason || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2",
								children: ORIGIN_LABEL[row.origin]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-xs",
								children: row.match === "exact" || row.match === "canon" ? bomById.get(row.bomIds[0] ?? "")?.title ?? "وصل" : row.match === "ambiguous" ? "مبهم" : "بدون ضریب"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-left tabular",
								children: qtyText(row.qty)
							})
						]
					}, row.id)) })]
				})
			}), scrap.length > 200 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-fg-muted",
				children: "۲۰۰ ردیف اول. برای بقیه جست‌وجو یا CSV را استفاده کنید."
			}) : null]
		}) : null,
		tab === "prod" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: `${faNum(serials.length)} سریال`,
			subtitle: "هر سریال یک دستگاه است.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[32rem] overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[40rem] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-xs text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "سریال"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "مدل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "ماه"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 text-right font-medium",
									children: "درجه"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: serials.slice(0, 200).map((row) => {
						const model = factory.models.find((m) => m.code === row.code);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 tabular",
									children: row.serial
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2",
									children: [model?.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-2 text-xs text-fg-subtle",
										children: FAMILY_LABEL[model?.family ?? ""]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: row.month
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: row.grade
								})
							]
						}, row.serial);
					}) })]
				})
			})
		}) : null
	] });
}
function inFamily(row, family, group, view) {
	if (family === "all" && group === "all") return true;
	const allowed = new Set(view.families.map((f) => f.id));
	if (row.bomIds.length) return row.bomIds.some((id) => {
		const part = bomById.get(id);
		return part ? allowed.has(part.family) || family === part.family : false;
	});
	const guess = view.unmatched.find((u) => u.title === row.title && u.code === row.code)?.guess;
	if (!guess) return family === "all";
	const id = Object.entries(FAMILY_LABEL).find(([, label]) => label === guess)?.[0];
	if (!id) return family === "all" && group === "all";
	return allowed.has(id);
}
function exportScrap(rows) {
	const csv = [[
		"تاریخ",
		"ماه",
		"انبار",
		"کد",
		"عنوان",
		"علت",
		"منشأ",
		"مقدار",
		"وضعیت تطبیق",
		"قطعه ضریب",
		"یادداشت"
	], ...rows.map((row) => [
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
		row.note
	])].map((line) => line.map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
	const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = "scrap-filtered.csv";
	a.click();
	URL.revokeObjectURL(a.href);
}
//#endregion
export { DataPage as component };
