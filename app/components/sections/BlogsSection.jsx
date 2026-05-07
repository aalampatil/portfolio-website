import { BookOpen, ExternalLink, Globe2, Loader2 } from "lucide-react";
import { SectionShell } from "../SectionShell";

export function BlogsSection({
  posts,
  blogStatus,
  blogError,
  hasNextPage,
  isLoadingMore,
  onFetchBlogs,
  onLoadMore,
}) {
  return (
    <SectionShell
      id="blogs"
      endpoint="/blogs?source=hashnode"
      title="Published Notes"
      description="Live Hashnode feed with cursor pagination. Fetch the first page, then keep loading more until the publication has no more posts."
    >
      <div className="neo-card p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Globe2 className="text-[var(--chart-5)]" size={20} />
            <code className="text-sm font-bold text-[var(--foreground)]">aalampatilblogs.hashnode.dev</code>
          </div>
          <button
            type="button"
            onClick={onFetchBlogs}
            disabled={blogStatus === "loading"}
            className="neo-button inline-flex items-center gap-2 px-3 py-2 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {blogStatus === "loading" ? <Loader2 className="animate-spin" size={16} /> : <BookOpen size={16} />}
            {posts.length ? "Refresh" : "Fetch blogs"}
          </button>
        </div>

        {blogStatus === "error" && (
          <p className="border-2 border-[var(--border)] bg-[var(--chart-4)] p-3 text-sm font-bold text-[var(--foreground)]">
            {blogError}
          </p>
        )}

        {blogStatus === "success" && posts.length === 0 && (
          <p className="text-sm text-zinc-800">No blogs found.</p>
        )}

        {posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="border-t-2 border-[var(--border)] pt-4 first:border-t-0 first:pt-0">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-start gap-2 font-extrabold text-[var(--foreground)] underline decoration-[var(--main)] decoration-4 underline-offset-4"
                >
                  {post.title}
                  <ExternalLink className="mt-1 opacity-60 group-hover:opacity-100" size={14} />
                </a>
                {post.brief && (
                  <p className="mt-2 text-sm leading-6 text-zinc-800">{post.brief}</p>
                )}
              </article>
            ))}
          </div>
        )}

        {hasNextPage && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="neo-button-secondary mt-5 inline-flex items-center gap-2 px-3 py-2 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore && <Loader2 className="animate-spin" size={16} />}
            {isLoadingMore ? "Loading..." : "Load more blogs"}
          </button>
        )}
      </div>
    </SectionShell>
  );
}
