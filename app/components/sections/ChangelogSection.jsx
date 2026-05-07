import { SectionShell } from "../SectionShell";

export function ChangelogSection({ changelog }) {
  return (
    <SectionShell
      id="changelog"
      endpoint="/changelog"
      title="Changelog"
      description="Versioned notes for the portfolio itself, matching the API documentation theme."
    >
      <div className="space-y-4">
        {changelog.map((entry) => (
          <article key={entry.version} className="neo-card p-5">
            <div className="mb-2 flex items-center gap-3">
              <span className="border-2 border-[var(--border)] bg-[var(--chart-3)] px-2 py-1 font-mono text-xs font-bold text-[var(--foreground)]">
                {entry.version}
              </span>
              <h3 className="font-extrabold text-[var(--foreground)]">{entry.title}</h3>
            </div>
            <p className="text-sm leading-6 text-zinc-800">{entry.detail}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
