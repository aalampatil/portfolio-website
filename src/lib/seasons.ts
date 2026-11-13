export type Season = "winter" | "spring" | "summer" | "monsoon" | "autumn";
export type SeasonChoice = Season | "auto";

export const SEASONS = [
  { id: "winter", label: "Winter", weather: "Snow", description: "Soft snowfall. A little snow on every button." },
  { id: "spring", label: "Spring", weather: "Bloom", description: "Petals drifting on a gentle spring breeze." },
  { id: "summer", label: "Summer", weather: "Sun", description: "Golden sunshine, soft rays, and floating sunlit dust." },
  { id: "monsoon", label: "Monsoon", weather: "Rain", description: "Wind-swept rain, tiny splashes, and glistening edges." },
  { id: "autumn", label: "Autumn", weather: "Leaves", description: "Amber leaves turning in the autumn air." },
] as const;

// A seasonal calendar for the portfolio's home in northern India.
export function getCurrentSeason(month = new Date().getMonth()): Season {
  if (month === 10 || month === 11 || month <= 1) return "winter";
  if (month === 2) return "spring";
  if (month <= 4) return "summer";
  if (month <= 8) return "monsoon";
  return "autumn";
}

export function isSeasonChoice(value: unknown): value is SeasonChoice {
  return value === "auto" || SEASONS.some(season => season.id === value);
}
