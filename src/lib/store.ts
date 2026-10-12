import { create } from "zustand";
import { factory } from "@/data/load";
import { familyGroup } from "@/lib/format";

export type GroupId = "all" | "fridge" | "wm" | "dw";
export type OriginFilter = "all" | "prod" | "contractor" | "both" | "unknown";

type Filters = {
  months: string[];
  group: GroupId;
  family: string;
  model: string;
  origin: OriginFilter;
  toggleMonth: (month: string) => void;
  setAllMonths: () => void;
  setGroup: (group: GroupId) => void;
  setFamily: (family: string) => void;
  setModel: (model: string) => void;
  setOrigin: (origin: OriginFilter) => void;
  reset: () => void;
};

export const useFilters = create<Filters>((set, get) => ({
  months: [],
  group: "all",
  family: "all",
  model: "all",
  origin: "all",
  toggleMonth: (month) => {
    const cur = get().months;
    set({
      months: cur.includes(month) ? cur.filter((m) => m !== month) : [...cur, month],
    });
  },
  setAllMonths: () => set({ months: [] }),
  setGroup: (group) => set({ group, family: "all", model: "all" }),
  setFamily: (family) => {
    const group = family === "all" ? get().group : (familyGroup(family) as GroupId);
    set({ family, group: family === "all" ? get().group : group, model: "all" });
  },
  setModel: (model) => {
    if (model === "all") {
      set({ model });
      return;
    }
    const row = factory.models.find((m) => m.code === model);
    if (!row) return;
    set({
      model,
      family: row.family,
      group: familyGroup(row.family) as GroupId,
    });
  },
  setOrigin: (origin) => set({ origin }),
  reset: () => set({ months: [], group: "all", family: "all", model: "all", origin: "all" }),
}));
