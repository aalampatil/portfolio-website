import { ArrowUpRight } from "lucide-react";

export function RightRail() {
  return (
    <section id="contact" className="contact-section">
      <div><p className="eyebrow">05 / AROUND THE WEB</p><h2>Let’s cross paths.</h2><p>Explore the source, read a note, or follow what I’m building next.</p></div>
      <div className="contact-links"><a href="https://github.com/aalampatil" target="_blank" rel="noreferrer"><span>GitHub<small>Code & experiments</small></span><ArrowUpRight size={20} /></a><a href="https://aalampatilblogs.hashnode.dev" target="_blank" rel="noreferrer"><span>Hashnode<small>Technical writing</small></span><ArrowUpRight size={20} /></a><a href="https://x.com/aalam_twt" target="_blank" rel="noreferrer"><span>X / Twitter<small>Builds in progress</small></span><ArrowUpRight size={20} /></a></div>
    </section>
  );
}
