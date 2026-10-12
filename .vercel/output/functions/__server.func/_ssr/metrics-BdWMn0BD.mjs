import { f as factory, h as monthLabel, l as bomById, m as modelByCode, o as ORIGIN_LABEL, p as familyGroup, r as FAMILY_LABEL } from "./widgets-DxwXF1wO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metrics-BdWMn0BD.js
function monthOk(month, months) {
	return months.length === 0 || months.includes(month);
}
function familyAllowed(family, scope) {
	if (scope.family !== "all" && family !== scope.family) return false;
	if (scope.group !== "all" && familyGroup(family) !== scope.group) return false;
	return true;
}
function guessFamily(row) {
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
function scrapVisible(row, scope, honorFamily) {
	if (!monthOk(row.month, scope.months)) return false;
	if (scope.origin !== "all" && row.origin !== scope.origin) return false;
	if (!honorFamily) return true;
	if (row.bomIds.length) return row.bomIds.some((id) => {
		const part = bomById.get(id);
		return part ? familyAllowed(part.family, scope) : false;
	});
	const guess = guessFamily(row);
	if (guess === "other") return scope.group === "all" && scope.family === "all";
	return familyAllowed(guess, scope);
}
function productionOf(scope, honorModel) {
	const byFamily = /* @__PURE__ */ new Map();
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
function rateBlock(scope, nByFamily) {
	const partQ = /* @__PURE__ */ new Map();
	const shared = /* @__PURE__ */ new Set();
	for (const row of factory.scrap) {
		if (!scrapVisible(row, scope, true)) continue;
		if (row.match !== "exact" && row.match !== "canon") continue;
		const parts = row.bomIds.map((id) => bomById.get(id)).filter((p) => !!p && familyAllowed(p.family, scope) && (nByFamily.get(p.family) ?? 0) > 0);
		if (!parts.length) continue;
		if (parts.length > 1) parts.forEach((p) => shared.add(p.id));
		const weights = parts.map((p) => (nByFamily.get(p.family) ?? 0) * p.c);
		const sum = weights.reduce((a, b) => a + b, 0);
		parts.forEach((p, i) => {
			const share = sum > 0 ? weights[i] / sum : 1 / parts.length;
			partQ.set(p.id, (partQ.get(p.id) ?? 0) + row.qty * share);
		});
	}
	let num = 0;
	let den = 0;
	let numOcc = 0;
	let denOcc = 0;
	const parts = [];
	for (const part of factory.bom) {
		if (!familyAllowed(part.family, scope)) continue;
		const n = nByFamily.get(part.family) ?? 0;
		if (n <= 0) continue;
		const e = n * part.c;
		const q = partQ.get(part.id) ?? 0;
		const load = q * part.s;
		den += e * part.s;
		num += load;
		if (q > 0) {
			denOcc += e * part.s;
			numOcc += load;
		}
		parts.push({
			id: part.id,
			title: part.title,
			family: part.family,
			unit: part.unit,
			c: part.c,
			s: part.s,
			q,
			e,
			rate: e > 0 ? q / e * 100 : null,
			load,
			dups: part.dups,
			shared: shared.has(part.id)
		});
	}
	return {
		parts,
		rBom: den > 0 ? num / den * 100 : null,
		rOcc: denOcc > 0 ? numOcc / denOcc * 100 : null,
		num
	};
}
function buildView(scope) {
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
	const rated = rateBlock(scope, nFamily);
	let qRaw = 0;
	let qMatched = 0;
	let qAmbiguous = 0;
	let emptyReason = 0;
	const originQty = /* @__PURE__ */ new Map();
	const causeMap = /* @__PURE__ */ new Map();
	const unmatchedMap = /* @__PURE__ */ new Map();
	const originMonth = /* @__PURE__ */ new Map();
	for (const row of factory.scrap) {
		if (!scrapVisible(row, scope, true)) continue;
		qRaw += row.qty;
		if (!row.reason) emptyReason += 1;
		if (row.match === "exact" || row.match === "canon") qMatched += row.qty;
		if (row.match === "ambiguous") qAmbiguous += row.qty;
		const bucket = originQty.get(row.origin) ?? {
			qty: 0,
			rows: 0
		};
		bucket.qty += row.qty;
		bucket.rows += 1;
		originQty.set(row.origin, bucket);
		const om = originMonth.get(row.month) ?? {
			prod: 0,
			contractor: 0,
			both: 0,
			unknown: 0
		};
		om[row.origin] += row.qty;
		originMonth.set(row.month, om);
		const reason = row.reason || "بدون شرح ایراد";
		const cause = causeMap.get(reason) ?? {
			reason,
			qty: 0,
			rows: 0
		};
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
				guess: FAMILY_LABEL[guessFamily(row)] ?? "نامشخص"
			};
			item.qty += row.qty;
			item.rows += 1;
			unmatchedMap.set(key, item);
		}
	}
	const months = factory.months.map((key) => {
		const sub = {
			...scope,
			months: [key]
		};
		const nMap = productionOf(sub, false);
		let nn = 0;
		for (const v of nMap.values()) nn += v;
		const block = rateBlock(sub, nMap);
		let q = 0;
		let qm = 0;
		for (const row of factory.scrap) {
			if (!scrapVisible(row, sub, true)) continue;
			q += row.qty;
			if (row.match === "exact" || row.match === "canon") qm += row.qty;
		}
		return {
			key,
			label: monthLabel(key),
			n: nn,
			q,
			qMatched: qm,
			rBom: block.rBom,
			rawPerUnit: nn > 0 ? q / nn : null
		};
	});
	const families = [
		"mini",
		"rm5",
		"c70",
		"wm10",
		"wm8a",
		"wm8b",
		"dw"
	].filter((id) => scope.group === "all" || familyGroup(id) === scope.group).filter((id) => scope.family === "all" || scope.family === id).map((id) => {
		const sub = {
			...scope,
			family: id,
			group: "all",
			model: "all"
		};
		const nMap = productionOf(sub, false);
		const nn = nMap.get(id) ?? 0;
		const block = rateBlock(sub, nMap);
		let q = 0;
		let qm = 0;
		for (const row of factory.scrap) {
			if (!scrapVisible(row, sub, true)) continue;
			q += row.qty;
			if (row.match === "exact" || row.match === "canon") qm += row.qty;
		}
		return {
			id,
			label: FAMILY_LABEL[id] ?? id,
			n: nn,
			qRaw: q,
			qMatched: qm,
			rBom: block.rBom,
			rOcc: block.rOcc,
			cover: q > 0 ? qm / q * 100 : null
		};
	});
	const nByModel = /* @__PURE__ */ new Map();
	for (const cell of factory.prod) {
		if (!monthOk(cell.month, scope.months)) continue;
		const model = modelByCode.get(cell.code);
		if (!model || !familyAllowed(model.family, scope)) continue;
		const cur = nByModel.get(cell.code) ?? {
			n: 0,
			nB: 0
		};
		cur.n += cell.qty;
		if (cell.grade === "B") cur.nB += cell.qty;
		nByModel.set(cell.code, cur);
	}
	const models = factory.models.filter((m) => familyAllowed(m.family, {
		...scope,
		model: "all"
	})).map((m) => {
		const stat = nByModel.get(m.code) ?? {
			n: 0,
			nB: 0
		};
		const famN = nFamily.get(m.family) ?? 0;
		return {
			code: m.code,
			name: m.name,
			family: m.family,
			color: m.color,
			pattern: m.pattern,
			n: stat.n,
			nB: stat.nB,
			share: famN > 0 ? stat.n / famN * 100 : null
		};
	}).filter((m) => m.n > 0).sort((a, b) => b.n - a.n);
	const colorN = /* @__PURE__ */ new Map();
	for (const cell of factory.prod) {
		if (!monthOk(cell.month, scope.months)) continue;
		const model = modelByCode.get(cell.code);
		if (!model?.color) continue;
		if (scope.group !== "all" && familyGroup(model.family) !== scope.group) continue;
		if (scope.family !== "all" && model.family !== scope.family) continue;
		const key = `${model.family}|${model.color}`;
		colorN.set(key, (colorN.get(key) ?? 0) + cell.qty);
	}
	const colorQ = /* @__PURE__ */ new Map();
	for (const row of factory.scrap) {
		if (!row.color || row.match !== "exact" && row.match !== "canon") continue;
		if (!monthOk(row.month, scope.months)) continue;
		if (scope.origin !== "all" && row.origin !== scope.origin) continue;
		for (const id of row.bomIds) {
			const part = bomById.get(id);
			if (!part || !familyAllowed(part.family, {
				...scope,
				model: "all"
			})) continue;
			const key = `${id}|${row.color}`;
			colorQ.set(key, (colorQ.get(key) ?? 0) + row.qty);
		}
	}
	const colorParts = [];
	for (const [key, q] of colorQ) {
		const [id, color] = key.split("|");
		const part = bomById.get(id);
		if (!part) continue;
		if (scope.model !== "all") {
			const selected = modelByCode.get(scope.model);
			if (!selected || selected.color !== color || selected.family !== part.family) continue;
		}
		const nColor = colorN.get(`${part.family}|${color}`) ?? 0;
		const e = nColor * part.c;
		colorParts.push({
			id: part.id,
			title: part.title,
			family: part.family,
			color,
			c: part.c,
			s: part.s,
			q,
			nColor,
			e,
			rate: e > 0 ? q / e * 100 : null
		});
	}
	colorParts.sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1));
	const selected = scope.model === "all" ? null : models.find((m) => m.code === scope.model) ?? null;
	return {
		n,
		nAllFamily,
		nB,
		qRaw,
		qMatched,
		qAmbiguous,
		cover: qRaw > 0 ? qMatched / qRaw * 100 : null,
		rawPerUnit: nAllFamily > 0 ? qRaw / nAllFamily : null,
		rBom: rated.rBom,
		rOcc: rated.rOcc,
		emptyReason,
		months,
		families,
		origins: [
			"prod",
			"contractor",
			"both",
			"unknown"
		].map((id) => ({
			id,
			label: ORIGIN_LABEL[id] ?? id,
			qty: originQty.get(id)?.qty ?? 0,
			rows: originQty.get(id)?.rows ?? 0
		})),
		originMonth: factory.months.map((key) => ({
			key,
			label: monthLabel(key),
			...originMonth.get(key) ?? {
				prod: 0,
				contractor: 0,
				both: 0,
				unknown: 0
			}
		})),
		parts: rated.parts.sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1) || b.load - a.load),
		causes: [...causeMap.values()].sort((a, b) => b.qty - a.qty),
		unmatched: [...unmatchedMap.values()].sort((a, b) => b.qty - a.qty),
		models,
		colorParts,
		selected
	};
}
function scrapRowsForPart(partId, scope) {
	return factory.scrap.filter((row) => row.bomIds.includes(partId) && scrapVisible(row, scope, true) && (row.match === "exact" || row.match === "canon"));
}
//#endregion
export { scrapRowsForPart as n, buildView as t };
