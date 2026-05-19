export const CHECKPOINTS = [
  "KWS",
  "TOOLCRAFT",
  "AUTO XPRESS",
  "SATAO",
  "OCEAN AGRICULTURE",
  "MANTECH",
  "TIRE WORLD",
  "GRIDLESS",
  "COPY CAT",
  "AQUAMIST",
  "FLOWERWATCH",
  "SOLEX",
  "SLATER & WHITTAKER",
  // "GAUNTLET",
] as const;

export type CheckpointName = (typeof CHECKPOINTS)[number];

export const ADMIN_TABS = [
  { id: "checkpoints", label: "Live Data" },
  { id: "vehicles", label: "Competitor Info" },
  { id: "logs", label: "Results" },
];
