

export const CHECKPOINTS = [
  "KWS",
  "TOOLCRAFTS",
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
] as const;

export type CheckpointName = (typeof CHECKPOINTS)[number];


