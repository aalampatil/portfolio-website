import { ArrowUpRight, Loader2 } from "lucide-react";
import { SectionShell } from "../SectionShell";
import type { BlogPost, BlogStatus } from "../../types";

interface BlogsSectionProps {
  posts: BlogPost[];
  blogStatus: BlogStatus;
  blogError: string;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  onFetchBlogs: () => void;
  onLoadMore: () => void;
}

export function BlogsSection({ posts, blogStatus, blogError, hasNextPage, isLoadingMore, onFetchBlogs, onLoadMore }: BlogsSectionProps) {
  return (
    <SectionShell id="blogs" title="Notes from the process." description="What I learn while building: authentication concepts, development decisions, and the details that finally click.">
      <div className="writing-intro">
        <div><span className="eyebrow">THE DEVELOPER’S NOTEBOOK</span><h3>Build it. Understand it. Write it down.</h3><p>I document the concepts I explore so the next project starts a little further ahead. Read on Hashnode or load the latest articles below.</p></div>
        <a className="neo-button-secondary" href="https://aalampatilblogs.hashnode.dev" target="_blank" rel="noreferrer">Visit publication <ArrowUpRight size={16} /></a>
      </div>
      <div className="writing-status" aria-live="polite">
        {blogStatus === "loading" && <p className="loading-note"><Loader2 size={16} className="animate-spin" /> Loading the latest entries…</p>}
        {blogStatus === "error" && <p role="alert" className="writing-error">{blogError} You can still read the publication on Hashnode.</p>}
        {blogStatus === "success" && posts.length === 0 && <p>No entries to show yet.</p>}
      </div>
      {posts.length > 0 && <div className="writing-grid">{posts.map(post => <article className="writing-card" key={post.id}><span className="eyebrow">TECHNICAL NOTE</span><h3><a href={post.url} target="_blank" rel="noreferrer">{post.title}<ArrowUpRight size={17} /></a></h3>{post.brief && <p>{post.brief}</p>}<a className="writing-read" href={post.url} target="_blank" rel="noreferrer">Read article <span className="sr-only">: {post.title}</span>↗</a></article>)}</div>}
      <div className="writing-actions">
        <button type="button" onClick={onFetchBlogs} disabled={blogStatus === "loading" || isLoadingMore} className="neo-button-secondary">{blogStatus === "loading" ? "Loading…" : posts.length ? "Refresh entries" : blogStatus === "error" ? "Try again" : "Browse latest entries"}</button>
        {hasNextPage && <button type="button" onClick={onLoadMore} disabled={isLoadingMore || blogStatus === "loading"} className="neo-button">{isLoadingMore ? "Loading…" : "Load more entries"}</button>}
      </div>
    </SectionShell>
  );
}
