import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as qtyText, a as Note, c as Shell, d as faPct, g as pctWidth, i as Kpi, r as FAMILY_LABEL, s as Panel, t as BarRow, u as faNum, v as rateText, y as useFilters } from "./widgets-DxwXF1wO.mjs";
import { t as buildView } from "./metrics-BdWMn0BD.mjs";
import { a as CartesianGrid, c as Tooltip, i as Line, l as Legend, n as YAxis, o as Bar, r as XAxis, s as ResponsiveContainer, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-9tTM4z8O.js
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
	const modelNote = view.selected ? `فیلتر مدل فقط حجم تولید و درجه B را به «${view.selected.name}» محدود کرده. نرخ واقعی همچنان برای کل خانواده ${FAMILY_LABEL[view.selected.family] ?? ""} است، چون ضایعات شماره مدل ندارد.` : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "نمای مدیریت ضایعات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted",
				children: "تولید از روی سریال جمع‌آوری‌شده و ضایعات از روی مقدار ثبت‌شده است. رتبه اصلی با نرخ واقعی است، نه با تعداد خام."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Note, {
				tone: "warn",
				title: "نرخ واقعی، کل ضایعات نیست",
				children: [
					faPct(view.cover, 1),
					" از مقدار ضایعات به فایل ضریب وصل شده و در شاخص آمده است.",
					" ",
					qtyText(view.qRaw - view.qMatched),
					" عدد، از جمله خیلی از نیم‌ساخته‌ها، ضریب ندارند و حذف نشده‌اند؛ در بخش داده‌ها مانده‌اند."
				]
			}), modelNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
				tone: "info",
				title: "فیلتر مدل",
				children: modelNote
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
				tone: "info",
				title: "دو عدد را با هم نخوانید",
				children: "نرخ خام، عدد ضایعات بر دستگاه است. نرخ واقعی، درصد مصرف مورد انتظار بعد از ضریب مصرف و درجه اهمیت است."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "حجم تولید",
					value: faNum(view.n),
					unit: "دستگاه",
					hint: view.selected ? `همین مدل. کل خانواده در این فیلتر: ${faNum(view.nAllFamily)} دستگاه.` : "شمارش سریال فایل تولید، درجه A و B هر دو."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "ضایعات خام",
					value: qtyText(view.qRaw),
					unit: "عدد (ستون مقدار)",
					hint: "جمع مقدار، هر ردیف یک‌بار. این عدد رتبه قطعه نیست."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "نرخ خام",
					value: view.rawPerUnit == null ? "—" : faNum(view.rawPerUnit, 2),
					unit: "عدد به ازای هر دستگاه خانواده",
					hint: "ضایعات خام ÷ تولید خانواده. بدون ضریب مصرف و بدون اهمیت."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "نرخ واقعی کل BOM",
					value: rateText(view.rBom),
					unit: "درصد از مصرف مورد انتظار وزنی",
					hint: "صورت: مقدار × اهمیت. مخرج: تولید × ضریب مصرف × اهمیت، برای همه قطعات دارای ضریب.",
					tone: view.rBom != null && view.rBom >= 1 ? "danger" : "default"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "نرخ قطعات ضایعات‌دار",
					value: rateText(view.rOcc),
					unit: "درصد، فقط قطعاتی که ضایعات داشته‌اند",
					hint: "همان وزن‌ها، ولی مخرج فقط قطعات با مقدار بزرگ‌تر از صفر است.",
					tone: "warn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "درجه B محصول نهایی",
					value: faNum(view.nB),
					unit: `دستگاه · ${faPct(view.n > 0 ? view.nB / view.n * 100 : null, 2)} از تولید همین نما`,
					hint: "درجه کیفی سریال است، جدا از ضایعات قطعه. در مخرج تولید هم شمرده می‌شود."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 grid gap-3 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
					tone: "danger",
					title: worstFamily ? `بحرانی‌ترین خانواده: ${worstFamily.label}` : "خانواده",
					children: worstFamily ? `نرخ واقعی ${rateText(worstFamily.rBom)} با تولید ${faNum(worstFamily.n)} دستگاه. پوشش ضریب این خانواده ${faPct(worstFamily.cover, 0)} است.` : "در این فیلتر خانواده‌ای با مخرج تولید و ضریب نیست."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
					tone: "warn",
					title: worstMonth ? `ماه اوج شاخص: ${worstMonth.label}` : "روند ماه",
					children: worstMonth ? `نرخ واقعی ${rateText(worstMonth.rBom)} در برابر تولید ${faNum(worstMonth.n)} دستگاه. ماه‌های با تولید کمتر از ۱۰۰ دستگاه از این انتخاب کنار گذاشته شده‌اند.` : "ماه واجد شرایطی برای مقایسه نیست."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
					tone: "info",
					title: "علت پرتکرار از نظر مقدار",
					children: topCause ? `«${topCause.reason}» با ${qtyText(topCause.qty)} عدد در ${faNum(topCause.rows)} ردیف. این رتبه خام است چون علت، ضریب مصرف ندارد.` : "علتی در این فیلتر نیست."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 xl:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "xl:col-span-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "روند ماهانه",
					subtitle: "ستون، تولید و ضایعات خام است. خط، نرخ واقعی کل BOM بر حسب درصد.",
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
										if (name === "نرخ واقعی") return [faPct(n, 2), name];
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										yAxisId: "qty",
										dataKey: "q",
										name: "ضایعات خام",
										fill: "var(--color-chart-4)",
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
										name: "نرخ واقعی",
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
					subtitle: "مرتب‌شده با نرخ واقعی، نه با تعداد ضایعات.",
					children: view.families.slice().sort((a, b) => (b.rBom ?? -1) - (a.rBom ?? -1)).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
						index: i + 1,
						label: f.label,
						meta: `${faNum(f.n)} دستگاه`,
						value: f.rBom == null ? "نرخ ندارد" : rateText(f.rBom),
						width: pctWidth(f.rBom ?? 0, Math.max(...view.families.map((x) => x.rBom ?? 0), .01))
					}, f.id))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "بالاترین نرخ واقعی قطعه",
				subtitle: "فقط قطعات با مصرف مورد انتظار حداقل ۵. واحد: درصد مصرف همان قطعه.",
				children: [byRate.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg-muted",
					children: "قطعه‌ای با این شرط در فیلتر نیست."
				}) : byRate.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
					index: i + 1,
					label: p.title,
					meta: `${FAMILY_LABEL[p.family] ?? p.family} · اهمیت ${faNum(p.s, 0)}`,
					value: rateText(p.rate),
					width: pctWidth(p.rate ?? 0, maxRate)
				}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/quality",
					className: "mt-3 inline-block text-xs text-primary",
					children: "جدول کامل قطعات"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "بالاترین بار وزنی",
				subtitle: "مقدار × درجه اهمیت. این رتبه هنوز تعداد خامِ بی‌وزن نیست.",
				children: byLoad.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarRow, {
					index: i + 1,
					label: p.title,
					meta: `نرخ ${rateText(p.rate)}`,
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
				subtitle: "واحد: عدد. بدون ضریب. برای اولویت ظاهری است نه شاخص رسمی.",
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
