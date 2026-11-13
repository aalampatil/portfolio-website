"use client";

import dynamic from "next/dynamic";
import { ChevronDown, CloudRain, Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getCurrentSeason, isSeasonChoice, SEASONS, type Season, type SeasonChoice } from "@/lib/seasons";

const WeatherScene = dynamic(() => import("@/components/weather/WeatherScene"), { ssr: false });
const ICONS = { winter: Snowflake, spring: Flower2, summer: Sun, monsoon: CloudRain, autumn: Leaf };
const STORAGE_KEY = "portfolio-weather-v1";

export function SeasonalWeather() {
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [choice, setChoice] = useState<SeasonChoice>("auto");
  const [automaticSeason, setAutomaticSeason] = useState<Season>("winter");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const optionsButton = useRef<HTMLButtonElement>(null);
  const season = choice === "auto" ? automaticSeason : choice;
  const details = SEASONS.find(item => item.id === season)!;
  const Icon = ICONS[season];

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motion.matches);
    setAutomaticSeason(getCurrentSeason());
    let initialEnabled = !motion.matches;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved && typeof saved.enabled === "boolean") initialEnabled = saved.enabled;
      if (saved && isSeasonChoice(saved.season)) setChoice(saved.season);
    } catch { /* Weather also works without local storage. */ }
    setEnabled(initialEnabled);
    setReady(true);
    const onMotionChange = () => setReducedMotion(motion.matches);
    const updateSeason = () => {
      if (!document.hidden) setAutomaticSeason(getCurrentSeason());
    };
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", updateSeason);
    return () => {
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", updateSeason);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      optionsButton.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function save(nextEnabled: boolean, nextSeason: SeasonChoice) {
    setEnabled(nextEnabled);
    setChoice(nextSeason);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled: nextEnabled, season: nextSeason }));
    } catch { /* Keep the preference for this visit. */ }
  }

  return (
    <>
      <div className="weather-control" ref={root} data-season={season} onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
        <div className="weather-buttons">
          <button type="button" className="weather-toggle" role="switch" aria-checked={enabled}
            disabled={!ready}
            aria-label="Season effects" title={`${details.label}: ${enabled ? "turn effects off" : "turn effects on"}`}
            onClick={() => save(!enabled, choice)}>
            <Icon size={15} aria-hidden="true" />
            <span>{details.weather}</span>
            <span className="weather-toggle-state">{enabled ? "On" : "Off"}</span>
          </button>
          <button ref={optionsButton} type="button" className="weather-options" aria-label="Choose season"
            disabled={!ready}
            aria-expanded={open} aria-controls="season-options" onClick={() => setOpen(value => !value)}>
            <ChevronDown size={13} aria-hidden="true" />
          </button>
        </div>
        {open && (
          <div className="weather-popover" id="season-options">
            <p className="weather-eyebrow">A change in the air</p>
            <fieldset>
              <legend>Choose your season</legend>
              <label className="weather-season-option">
                <input type="radio" name="season" value="auto" checked={choice === "auto"} onChange={() => save(enabled, "auto")} />
                <span>Follow the season<small>Auto · northern India</small></span>
                <span className="weather-auto-dot" aria-hidden="true" />
              </label>
              <div className="weather-season-grid">
                {SEASONS.map(item => {
                  const SeasonIcon = ICONS[item.id];
                  return (
                    <label className="weather-season-option" key={item.id}>
                      <input type="radio" name="season" value={item.id} checked={choice === item.id}
                        onChange={() => save(enabled, item.id)} />
                      <SeasonIcon size={16} aria-hidden="true" /><span>{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <p className="weather-description" aria-live="polite">{details.description}</p>
            <div className="weather-footnote"><span className={enabled ? "weather-live-dot is-on" : "weather-live-dot"} />
              {enabled ? reducedMotion ? "Still weather · reduced motion" : "A little atmosphere, just for you" : "Effects off · switch on to enjoy"}
            </div>
          </div>
        )}
      </div>
      {enabled && <WeatherScene key={season} season={season} reducedMotion={reducedMotion} />}
    </>
  );
}
