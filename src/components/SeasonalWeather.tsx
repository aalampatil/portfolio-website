"use client";

import dynamic from "next/dynamic";
import { Flower2, Snowflake } from "lucide-react";
import { SEASONS } from "@/lib/seasons";
import { useWeatherPreferences } from "@/components/weather/useWeatherPreferences";

const WeatherScene = dynamic(() => import("@/components/weather/WeatherScene"), { ssr: false });
const ICONS = { winter: Snowflake, spring: Flower2 };

export function SeasonalWeather() {
  const { ready, preferences, reducedMotion, toggle } = useWeatherPreferences();

  return (
    <>
      <div className="weather-controls" role="group" aria-label="Weather effects">
        {SEASONS.map(({ id, label, description }) => {
          const Icon = ICONS[id];
          const enabled = preferences[id];
          return (
            <button key={id} type="button" className="weather-toggle" data-season={id}
              role="switch" aria-checked={enabled} aria-label={`${label} effect`} disabled={!ready}
              title={`${description} ${enabled ? "Turn off" : "Turn on"}.${reducedMotion ? " Still scene with reduced motion." : ""}`}
              onClick={() => toggle(id)}>
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
              <span className="weather-toggle-state">{enabled ? "On" : "Off"}</span>
            </button>
          );
        })}
      </div>
      {SEASONS.map(({ id }) => preferences[id] && (
        <WeatherScene key={id} season={id} reducedMotion={reducedMotion} />
      ))}
    </>
  );
}
