import { ArrowDown, ArrowUpRight } from "lucide-react";
import { JapaneseText } from "../JapaneseText";
import { ArtworkMotion } from "../ArtworkMotion";
import { InkLandscape } from "../InkLandscape";

export function OverviewSection() {
  return (
    <section id="overview" className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span /> AALAM PATIL / SOFTWARE DEVELOPER</p>
        <h1>I turn ideas<br />into working<br /><em>software.</em></h1>
        <p className="hero-description">I build web apps, explore new tools, and turn what I learn into useful projects. My work spans interfaces, APIs, authentication, and the systems that bring them together.</p>
        <div className="hero-actions"><a href="#projects" className="neo-button">View selected work <ArrowUpRight size={18} /></a><a href="#blogs" className="text-link">Read my notes <ArrowDown size={16} /></a></div>
        <div className="hero-footnote"><span>BASED IN HARYANA, INDIA</span><span>BUILD / LEARN / REPEAT</span></div>
      </div>
      <ArtworkMotion>
        <InkLandscape />
        <div className="art-lettering"><JapaneseText text="日々精進" /><span aria-hidden="true">MAKE<br />EVERY<br />DETAIL<br />COUNT.</span></div>
        <JapaneseText className="art-vertical" text="創造と探求" />
        <span className="art-caption"><JapaneseText text="小さな一歩" /> / ONE STEP AT A TIME</span>
        <JapaneseText className="art-stamp" text="探求">探<br />求</JapaneseText>
      </ArtworkMotion>
    </section>
  );
}
