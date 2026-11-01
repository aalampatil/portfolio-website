const chapters = {
  projects: ["01", "作品", "THE WORK"],
  stack: ["02", "道具", "THE TOOLKIT"],
  blogs: ["03", "手記", "THE WRITING"],
  profile: ["04", "人物", "THE PERSON"],
};

export function SectionShell({ id, title, description, children }) {
  const [number, symbol, caption] = chapters[id] || ["", "", ""];
  return (
    <section id={id} className="portfolio-section">
      <div className="section-heading"><div><p className="eyebrow">{number} / {caption}</p><h2>{title}</h2></div><span className="section-symbol" aria-hidden="true">{symbol}</span></div>
      {description && <p className="section-description">{description}</p>}
      {children}
    </section>
  );
}
