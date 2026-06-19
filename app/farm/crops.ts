/**
 * The Farm cabinet's seed catalogue — a faithful mirror of the real game's
 * `data/crops.toml`. Every `seedCost`, `growSeconds`, `sellValue`, archetype
 * and unlock gate is the actual ssh-idlefarmer balance, so the self-playing
 * terminal and the field-guide almanac both show real numbers.
 *
 * Profit-per-second rises with grow time: patience pays.
 */

export type CropArchetype = "fast" | "slow" | "risky";

export type Unlock =
  | { kind: "start" }
  | { kind: "earnings"; value: number }
  | { kind: "prestige"; value: number }
  | { kind: "zone"; zone: string };

export interface Crop {
  id: string;
  name: string;
  archetype: CropArchetype;
  /** Coins to plant one seed (real game value). */
  seedCost: number;
  /** Real in-game grow time, in seconds. */
  growSeconds: number;
  /** Coins paid for a successful harvest (real game value). */
  sellValue: number;
  /** Risky crops: percent chance the harvest fails and only salvages. */
  failChancePct?: number;
  unlock: Unlock;
  /** A single accent colour used as a small identity cue on the almanac card. */
  accent: string;
  /** One-line field-guide note. */
  blurb: string;
}

export const crops: Crop[] = [
  {
    id: "turnip",
    name: "Turnip",
    archetype: "fast",
    seedCost: 5,
    growSeconds: 60,
    sellValue: 9,
    unlock: { kind: "start" },
    accent: "#c9b27a",
    blurb: "The humble sixty-second turnip. Where every farm begins.",
  },
  {
    id: "carrot",
    name: "Carrot",
    archetype: "fast",
    seedCost: 14,
    growSeconds: 240,
    sellValue: 32,
    unlock: { kind: "start" },
    accent: "#e8843a",
    blurb: "Four quiet minutes underground for a tidy little return.",
  },
  {
    id: "glimmercorn",
    name: "Glimmercorn",
    archetype: "risky",
    seedCost: 40,
    growSeconds: 900,
    sellValue: 150,
    failChancePct: 25,
    unlock: { kind: "earnings", value: 500 },
    accent: "#f4c531",
    blurb: "Kernels catch the light like coins — when the cobs don't shatter.",
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    archetype: "slow",
    seedCost: 80,
    growSeconds: 3600,
    sellValue: 440,
    unlock: { kind: "start" },
    accent: "#e8893a",
    blurb: "An hour in the patch swells it fat and orange. No surprises, just heft.",
  },
  {
    id: "starfruit",
    name: "Starfruit",
    archetype: "slow",
    seedCost: 600,
    growSeconds: 28800,
    sellValue: 4800,
    unlock: { kind: "earnings", value: 2000 },
    accent: "#ffd23f",
    blurb: "Eight patient hours. Cuts into five perfect points and sells like one.",
  },
  {
    id: "moonberry",
    name: "Moonberry",
    archetype: "risky",
    seedCost: 350,
    growSeconds: 7200,
    sellValue: 1300,
    failChancePct: 30,
    unlock: { kind: "prestige", value: 1 },
    accent: "#7c83ff",
    blurb: "Risky to grow, but a full moon pays fifteen percent more for every berry.",
  },
  {
    id: "emberwheat",
    name: "Emberwheat",
    archetype: "fast",
    seedCost: 120,
    growSeconds: 600,
    sellValue: 190,
    unlock: { kind: "prestige", value: 1 },
    accent: "#d8a23a",
    blurb: "Ten minutes to a field of warm gold. The reborn farmer's bread and butter.",
  },
  {
    id: "frostplum",
    name: "Frostplum",
    archetype: "slow",
    seedCost: 900,
    growSeconds: 14400,
    sellValue: 2700,
    unlock: { kind: "prestige", value: 2 },
    accent: "#93b8e6",
    blurb: "Four hours of cold sets the fruit and the price. Best left overnight.",
  },
  {
    id: "thunderpod",
    name: "Thunderpod",
    archetype: "risky",
    seedCost: 200,
    growSeconds: 1800,
    sellValue: 520,
    failChancePct: 28,
    unlock: { kind: "prestige", value: 2 },
    accent: "#c2e24a",
    blurb: "Half an hour of crackle. A quarter split open, the rest pay handsomely.",
  },
  {
    id: "sunroot",
    name: "Sunroot",
    archetype: "fast",
    seedCost: 400,
    growSeconds: 1200,
    sellValue: 560,
    unlock: { kind: "prestige", value: 3 },
    accent: "#f0a52e",
    blurb: "Twenty minutes of stored sunlight. Fast money for a seasoned farm.",
  },
  {
    id: "voidlotus",
    name: "Voidlotus",
    archetype: "slow",
    seedCost: 2000,
    growSeconds: 43200,
    sellValue: 14000,
    unlock: { kind: "prestige", value: 3 },
    accent: "#b06cff",
    blurb: "Twelve hours to bloom once at midnight. The patient farmer's crown jewel.",
  },
  {
    id: "dewmelon",
    name: "Dewmelon",
    archetype: "slow",
    seedCost: 1200,
    growSeconds: 43200,
    sellValue: 10000,
    unlock: { kind: "zone", zone: "greenhouse" },
    accent: "#6fd6c0",
    blurb: "A glasshouse giant. Plant it before bed; wake to ten thousand coins.",
  },
];

export function cropById(id: string): Crop {
  const crop = crops.find((c) => c.id === id);
  if (!crop) throw new Error(`Unknown crop: ${id}`);
  return crop;
}

/** Human grow-time label, e.g. 60 → "1 min", 28800 → "8 hr". */
export function growLabel(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  if (seconds < 3600) return `${seconds / 60} min`;
  return `${seconds / 3600} hr`;
}

/** Short unlock-gate label for the almanac. */
export function unlockLabel(unlock: Unlock): string {
  switch (unlock.kind) {
    case "start":
      return "Starter";
    case "earnings":
      return `Earn ${unlock.value.toLocaleString()}`;
    case "prestige":
      return `Rebirth ×${unlock.value}`;
    case "zone":
      return "Greenhouse";
  }
}

/** Rotating headlines for the Daily Furrow ticker — the real game's [[headline]] set. */
export const dailyFurrow = [
  "LOCAL FARMER REPORTS UNUSUALLY LARGE TURNIP",
  "WEATHER: MILD WITH A CHANCE OF MOONBERRIES",
  "MARKET DAY DECLARED — SEED PRICES TUMBLE",
  "BUYERS FLOCK TO REGION AS BUMPER DEMAND HITS",
  "WARM FRONT SWEEPS VALLEY — CROPS RACE TO RIPEN",
  "PARCEL DELIVERY UP ACROSS THE COUNTY",
  "FULL MOON TONIGHT — LUNAR CROPS SHINE BRIGHTER",
  "CROW SPOTTED NEAR FENCE LINE, FARMERS UNFAZED",
];
