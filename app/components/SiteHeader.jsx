import { ArrowUpRight } from "lucide-react";

export function SiteHeader({ theme, onThemeChange }) {
  return (
    <header className="site-header">
      <a href="#overview" className="brand" aria-label="Aalam Patil home">
        <span className="seal" aria-hidden="true">{theme === "samurai" ? "侍" : "桜"}</span>
        <span>AALAM PATIL<span className="brand-caption">DEVELOPER · THE WAY OF THE CRAFT</span></span>
      </a>
      <nav className="header-nav" aria-label="Main navigation"><a href="#projects">Work</a><a href="#blogs">Writing</a><a href="#contact">Connect</a></nav>
      <div className="header-actions">
        <label className="theme-picker">
          <span className={`theme-swatch theme-swatch-${theme}`} aria-hidden="true" />
          <span className="sr-only">Color theme</span>
          <select value={theme} onChange={event => onThemeChange(event.target.value)} aria-label="Color theme">
            <option value="sakura">Sakura</option>
            <option value="samurai">Samurai</option>
            <option value="moonlight">Moonlight</option>
          </select>
        </label>
        <a href="https://github.com/aalampatil" target="_blank" rel="noreferrer" className="header-link">GitHub <ArrowUpRight size={16} /></a>
      </div>
    </header>
  );
}
