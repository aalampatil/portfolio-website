import type { RawGitHubRepository, GitHubRepository, ContributionDay } from "@/types/portfolio";

export const GITHUB_USER = "aalampatil";
export const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;

export function parsePinnedRepositories(html: string): string[] {
  const names: string[] = [];
  for (const match of html.matchAll(/<li\b[^>]*class="[^"]*\bjs-pinned-item-list-item\b[^"]*"[^>]*>([\s\S]*?)<\/li>/g)) {
    const link = match[1].match(/<a\b[^>]*href="\/([^"/]+\/[^"/]+)"[^>]*>[\s\S]*?<span class="repo">/);
    if (link && match[1].includes("PINNED_REPO")) names.push(link[1]);
  }
  if (!names.length && !/Popular repositories/.test(html)) throw new Error("Unable to read GitHub pins");
  return [...new Set(names)];
}

export function normalizeRepositories(repositories: RawGitHubRepository[], pins: string[]): GitHubRepository[] {
  if (!Array.isArray(repositories)) throw new Error("Invalid GitHub repository response");
  const byName = new Map(repositories.filter(repo => !repo.private).map(repo => [repo.full_name.toLowerCase(), repo]));
  return pins.map(pin => {
    const repo = byName.get(pin.toLowerCase());
    if (!repo) throw new Error(`Missing pinned repository: ${pin}`);
    return {
      name: repo.name,
      url: repo.html_url,
      homepage: /^https?:\/\//.test(repo.homepage || "") ? repo.homepage || null : null,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.pushed_at,
    };
  });
}

export function parseContributions(html: string): ContributionDay[] {
  const labels = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = match[1].match(/\bfor="([^"]+)"/)?.[1];
    const count = match[2].trim().match(/^([\d,]+) contributions?\b/);
    if (id && (count || /^No contributions\b/.test(match[2].trim()))) {
      labels.set(id, count ? Number(count[1].replaceAll(",", "")) : 0);
    }
  }
  const days: ContributionDay[] = [];
  for (const match of html.matchAll(/<td\b[^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*>/g)) {
    const tag = match[0];
    const date = tag.match(/\bdata-date="([^"]+)"/)?.[1];
    const level = Number(tag.match(/\bdata-level="([0-4])"/)?.[1]);
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const count = id ? labels.get(id) : undefined;
    if (date && Number.isInteger(level) && count !== undefined) days.push({ date, count, level });
  }
  days.sort((a, b) => a.date.localeCompare(b.date));
  if (days.length < 300 || new Set(days.map(day => day.date)).size !== days.length) {
    throw new Error("GitHub contribution calendar format changed");
  }
  return days;
}
