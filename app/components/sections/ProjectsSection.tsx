import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "../SectionShell";
import type { Project } from "../../types";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 2);
  const otherProjects = projects.slice(2);

  return (
    <SectionShell id="projects" title="Ideas, put into practice." description="Web apps and experiments where I work through identity, interfaces, and the connections between them.">
      <div className="featured-projects">
        {featured.map((project, index) => (
          <article className="featured-project" key={project.name}>
            <div className="project-card-top"><span className="eyebrow">PROJECT / 0{index + 1}</span><span className="live-badge">{project.status}</span></div>
            <div className="project-glyph" aria-hidden="true">{index === 0 ? <><span>W</span><span>O</span><span>R</span><span>D</span><span>L</span><span>E</span></> : <span className="identity-glyph">{'{ identity }'}</span>}</div>
            <div className="project-card-body">
              <p className="eyebrow">{index === 0 ? "WEB APP · AUTHENTICATION" : "IDENTITY · ACCESS"}</p>
              <h3><a href={project.url} target="_blank" rel="noreferrer">{project.name}</a></h3>
              <p>{project.description}</p>
              <div className="profile-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <a className="project-visit" href={project.url} target="_blank" rel="noreferrer">Explore project <ArrowUpRight size={17} /><span className="sr-only">: {project.name}</span></a>
            </div>
          </article>
        ))}
      </div>
      <div className="collection-heading"><h3>More from the collection</h3><span>{otherProjects.length.toString().padStart(2, "0")} PROJECTS</span></div>
      <div className="small-projects">
        {otherProjects.map((project, index) => (
          <article className="small-project" key={project.name}>
            <div className="small-project-heading"><span className="eyebrow">0{index + 3}</span><ArrowUpRight size={18} aria-hidden="true" /></div>
            <h3><a href={project.url} target="_blank" rel="noreferrer">{project.name}</a></h3>
            <p>{project.description}</p>
            <div className="profile-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
