import snapshot from "../../data/github.json";
import { normalizeRepositories, parseContributions, parsePinnedRepositories } from "../../lib/github";
import type { RawGitHubRepository, GitHubData } from "../../types";

export const dynamic = "force-dynamic";

async function githubFetch(url: string): Promise<Response> {
  const response = await fetch(url, {
    headers: { "User-Agent": "aalampatil-portfolio" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return response;
}

export async function GET() {
  const [repositories, contributions] = await Promise.allSettled([
    Promise.all([
      githubFetch("https://api.github.com/users/aalampatil/repos?per_page=100&sort=pushed").then(response => response.json() as Promise<RawGitHubRepository[]>),
      githubFetch("https://github.com/aalampatil").then(response => response.text()).then(parsePinnedRepositories),
    ]).then(async ([repos, pins]) => {
      const known = new Set(repos.map(repo => repo.full_name.toLowerCase()));
      const missing = await Promise.all(pins.filter(pin => !known.has(pin.toLowerCase())).map(pin =>
        githubFetch(`https://api.github.com/repos/${pin}`).then(response => response.json() as Promise<RawGitHubRepository>),
      ));
      return normalizeRepositories([...repos, ...missing], pins);
    }),
    githubFetch("https://github.com/users/aalampatil/contributions")
      .then(response => response.text()).then(parseContributions),
  ]);
  const data: GitHubData = {
    repositories: repositories.status === "fulfilled" ? repositories.value : snapshot.repositories,
    contributions: contributions.status === "fulfilled" ? contributions.value : snapshot.contributions,
    fetchedAt: snapshot.fetchedAt,
    repositorySource: repositories.status === "fulfilled" ? "github" : "snapshot",
    contributionSource: contributions.status === "fulfilled" ? "github" : "snapshot",
  };
  return Response.json(data, { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate" } });
}
