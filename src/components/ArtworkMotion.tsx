"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { Pause, Play } from "lucide-react";

export function ArtworkMotion({ children }: { children: ReactNode }) {
  const artwork = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const motionOff = paused || reducedMotion;

  useEffect(() => {
    document.documentElement.dataset.motion = motionOff ? "paused" : "active";
    return () => { delete document.documentElement.dataset.motion; };
  }, [motionOff]);

  function resetTilt() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    artwork.current?.style.setProperty("--art-x", "0");
    artwork.current?.style.setProperty("--art-y", "0");
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) resetTilt();
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => {
      preference.removeEventListener("change", updatePreference);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (motionOff || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      artwork.current?.style.setProperty("--art-x", x.toFixed(3));
      artwork.current?.style.setProperty("--art-y", y.toFixed(3));
    });
  }

  return (
    <div ref={artwork} className="hero-art artwork-motion" data-motion={motionOff ? "paused" : "active"} onPointerMove={tilt} onPointerLeave={resetTilt}>
      {children}
      <div className="code-object" aria-hidden="true"><div className="code-cube">
        <span className="cube-front">TS</span><span className="cube-back">{'{ }'}</span>
        <span className="cube-right">{'</>'}</span><span className="cube-left">{'<>'}</span>
        <span className="cube-top">01</span><span className="cube-bottom">{'//'}</span>
      </div></div>
      {!reducedMotion && <button type="button" className="motion-toggle" onClick={() => { resetTilt(); setPaused(value => !value); }} aria-label={paused ? "Resume animation" : "Pause animation"} title={paused ? "Resume animation" : "Pause animation"}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>}
    </div>
  );
}
