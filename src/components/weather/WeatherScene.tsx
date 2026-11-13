"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Season } from "@/lib/seasons";
import { startWeatherScene } from "./engine";

export default function WeatherScene({ season, reducedMotion }: { season: Season; reducedMotion: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    return startWeatherScene(canvas.current, season, reducedMotion);
  }, [season, reducedMotion]);

  return createPortal(
    <div className="weather-layer" aria-hidden="true" data-weather-scene={season} data-motion={reducedMotion ? "still" : "animated"}>
      <canvas ref={canvas} className="weather-canvas" />
    </div>,
    document.body,
  );
}
