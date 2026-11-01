import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";

interface GitHubEvent {
  repo: { name: string; url: string };
}

interface GitHubCommit {
  commit: { message: string; committer: { date: string } };
}

export const getCommit = asyncHandler(async (req, res) => {
  const commit = {
    repoName: "",
    message: "",
    date: "",
  };

  const response_eventapi = await axios.get<GitHubEvent[]>(
    "https://api.github.com/users/aalampatil/events/public",
  );

  const data = response_eventapi.data[0];
  if (!data) throw new Error("No public GitHub activity available");
  const repoUrl = data.repo.url;
  const response_commitApi = await axios.get<GitHubCommit[]>(`${repoUrl}/commits?per_page=1`);
  const commit_data = response_commitApi.data;
  if (!commit_data[0]) throw new Error("No commits available for this repository");
  

  commit.repoName = data.repo.name;
  commit.message = commit_data[0].commit.message;
  commit.date = commit_data[0].commit.committer.date;

  return res.status(200).json({ commit, success: true });
});

