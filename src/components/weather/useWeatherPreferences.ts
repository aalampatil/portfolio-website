"use client";

import { useEffect, useState } from "react";
import { isSeason, type Season } from "@/lib/seasons";

type WeatherPreferences = Record<Season, boolean>;

const STORAGE_KEY = "portfolio-weather-v2";
const LEGACY_STORAGE_KEY = "portfolio-weather-v1";
const DEFAULT_PREFERENCES: WeatherPreferences = { winter: false, spring: false };

function readPreferences(): WeatherPreferences {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && typeof saved.winter === "boolean" && typeof saved.spring === "boolean") {
      return { winter: saved.winter, spring: saved.spring };
    }
    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) ?? "null");
    if (legacy && typeof legacy.enabled === "boolean") {
      const season = isSeason(legacy.season) ? legacy.season : "winter";
      return { ...DEFAULT_PREFERENCES, [season]: legacy.enabled };
    }
  } catch { /* Keep the usual theme when storage is unavailable or invalid. */ }
  return DEFAULT_PREFERENCES;
}

/** Weather preferences stay independent of the portfolio's light/dark theme. */
export function useWeatherPreferences() {
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motion.matches);
    setPreferences(readPreferences());
    setReady(true);
    const onMotionChange = () => setReducedMotion(motion.matches);
    motion.addEventListener("change", onMotionChange);
    return () => motion.removeEventListener("change", onMotionChange);
  }, []);

  function toggle(season: Season) {
    const next = { ...preferences, [season]: !preferences[season] };
    setPreferences(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch { /* Keep the preference for this visit. */ }
  }

  return { ready, preferences, reducedMotion, toggle };
}
