import { ArrowUpRight, Sun, Moon } from "lucide-react";
import { JapaneseText } from "@/components/JapaneseText";
import { VisitorCount } from "@/components/VisitorCount";
import { SeasonalWeather } from "@/components/SeasonalWeather";
import type { InkMode } from "@/types/portfolio";

export function SiteHeader({ mode, onModeChange }: { mode: InkMode; onModeChange: () => void }) {
  return (
    <header className="site-header">
      <a href="#overview" className="brand" aria-label="Aalam Patil home">
        <JapaneseText className="seal" text="作" />
        <span>AALAM PATIL<span className="brand-caption">SOFTWARE DEVELOPER / INDIA</span></span>
      </a>
      <nav className="header-nav" aria-label="Main navigation"><a href="#projects">Work</a><a href="#blogs">Writing</a><a href="#contact">Connect</a></nav>
      <div className="header-actions">
        <VisitorCount />
        <SeasonalWeather />
        <button type="button" className="mode-toggle" role="switch" aria-checked={mode === "dark"} aria-label="Dark mode" onClick={onModeChange}>
          {mode === "dark" ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}<span>Ink / {mode === "dark" ? "Dark" : "Light"}</span>
        </button>
        <a href="https://github.com/aalampatil" target="_blank" rel="noreferrer" className="header-link">GitHub <ArrowUpRight size={16} /></a>
      </div>
    </header>
  );
}
