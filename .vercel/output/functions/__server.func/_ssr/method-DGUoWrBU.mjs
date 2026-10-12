import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Shell, s as Panel } from "./widgets-DxwXF1wO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/method-DGUoWrBU.js
var import_jsx_runtime = require_jsx_runtime();
function MethodPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold",
			children: "روش محاسبه"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted",
			children: "ضریب‌ها همان ستون‌های فایل «شدت اهمیت - ضریب مصرف» هستند و در برنامه تغییر داده نشده‌اند. تعداد یعنی ضریب مصرف هر دستگاه، درجه اهمیت همان وزن ۱ تا ۳ است."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "نرخ واقعی کل BOM — شاخص اصلی",
				subtitle: "واحد: درصد. مبنای درصدگیری: مصرف مورد انتظار وزنی، نه تعداد تولید و نه تعداد ضایعات.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, {
					name: "R",
					body: "Σ (Q × S)  ÷  Σ (N × C × S)  ×  ۱۰۰",
					lines: [
						"Q مقدار ضایعات تطبیق‌شده همان قطعه است.",
						"S درجه اهمیت همان قطعه در فایل ضریب است.",
						"C ضریب مصرف، ستون تعداد، به ازای هر دستگاه است.",
						"N تعداد دستگاه تولیدشده همان خانواده در بازه فیلتر است.",
						"قطعه‌ای که ضایعات ندارد هم در مخرج می‌ماند تا شاخص، کل مصرف را ببیند.",
						"قطعه بدون تطبیق نه در صورت می‌آید نه در مخرج. مقدارش در پوشش و جدول مغایرت است.",
						"خانواده بدون تولید، مثل C70، نرخ ندارد و از شاخص کل خارج است."
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "نرخ واقعی خود قطعه",
				subtitle: "واحد: درصد از مصرف مورد انتظار همان قطعه. اهمیت در این نرخ ضرب نمی‌شود.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, {
					name: "r",
					body: "Q  ÷  (N × C)  ×  ۱۰۰",
					lines: ["اگر N × C کمتر از ۵ باشد نرخ ناپایدار است و در نمای مدیریت از رتبه اصلی کنار می‌رود.", "رتبه‌بندی پیش‌فرض قطعات با همین نرخ است، نه با Q."]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "بار وزنی",
				subtitle: "واحد: امتیاز. تعداد خام ضربدر اهمیت. هنوز نرخ نیست.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, {
					name: "L",
					body: "Q × S",
					lines: ["برای اینکه قطعه کم‌اهمیتِ پرتعداد، جای قطعه مهم را در اولویت دوم نگیرد."]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "نرخ قطعات ضایعات‌دار",
				subtitle: "واحد: درصد. همان R، ولی جمع مخرج فقط روی قطعات با Q بزرگ‌تر از صفر.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, {
					name: "R+",
					body: "Σ (Q × S)  ÷  Σ (N × C × S)   فقط برای Q > 0",
					lines: ["این عدد بزرگ‌تر از R است چون قطعات سالم مخرج را رقیق نمی‌کنند. شاخص رسمی مدیریت همان R است."]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "نرخ خام",
				subtitle: "واحد: عدد ضایعات به ازای هر دستگاه. درصد نیست.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, {
					name: "خام",
					body: "جمع مقدار ضایعات  ÷  تعداد دستگاه خانواده",
					lines: ["C و S در آن نیست.", "با فیلتر مدل، این نرخ هنوز بر تولید خانواده تقسیم می‌شود نه بر یک مدل."]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "نرخ رنگ",
				subtitle: "فقط در جدول قطعات هم‌رنگ. داخل R جایگزین نشده.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formula, {
					name: "رنگ",
					body: "Q رنگ  ÷  (تولید همان رنگ × C)  ×  ۱۰۰",
					lines: ["اگر نام ضایعات رنگ نداشته باشد در این جدول نمی‌آید و بین مدل‌ها شکسته نمی‌شود."]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "تطبیق نام",
				subtitle: "فقط همین قاعده‌ها وصل می‌کنند. حدس معناییِ لاینر به کابین انجام نشده.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm leading-relaxed text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "برابری نام پس از یکسان‌سازی حروف و فاصله." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "یا برابری بعد از حذف واژه‌های رنگ، وضعیت ساخت و پیشوند خانواده. ابعاد عددی اگر فرق کنند رد می‌شوند." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "کدهای شیت ۸T3 استفاده نشده چون با نام قطعه جابه‌جا ثبت شده‌اند." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "اگر یک نام در مینی و C70 هر دو باشد و پیشوند تعیین‌کننده نباشد، مبهم می‌ماند و در شاخص نمی‌آید." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "نام مشترک ۸T2 و ۸T3 یک قطعه است و مقدارش به نسبت N×C دو خط تقسیم می‌شود." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "ردیف‌های هم‌نام داخل یک شیت: ضریب‌ها جمع و اهمیت، بیشینه شده است." })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "فیلتر منشأ و تاریخ",
				subtitle: "",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm leading-relaxed text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "منشأ فقط صورت کسر را محدود می‌کند. مخرج همچنان مصرف مورد انتظار کل تولید است." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "ردیفی که هم تولید و هم پیمانکار خورده، در سبد «مشترک» است و دوبار شمرده نمی‌شود." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "محور زمان ضایعات، تاریخ نیاز است. محور تولید، تاریخ جمع‌آوری است." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "درجه B از تولید کم نشده است." })
					]
				})
			})
		]
	})] });
}
function Formula({ name, body, lines }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "rounded-md bg-bg-subtle px-3 py-3 text-sm leading-relaxed",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-medium text-fg",
			children: [name, " = "]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular",
			children: body
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 space-y-1.5 text-sm leading-relaxed text-fg-muted",
		children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
	})] });
}
//#endregion
export { MethodPage as component };
