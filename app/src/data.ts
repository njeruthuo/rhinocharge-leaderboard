import { TabOptionList } from "./types";

export const CHECKPOINTS = [
  "KWS",
  "TOOLCRAFT",
  "AUTOXPRESS",
  "SATAO",
  "OCEAN AGRICULTURE",
  "MANTECH",
  "TIRE WORLD",
  "GRIDLESS",
  "COPY CAT",
  "AQUAMIST",
  "FLOWER WATCH",
  "SOLEX",
  "SLATER & WHITTAKER",
  // "GAUNTLET",
] as const;

export type CheckpointName = (typeof CHECKPOINTS)[number];

export const ADMIN_TABS = [
  { id: TabOptionList.LIVEDATA, label: "Live Data" },
  { id: TabOptionList.COMPETITORS, label: "Competitor Info" },
  { id: TabOptionList.RESULTS, label: "Results" },
] as const;
