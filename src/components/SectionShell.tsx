import { JapaneseText } from "@/components/JapaneseText";
import type { ReactNode } from "react";
import type { JapanesePhrase } from "@/components/JapaneseText";

const chapters: Record<string, [string, JapanesePhrase, string]> = {
  projects: ["01", "作品", "THE WORK"],
  github: ["01B", "継続", "THE PRACTICE"],
  stack: ["02", "道具", "THE TOOLKIT"],
  blogs: ["03", "手記", "THE WRITING"],
  profile: ["04", "人物", "THE PERSON"],
};

export function SectionShell({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  const [number, symbol, caption]: [string, JapanesePhrase | undefined, string] = chapters[id] || ["", undefined, ""];
  return (
    <section id={id} className="portfolio-section">
      <div className="section-heading"><div><p className="eyebrow">{number} / {caption}</p><h2>{title}</h2></div>{symbol && <JapaneseText text={symbol} className="section-symbol" />}</div>
      {description && <p className="section-description">{description}</p>}
      {children}
    </section>
  );
}
