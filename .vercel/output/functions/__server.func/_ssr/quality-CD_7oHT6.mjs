import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as qtyText, a as ORIGIN_LABEL, i as Note, l as faNum, n as FAMILY_LABEL, o as Panel, p as importanceLabel, s as Shell, u as faPct, v as rateText, y as useFilters } from "./widgets-BAyxnzMj.mjs";
import { n as scrapRowsForPart, t as buildView } from "./metrics-CnqHy9C0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quality-CD_7oHT6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QualityPage() {
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
	const [q, setQ] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("rate");
	const [onlyScrap, setOnlyScrap] = (0, import_react.useState)(true);
	const [open, setOpen] = (0, import_react.useState)(null);
	const parts = view.parts.filter((p) => onlyScrap ? p.q > 0 : true).filter((p) => {
		if (!q.trim()) return true;
		return `${p.title} ${FAMILY_LABEL[p.family] ?? ""}`.includes(q.trim());
	}).sort((a, b) => {
		if (sort === "q") return b.q - a.q;
		if (sort === "load") return b.load - a.load;
		if (sort === "s") return b.s - a.s || (b.rate ?? 0) - (a.rate ?? 0);
		return (b.rate ?? -1) - (a.rate ?? -1) || b.load - a.load;
	});
	const openPart = parts.find((p) => p.id === open) ?? view.parts.find((p) => p.id === open) ?? null;
	const trace = open ? scrapRowsForPart(open, scope) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "تحلیل کنترل کیفیت"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted",
				children: "ضایعات نام مدل ندارد، پس درصد ضایعات برای هر مدل جدا حساب نمی‌شود. جدول مدل فقط می‌گوید از هر مدل چند دستگاه ساخته شده و چند تا درجه B بوده است."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "روند در برابر حجم تولید",
			subtitle: "اگر تولید بالا باشد و درصد ضایعات هم بالا بماند، مسئله مربوط به یک ماه کم‌تیراژ نیست.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[32rem] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-xs text-fg-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "ماه" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تولید" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "مقدار ضایعات" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "درصد ضایعات" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.months.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5",
								children: m.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: faNum(m.n) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: qtyText(m.q) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: rateText(m.rBom) })
						]
					}, m.key)) })]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "تولید به تفکیک مدل",
				subtitle: "سهم از تولید خانواده یعنی این مدل چند درصد از دستگاه‌های همان خانواده را ساخته است. این سهم داخل فرمول درصد ضایعات نیست.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[46rem] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-xs text-fg-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "مدل" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "خانواده" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تولید" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "سهم از تولید خانواده" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "درجه B" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "درصد B" })
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: m.code === filters.model ? "border-t border-border bg-bg-subtle" : "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "max-w-xs py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: m.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-fg-subtle",
										children: m.code
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5",
									children: FAMILY_LABEL[m.family]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: faNum(m.n) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: faPct(m.share, 1) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: faNum(m.nB) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.n > 0 ? faPct(m.nB / m.n * 100, 2) : "—" })
							]
						}, m.code)) })]
					})
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "قطعات و درصد ضایعات",
				subtitle: "کلیک روی ردیف، ردیف‌های ضایعات همان قطعه و جای‌گذاری فرمول را نشان می‌دهد.",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-col gap-2 sm:flex-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "جست‌وجوی نام قطعه",
								className: "h-10 flex-1 rounded-sm border border-border bg-bg px-3 text-sm outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "مرتب‌سازی",
								value: sort,
								onChange: (e) => setSort(e.target.value),
								className: "h-10 rounded-sm border border-border bg-bg px-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rate",
										children: "درصد ضایعات"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "load",
										children: "اثر در شاخص"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "s",
										children: "درجه اهمیت"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "q",
										children: "مقدار ضایعات"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setOnlyScrap((v) => !v),
								className: "h-10 rounded-sm border border-border bg-bg-subtle px-3 text-xs",
								children: onlyScrap ? "فقط دارای ضایعات" : "همه قطعات"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[52rem] text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-xs text-fg-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "قطعه" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "ضریب مصرف" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "اهمیت" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "مقدار ضایعات" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "تولید × ضریب" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "درصد ضایعات" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "اثر در شاخص" })
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: parts.slice(0, 80).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartRows, {
								part: p,
								open: open === p.id,
								onToggle: () => setOpen(open === p.id ? null : p.id),
								trace: open === p.id ? trace : []
							}, p.id)) })]
						})
					}),
					parts.length > 80 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-fg-muted",
						children: "۸۰ ردیف اول این مرتب‌سازی نشان داده شده. جست‌وجو را محدود کنید."
					}) : null
				]
			})
		}),
		openPart ? null : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "علت‌های همین فیلتر",
				subtitle: "جمع ستون مقدار. علت درجه اهمیت ندارد و جدا از درصد ضایعات است.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CauseFamily, { scopeReady: view.causes.slice(0, 8) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
				tone: "warn",
				title: "مصرف مورد انتظار کم",
				children: "اگر تولید × ضریب مصرف کمتر از ۵ باشد، درصد ضایعات ناپایدار است. ستون «تولید × ضریب» را کنار درصد بخوانید."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Note, {
					tone: "info",
					title: "شرح خالی",
					children: [faNum(view.emptyReason), " ردیف در این فیلتر شرح ایراد ندارد و در علت‌ها زیر «بدون شرح ایراد» جمع شده است."]
				})
			})] })]
		})
	] });
}
function CauseFamily({ scopeReady }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: scopeReady.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-t border-border py-2.5 text-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: c.reason
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular",
				children: qtyText(c.qty)
			})]
		})
	}, c.reason)) });
}
function PartRows({ part, open, onToggle, trace }) {
	const unstable = part.e > 0 && part.e < 5 && part.q > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onToggle,
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block",
						children: part.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-fg-subtle",
						children: [
							FAMILY_LABEL[part.family],
							part.unit ? ` · ${part.unit}` : "",
							part.shared ? " · مشترک دو خط" : "",
							part.dups > 1 ? " · ردیف تکراری BOM جمع شد" : "",
							unstable ? " · مصرف مورد انتظار کم" : ""
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: faNum(part.c, 3) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: faNum(part.s, 0) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: qtyText(part.q) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: faNum(part.e, 1) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: rateText(part.rate) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: qtyText(part.load) })
		]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
		className: "border-t border-border bg-bg-subtle",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
			colSpan: 7,
			className: "px-2 py-3 text-xs leading-relaxed text-fg-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"درصد ضایعات = مقدار ÷ (تعداد تولید × ضریب مصرف) × ۱۰۰ = ",
					qtyText(part.q),
					" ÷ ",
					faNum(part.e, 2),
					" × ۱۰۰ =",
					" ",
					rateText(part.rate),
					". درجه اهمیت (",
					importanceLabel(part.s),
					") درصد خود این قطعه را عوض نمی‌کند؛ در شاخص کلان ضرب می‌شود. اثر در شاخص = مقدار × اهمیت = ",
					qtyText(part.load),
					"."
				] }),
				part.shared ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1",
					children: "این نام در هر دو خط لباسشویی ۸ و ۹ آمده و مقدار ضایعات به نسبت ضریب مصرف دو خط تقسیم شده است."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[32rem] text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "text-fg-subtle",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-1 text-right font-medium",
									children: "تاریخ نیاز"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-1 text-right font-medium",
									children: "علت"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-1 text-right font-medium",
									children: "منشأ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-1 text-left font-medium",
									children: "مقدار"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: trace.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5",
									children: row.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5",
									children: row.reason || "بدون شرح"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5",
									children: ORIGIN_LABEL[row.origin] ?? row.origin
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-1.5 text-left tabular",
									children: qtyText(row.qty)
								})
							]
						}, row.id)) })]
					})
				}),
				trace.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2",
					children: "ردیفی از ضایعات به این قطعه وصل نیست."
				}) : null
			]
		})
	}) : null] });
}
function Th({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "pb-2 text-right font-medium",
		children
	});
}
function Td({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: "py-2.5 tabular",
		children
	});
}
//#endregion
export { QualityPage as component };
