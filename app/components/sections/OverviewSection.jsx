import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export function OverviewSection({ theme }) {
  const isSamurai = theme === "samurai";
  return (
    <section id="overview" className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span /> DEVELOPER · HARYANA, INDIA</p>
        <h1>Aalam Patil.<br /><em>Backend</em><br />developer.</h1>
        <p className="hero-description">I build web applications and explore the systems behind them, with a focus on APIs, authentication, and Node.js.</p>
        <div className="hero-actions"><a href="#projects" className="neo-button">View selected work <ArrowUpRight size={18} /></a><a href="#blogs" className="text-link">Read my notes <ArrowDown size={16} /></a></div>
        <div className="hero-footnote"><span>BUILDING · LEARNING · SHARING</span><span>精進 — ALWAYS REFINING</span></div>
      </div>
      <div className="hero-art">
        <Image src={isSamurai ? "/images/samurai-hero.png" : "/images/sakura-hero.png"} alt={isSamurai ? "Ink illustration of a samurai in black armor before a vermilion sun on beige paper" : "Cherry blossoms arch over a pink sun, misty Mount Fuji, and a Japanese pagoda on ivory paper"} fill priority sizes="(max-width: 760px) 100vw, 50vw" className="samurai-image" />
        {!isSamurai && <div className="petals" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span key={i} style={{ "--i": i }} />)}</div>}
        <span className="art-vertical" aria-hidden="true">{isSamurai ? "武士の道" : "桜の季節"}</span><span className="art-caption">{isSamurai ? "THE WAY IS IN THE WORK." : "GOOD THINGS GROW WITH CARE."}</span><span className="art-stamp" aria-hidden="true">{isSamurai ? <>日々<br />精進</> : <>春風<br />桜花</>}</span>
      </div>
    </section>
  );
}
