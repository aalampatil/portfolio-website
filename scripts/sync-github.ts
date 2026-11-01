import { readFile, writeFile } from "node:fs/promises";
import { normalizeRepositories, parseContributions, parsePinnedRepositories } from "../app/lib/github";
import type { RawGitHubRepository, GitHubSnapshot } from "../app/types";

// Optional input files let an already fetched public response be reused offline.
const [reposPath, calendarPath, profilePath] = process.argv.slice(2);
const [repos, calendar, profile] = await Promise.all([
  reposPath ? readFile(reposPath, "utf8").then(JSON.parse) : fetch("https://api.github.com/users/aalampatil/repos?per_page=100&sort=pushed").then(async response => {
    if (!response.ok) throw new Error(`GitHub repositories: ${response.status}`);
    return response.json();
  }),
  calendarPath ? readFile(calendarPath, "utf8") : fetch("https://github.com/users/aalampatil/contributions").then(async response => {
    if (!response.ok) throw new Error(`GitHub calendar: ${response.status}`);
    return response.text();
  }),
  profilePath ? readFile(profilePath, "utf8") : fetch("https://github.com/aalampatil").then(async response => {
    if (!response.ok) throw new Error(`GitHub profile: ${response.status}`);
    return response.text();
  }),
]);
const snapshot: GitHubSnapshot = {
  fetchedAt: new Date().toISOString(),
  repositories: normalizeRepositories(repos as RawGitHubRepository[], parsePinnedRepositories(profile)),
  contributions: parseContributions(calendar),
};
await writeFile(new URL("../app/data/github.json", import.meta.url), JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Saved ${snapshot.repositories.length} repositories and ${snapshot.contributions.length} contribution days.`);
