export type InkMode = "light" | "dark";

export interface NavItem {
  id: string;
  label: string;
  number?: string;
}

export interface Project {
  name: string;
  status: string;
  method: string;
  endpoint: string;
  url: string;
  description: string;
  tags: string[];
}

export interface ChangelogEntry {
  version: string;
  title: string;
  detail: string;
}

export interface BuildUpdate {
  title: string;
  url: string;
}

export interface BlogPost {
  id: string;
  title: string;
  brief?: string;
  url: string;
}

export type BlogStatus = "idle" | "loading" | "success" | "error";

export interface HashnodeResponse {
  errors?: { message: string }[];
  data?: {
    publication?: {
      posts?: {
        edges?: { node: BlogPost | null }[];
        pageInfo?: { endCursor: string | null; hasNextPage: boolean };
      };
    };
  };
}

export interface RawGitHubRepository {
  name: string;
  full_name: string;
  private?: boolean;
  fork?: boolean;
  archived?: boolean;
  size?: number;
  html_url: string;
  homepage?: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
}

export interface GitHubRepository {
  name: string;
  url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubSnapshot {
  fetchedAt: string;
  repositories: GitHubRepository[];
  contributions: ContributionDay[];
}

export type GitHubSource = "github" | "snapshot";

export interface GitHubData extends GitHubSnapshot {
  repositorySource?: GitHubSource;
  contributionSource?: GitHubSource;
}
