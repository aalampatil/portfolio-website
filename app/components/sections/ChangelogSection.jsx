export function ChangelogSection({ changelog }) {
  return (
    <details className="portfolio-disclosure" id="changelog">
      <summary><span><span className="eyebrow">BEHIND THE SITE</span><strong>Portfolio history</strong></span><span className="disclosure-plus" aria-hidden="true">+</span></summary>
      <div className="history-list">{changelog.map(entry => <article key={entry.version}><span className="eyebrow">{entry.version}</span><h3>{entry.title}</h3><p>{entry.detail}</p></article>)}</div>
    </details>
  );
}
