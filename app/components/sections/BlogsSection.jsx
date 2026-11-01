import { ArrowUpRight, Loader2 } from "lucide-react";
import { SectionShell } from "../SectionShell";

export function BlogsSection({ posts, blogStatus, blogError, hasNextPage, isLoadingMore, onFetchBlogs, onLoadMore }) {
  return (
    <SectionShell id="blogs" title="Writing & learning" description="Technical notes on authentication, development, and lessons from building projects.">
      <div className="writing-intro">
        <div><span className="eyebrow">MY TECHNICAL JOURNAL</span><h3>Learning, written down.</h3><p>Read my published notes on Hashnode, or browse the latest entries here.</p></div>
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
