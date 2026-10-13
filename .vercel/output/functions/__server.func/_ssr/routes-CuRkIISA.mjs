import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as qtyText, g as pctWidth, i as Note, l as faNum, n as FAMILY_LABEL, o as Panel, p as importanceLabel, r as Kpi, s as Shell, t as BarRow, u as faPct, v as rateText, y as useFilters } from "./widgets-BAyxnzMj.mjs";
import { t as buildView } from "./metrics-CnqHy9C0.mjs";
import { a as CartesianGrid, c as Tooltip, i as Line, l as Legend, n as YAxis, o as Bar, r as XAxis, s as ResponsiveContainer, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CuRkIISA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const filters = useFilters();
	const view = (0, import_react.useMemo)(() => buildView({
		months: filters.months,
		group: filters.group,
		family: filters.family,
		model: filters.model,
		origin: filters.origin
	}), [
		filters.months,
		filters.group,
		filters.family,
		filters.model,
		filters.origin
	]);
	const byRate = [...view.parts.filter((p) => p.q > 0 && p.e >= 5)].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0)).slice(0, 6);
	const byLoad = [...view.parts].filter((p) => p.q > 0).sort((a, b) => b.load - a.load).slice(0, 6);
	const maxRate = byRate[0]?.rate ?? 1;
	const maxLoad = byLoad[0]?.load ?? 1;
	const worstMonth = [...view.months].filter((m) => m.n >= 100 && m.rBom != null).sort((a, b) => (b.rBom ?? 0) - (a.rBom ?? 0))[0];
	const worstFamily = [...view.families].filter((f) => f.rBom != null && f.n > 0).sort((a, b) => (b.rBom ?? 0) - (a.rBom ?? 0))[0];
	const topCause = view.causes[0];
	const maxOrigin = Math.max(...view.origins.map((o) => o.qty), 1);
	const modelNote = view.selected ? `با انتخاب «${view.selected.name}» تعداد تولید و درجه B فقط همین مدل است. درصد ضایعات برای کل ${FAMILY_LABEL[view.selected.family] ?? "خانواده"} مانده، چون ردیف ضایعات نام مدل ندارد.` : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "نمای مدیریت ضایعات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted",
				children: "درصد ضایعات هر قطعه، مقدار ضایعات همان قلم تقسیم بر ضریب مصرف ضربدر تعداد تولید است. شاخص کلان همین نسبت را با درجه اهمیت وزن می‌کند."
			})]
		}),
		modelNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
			tone: "info",
			title: "فیلتر مدل",
			children: modelNote
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "حجم تولید",
					value: faNum(view.n),
					unit: "دستگاه",
					hint: view.selected ? `همین مدل. کل ${FAMILY_LABEL[view.selected.family] ?? "خانواده"} در این بازه: ${faNum(view.nAllFamily)} دستگاه.` : "شمارش سریال فایل تولید. درجه A و B هر دو داخل تعداد تولید هستند."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "مقدار ضایعات",
					value: qtyText(view.qRaw),
					unit: "جمع ستون مقدار",
					hint: "این عدد رتبه قطعه نیست. درصد ضایعات از روی ضریب مصرف و اهمیت ساخته می‌شود."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "نرخ واقعی درصد ضایعات",
					value: rateText(view.rBom),
					unit: "شاخص کلان",
					hint: "صورت: جمع اهمیت × مقدار ضایعات. مخرج: جمع ضریب مصرف × اهمیت × تعداد تولید.",
					tone: view.rBom != null && view.rBom >= 1 ? "danger" : "default"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "درجه B محصول نهایی",
					value: faNum(view.nB),
					unit: `دستگاه · ${view.n > 0 ? faNum(view.nB / view.n * 100, 2) : "—"}٪ از تولید همین نما`,
					hint: "درجه کیفی سریال است و از تعداد تولید کم نشده است."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 grid gap-3 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
					tone: "danger",
					title: worstFamily ? `بحرانی‌ترین خانواده: ${worstFamily.label}` : "خانواده",
					children: worstFamily ? `نرخ واقعی درصد ضایعات ${rateText(worstFamily.rBom)} است، با تولید ${faNum(worstFamily.n)} دستگاه. این خانواده بالاترین شاخص کلان را در نمای فعلی دارد.` : "در این فیلتر خانواده‌ای با تعداد تولید و ضریب مصرف نیست."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
					tone: "warn",
					title: worstMonth ? `ماه اوج شاخص: ${worstMonth.label}` : "روند ماه",
					children: worstMonth ? `نرخ واقعی درصد ضایعات ${rateText(worstMonth.rBom)} است، در برابر تولید ${faNum(worstMonth.n)} دستگاه. ماه‌های با تولید کمتر از ۱۰۰ دستگاه از این انتخاب کنار گذاشته شده‌اند.` : "ماه واجد شرایطی برای مقایسه نیست."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
					tone: "info",
					title: "علت پرتکرار از نظر مقدار",
					children: topCause ? `«${topCause.reason}» با ${qtyText(topCause.qty)} عدد در ${faNum(topCause.rows)} ردیف. این فهرست روی جمع مقدار است، چون علت ضریب مصرف ندارد.` : "علتی در این فیلتر نیست."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 xl:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "xl:col-span-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "روند ماهانه",
					subtitle: "ستون فقط تعداد تولید است. خط، نرخ واقعی درصد ضایعات است. مقدار ضایعات کنار تولید کشیده نشده تا مقیاس‌ها با هم اشتباه گرفته نشوند.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72 w-full",
						dir: "ltr",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
								data: view.months,
								margin: {
									top: 8,
									right: 8,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										stroke: "var(--color-bg-subtle)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										tick: {
											fill: "var(--color-fg-muted)",
											fontSize: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										yAxisId: "qty",
										tick: {
											fill: "var(--color-fg-muted)",
											fontSize: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										yAxisId: "rate",
										orientation: "right",
										tick: {
											fill: "var(--color-danger)",
											fontSize: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (value, name) => {
										const n = typeof value === "number" ? value : Number(value);
										if (name === "درصد ضایعات") return [faPct(n, 2), name];
										return [faNum(n), name];
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										yAxisId: "qty",
										dataKey: "n",
										name: "تولید",
										fill: "var(--color-primary)",
										radius: [
											4,
											4,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										yAxisId: "rate",
										dataKey: "rBom",
										name: "درصد ضایعات",
										stroke: "var(--color-danger)",
										strokeWidth: 2,
										dot: false
									})
								]
							})
						})
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "xl:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "مقایسه خانواده",
					subtitle: "مرتب‌شده با نرخ واقعی درصد ضایعات.",
					children: view.families.slice().sort((a, b) => (b.rBom ?? -1) - (a.rBom ?? -1)).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
						index: i + 1,
						label: f.label,
						meta: `${faNum(f.n)} دستگاه`,
						value: f.rBom == null ? "تعریف نشده" : rateText(f.rBom),
						width: pctWidth(f.rBom ?? 0, Math.max(...view.families.map((x) => x.rBom ?? 0), .01))
					}, f.id))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "بالاترین درصد ضایعات قطعه",
				subtitle: "درصد ضایعات یک قلم = مقدار ضایعات همان قلم ÷ (ضریب مصرف × تعداد تولید). فقط قطعاتی که مصرف مورد انتظارشان حداقل ۵ است، تا درصد روی تعداد خیلی کم بالا نرود.",
				children: [byRate.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "قطعه‌ای با این شرط در فیلتر نیست."
				}) : byRate.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
					index: i + 1,
					label: p.title,
					meta: `${FAMILY_LABEL[p.family] ?? p.family} · ${importanceLabel(p.s)}`,
					value: rateText(p.rate),
					width: pctWidth(p.rate ?? 0, maxRate)
				}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/quality",
					className: "mt-3 inline-block text-xs text-primary",
					children: "جدول کامل قطعات"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "بیشترین اثر در شاخص کلان",
				subtitle: "اثر قطعه = مقدار ضایعات × درجه اهمیت. اهمیت ۳ بسیار بحرانی، ۲ بحرانی و ۱ غیر بحرانی است. این عدد خودش درصد نیست.",
				children: byLoad.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
					index: i + 1,
					label: p.title,
					meta: `درصد ضایعات ${rateText(p.rate)}`,
					value: qtyText(p.load),
					width: pctWidth(p.load, maxLoad)
				}, p.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "منشأ ضایعات",
				subtitle: "مقدار خام. ردیف مشترک در تولید و پیمانکار دوباره جمع نشده؛ ستون جدا دارد.",
				children: [view.origins.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
					index: i + 1,
					label: o.label,
					meta: `${faNum(o.rows)} ردیف`,
					value: qtyText(o.qty),
					width: pctWidth(o.qty, maxOrigin)
				}, o.id)), filters.origin !== "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs leading-relaxed text-fg-muted",
					children: "فیلتر منشأ فقط صورت کسر را محدود کرده. مخرج مصرف مورد انتظار همان تولید کل خانواده است."
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "علت‌ها بر اساس مقدار",
				subtitle: "جمع ستون مقدار. علت در فرمول درصد ضایعات نیست.",
				children: view.causes.slice(0, 6).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
					index: i + 1,
					label: c.reason,
					meta: `${faNum(c.rows)} ردیف`,
					value: qtyText(c.qty),
					width: pctWidth(c.qty, view.causes[0]?.qty ?? 1)
				}, c.reason))
			})]
		})
	] });
}
//#endregion
export { Home as component };
