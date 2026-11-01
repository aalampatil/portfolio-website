import { ArrowUpRight } from "lucide-react";
import type { BuildUpdate } from "@/types/portfolio";

export function LivePreviewSection({ tweets }: { tweets: BuildUpdate[] }) {
  return (
    <details className="portfolio-disclosure" id="live-preview">
      <summary><span><span className="eyebrow">FROM THE WORKSHOP</span><strong>Build updates</strong></span><span className="disclosure-plus" aria-hidden="true">+</span></summary>
      <p className="disclosure-intro">Short progress notes shared on X.</p>
      <div className="update-links">{tweets.map(tweet => <a key={tweet.url} href={tweet.url} target="_blank" rel="noreferrer"><span>{tweet.title}</span><ArrowUpRight size={16} /></a>)}</div>
    </details>
  );
}
