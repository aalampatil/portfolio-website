"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, GitBranch, Star } from "lucide-react";
import snapshot from "../../data/github.json";
import { GITHUB_PROFILE } from "../../lib/github";
import { SectionShell } from "../SectionShell";
import { JapaneseText } from "../JapaneseText";
import type { CSSProperties, KeyboardEvent } from "react";
import type { GitHubData, GitHubSource } from "../../types";

const shortDate = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const monthName = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });
const formatDate = (date: string) => shortDate.format(new Date(`${date.slice(0, 10)}T00:00:00Z`));

export function GitHubSection() {
  const [data, setData] = useState<GitHubData>(snapshot);
  const [source, setSource] = useState<GitHubSource>("snapshot");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => fetch("/api/github", { signal: controller.signal, cache: "no-cache" })
      .then(response => { if (!response.ok) throw new Error("GitHub unavailable"); return response.json(); })
      .then((next: GitHubData) => {
        if (!Array.isArray(next.repositories) || !next.contributions?.length) return;
        setData(next);
        setSource(next.contributionSource || "snapshot");
      })
      .catch(() => { /* Keep the verified snapshot visible when GitHub is unavailable. */ });
    refresh();
    const interval = setInterval(refresh, 60 * 60 * 1000);
    return () => { controller.abort(); clearInterval(interval); };
  }, []);

  const { repositories, contributions: days } = data;
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const activeDays = days.filter(day => day.count > 0).length;
  const peak = Math.max(...days.map(day => day.count));
  const selected = days.find(day => day.date === selectedDate) || days[days.length - 1];
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const weeks = Math.ceil((offset + days.length) / 7);
  const months: { key: string; label: string; count: number; week: number }[] = [];
  days.forEach((day, index) => {
    const key = day.date.slice(0, 7);
    if (months.at(-1)?.key !== key) months.push({ key, label: monthName.format(new Date(`${day.date}T00:00:00Z`)), count: 0, week: Math.floor((index + offset) / 7) });
    months[months.length - 1].count += day.count;
  });
  const maxMonth = Math.max(1, ...months.map(month => month.count));

  function navigateDay(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const steps: Record<string, number> = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 };
    const step = steps[event.key];
    if (step === undefined && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? days.length - 1 : Math.max(0, Math.min(days.length - 1, index + step));
    setSelectedDate(days[nextIndex].date);
    (event.currentTarget.parentElement?.children[nextIndex] as HTMLButtonElement | undefined)?.focus();
  }

  return (
    <SectionShell id="projects" title="Selected work, straight from GitHub." description="The projects I’ve pinned on my GitHub profile. This selection refreshes every hour.">
      <div className="github-heading"><div><p className="eyebrow"><JapaneseText text="固定" /> / PINNED REPOSITORIES</p><h3>From the workshop</h3></div><a className="text-link" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">View GitHub profile <ArrowUpRight size={16} /></a></div>
      <div className="github-repositories" id="github-repositories">
        {repositories.map(repo => (
          <article className="github-repo" key={repo.name}>
            <div className="github-repo-top"><GitBranch size={18} aria-hidden="true" /><span>{repo.language || "Source code"}</span>{repo.stars > 0 && <span className="repo-stars"><Star size={12} aria-hidden="true" />{repo.stars}<span className="sr-only"> stars</span></span>}</div>
            <h3><a href={repo.url} target="_blank" rel="noreferrer">{repo.name}<ArrowUpRight size={16} aria-hidden="true" /></a></h3>
            {repo.description && <p>{repo.description}</p>}
            <div className="github-repo-footer"><span>Updated {formatDate(repo.updatedAt)}</span><a href={repo.url} target="_blank" rel="noreferrer">View source<span className="sr-only"> for {repo.name}</span> ↗</a></div>
          </article>
        ))}
      </div>
      {repositories.length === 0 && <p className="writing-status">No projects are currently pinned on GitHub.</p>}

      <div className="github-activity" id="github">
        <div className="github-heading"><div><p className="eyebrow"><JapaneseText text="日々精進" /> / DAILY PRACTICE</p><h3>A year in contributions</h3></div><a className="text-link" href={GITHUB_PROFILE} target="_blank" rel="noreferrer">@aalampatil <ArrowUpRight size={16} /></a></div>
        <div className="github-stats"><div><strong>{total.toLocaleString("en")}</strong><span>contributions</span></div><div><strong>{activeDays}</strong><span>active days</span></div><div><strong>{peak}</strong><span>most in a day</span></div><JapaneseText className="activity-seal" text="継続" /></div>
        <div className="contribution-scroll" role="region" aria-label="Daily GitHub contributions. Use arrow keys on a day to explore the calendar." tabIndex={0}>
          <div className="contribution-calendar" style={{ "--weeks": weeks } as CSSProperties}>
            <div className="contribution-months" aria-hidden="true">{months.filter((month, index) => index === 0 || month.week > months[index - 1].week + 1).map(month => <span key={month.key} style={{ gridColumn: month.week + 1 }}>{month.label}</span>)}</div>
            <div className="contribution-weekdays" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div>
            <div className="contribution-grid" role="group" aria-label={`${total} contributions from ${formatDate(days[0].date)} to ${formatDate(days[days.length - 1].date)}`}>
              {days.map((day, index) => <button type="button" key={day.date} className={`contribution-cell contribution-level-${day.level}`} style={index === 0 ? { gridRowStart: offset + 1 } : undefined} tabIndex={selected.date === day.date ? 0 : -1} aria-label={`${formatDate(day.date)}: ${day.count} ${day.count === 1 ? "contribution" : "contributions"}`} aria-pressed={selected.date === day.date} title={`${formatDate(day.date)} · ${day.count} contributions`} onClick={() => setSelectedDate(day.date)} onFocus={() => setSelectedDate(day.date)} onKeyDown={event => navigateDay(event, index)} />)}
            </div>
          </div>
        </div>
        <div className="contribution-caption"><p aria-live="polite">{formatDate(selected.date)} <span>— {selected.count} {selected.count === 1 ? "contribution" : "contributions"}</span></p><div className="contribution-legend"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <span key={level} className={`contribution-cell contribution-level-${level}`} aria-hidden="true" />)}<span>More</span></div></div>
        <div className="monthly-heading"><span className="eyebrow">THE MONTHLY RHYTHM</span><span>CONTRIBUTIONS</span></div>
        <div className="monthly-chart" role="img" aria-label={`Monthly contributions: ${months.map(month => `${month.key}: ${month.count}`).join(", ")}`}>
          {months.map(month => <div className="monthly-column" key={month.key} title={`${month.key}: ${month.count} contributions`}><span className="monthly-value">{month.count}</span><div className="monthly-track"><span style={{ height: `${month.count / maxMonth * 100}%` }} /></div><span className="monthly-label">{month.label}</span></div>)}
        </div>
        <div className="github-data-note"><p>GitHub contributions include commits, pull requests, issues, and reviews.</p><p>{source === "github" ? "Synced from GitHub" : `Saved GitHub data · ${formatDate(snapshot.fetchedAt)}`}</p></div>
      </div>
    </SectionShell>
  );
}
