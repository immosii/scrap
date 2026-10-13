import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Panel, s as Shell } from "./widgets-BAyxnzMj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/method-r-ZefXzq.js
var import_jsx_runtime = require_jsx_runtime();
function MethodPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold",
			children: "روش محاسبه"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-3xl text-sm leading-relaxed text-fg-muted",
			children: "ضریب مصرف و درجه اهمیت از فایل «شدت اهمیت - ضریب مصرف» خوانده می‌شود. تعداد تولید، شمارش سریال فایل تولید است."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "کمی — درصد ضایعات یک قلم",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fraction, {
				top: "تعداد اقلام ضایعات‌شده از یک قلم یکسان",
				bottom: "ضریب مصرف آن قلم × تعداد تولید"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm leading-relaxed text-fg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "نتیجه در نما به‌صورت درصد است؛ یعنی همین نسبت ضربدر ۱۰۰." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "اگر تولید × ضریب مصرف کمتر از ۵ باشد، درصد ناپایدار است و در رتبه بالای نمای مدیریت نمی‌آید." })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "کیفی — شاخص کلان، نرخ واقعی درصد ضایعات",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "درجه اهمیت قطعه"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 space-y-1 text-sm text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "غیر بحرانی = ۱" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "بحرانی = ۲" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "بسیار بحرانی = ۳" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fraction, {
					top: "جمع (شدت اهمیت آن قطعه × تعداد اقلام ضایعات‌شده از همان قلم)",
					bottom: "جمع (ضریب مصرف آن قطعه × شدت اهمیت آن قطعه × تعداد تولید)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm leading-relaxed text-fg-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "جمع روی همه قطعات دارای ضریب در خانواده انتخاب‌شده است. قطعه‌ای که ضایعات ندارد هم در مخرج می‌ماند." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "عدد روی کارت «نرخ واقعی درصد ضایعات» همین نسبت ضربدر ۱۰۰ است." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "اثر یک قطعه در صورت کسر برابر است با مقدار ضایعات × درجه اهمیت. این اثر خودش درصد نیست." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "اگر تعداد تولید خانواده صفر باشد، درصد تعریف نمی‌شود." })
					]
				})
			]
		})]
	})] });
}
function Fraction({ top, bottom }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "my-4 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-xl text-center text-sm leading-relaxed",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-fg px-4 pb-2",
				children: top
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pt-2",
				children: bottom
			})]
		})
	});
}
//#endregion
export { MethodPage as component };
