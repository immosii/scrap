import raw from "./factory.json";
import type { FactoryData } from "./types";

export const factory = raw as FactoryData;

export const modelByCode = new Map(factory.models.map((m) => [m.code, m]));
export const bomById = new Map(factory.bom.map((p) => [p.id, p]));
