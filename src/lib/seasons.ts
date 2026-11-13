export type Season = "winter" | "spring";

export const SEASONS = [
  {
    id: "winter",
    label: "Snow",
    description: "Soft snowfall. A little snow on every button.",
  },
  {
    id: "spring",
    label: "Cherry",
    description: "Sakura petals, turning gently in the breeze.",
  },
] as const;

export function isSeason(value: unknown): value is Season {
  return SEASONS.some((season) => season.id === value);
}
