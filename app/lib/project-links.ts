import type { GitHubRepository } from "../types";
import { projects } from "../data/portfolio";
import { GITHUB_PROFILE } from "./github";

const projectAliases: Record<string, string> = { "deadlink-ap": "deadlink" };

function websiteUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || /^(www\.)?github\.com$/i.test(url.hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function getProjectWebsite(repo: Pick<GitHubRepository, "url" | "homepage">): string | null {
  const repositoryUrl = repo.url.replace(/\/$/, "").toLowerCase();
  const ownerPrefix = `${GITHUB_PROFILE.toLowerCase()}/`;
  const repositoryName = repositoryUrl.startsWith(ownerPrefix) ? repositoryUrl.slice(ownerPrefix.length) : null;
  const project = repositoryName ? projects.find(project => project.name.toLowerCase() === (projectAliases[repositoryName] || repositoryName)) : undefined;
  return websiteUrl(project?.url) || websiteUrl(repo.homepage);
}
