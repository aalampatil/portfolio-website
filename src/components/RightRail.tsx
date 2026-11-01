import { ArrowUpRight, Mail } from "lucide-react";

export function RightRail() {
  return (
    <section id="contact" className="contact-section">
      <div><p className="eyebrow">05 / KEEP IN TOUCH</p><h2>Have something in mind?</h2><p>Have a project idea, a question, or just want to say hello? Send me an email. You can also explore my code or follow along with the next build.</p></div>
      <div className="contact-links">
        <a href="mailto:aalampatil001@gmail.com"><span>Mail me<small>aalampatil001@gmail.com</small></span><Mail size={20} aria-hidden="true" /></a>
        <a href="https://github.com/aalampatil" target="_blank" rel="noreferrer"><span>GitHub<small>Code & experiments</small></span><ArrowUpRight size={20} /></a>
        <a href="https://aalampatilblogs.hashnode.dev" target="_blank" rel="noreferrer"><span>Hashnode<small>Technical writing</small></span><ArrowUpRight size={20} /></a>
        <a href="https://x.com/aalam_twt" target="_blank" rel="noreferrer"><span>X / Twitter<small>Builds in progress</small></span><ArrowUpRight size={20} /></a>
      </div>
    </section>
  );
}
