import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { MethodBadge } from "../MethodBadge";
import { SectionShell } from "../SectionShell";

export function ProjectsSection({ projects }) {
  return (
    <SectionShell
      id="projects"
      endpoint="/projects"
      title="Projects"
      description="Project records are structured like API resources, with active deployments linked directly from each resource card."
    >
      <div className="grid gap-4">
        {projects.map((project) => (
          <article key={project.name} className="neo-card p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <MethodBadge method={project.method} />
                  <code className="text-sm font-bold text-[var(--foreground)]">{project.endpoint}</code>
                  <span className="border-2 border-[var(--border)] bg-[var(--chart-1)] px-2 py-1 text-xs font-extrabold text-[var(--foreground)]">
                    {project.status}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[var(--foreground)]">{project.name}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-800">
                  {project.description}
                </p>
              </div>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="neo-button inline-flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-extrabold"
                >
                  Live
                  <ExternalLink size={15} />
                </a>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-2 border-2 border-[var(--border)] bg-zinc-200 px-3 py-2 text-sm font-bold text-zinc-600">
                  Link pending
                  <LinkIcon size={15} />
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="border-2 border-[var(--border)] bg-[var(--chart-2)] px-2 py-1 text-xs font-bold text-[var(--foreground)]">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
