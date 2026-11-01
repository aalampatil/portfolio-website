"use client";

import { useEffect, useState } from "react";
import { RightRail } from "./components/RightRail";
import { SideNav } from "./components/SideNav";
import { SiteHeader } from "./components/SiteHeader";
import { BlogsSection } from "./components/sections/BlogsSection";
import { ChangelogSection } from "./components/sections/ChangelogSection";
import { LivePreviewSection } from "./components/sections/LivePreviewSection";
import { OverviewSection } from "./components/sections/OverviewSection";
import { ProfileSection } from "./components/sections/ProfileSection";
import { StackSection } from "./components/sections/StackSection";
import { GitHubSection } from "./components/sections/GitHubSection";
import { JapaneseText } from "./components/JapaneseText";
import { changelog, featuredTweets, navItems, stack } from "./data/portfolio";
import { BLOGS_QUERY, HASHNODE_API_URL, POSTS_PER_PAGE } from "./lib/hashnode";
import type { BlogPost, BlogStatus, HashnodeResponse, InkMode } from "./types";

export default function Home() {
  const [mode, setMode] = useState<InkMode>("dark");

  useEffect(() => {
    let savedMode: InkMode = "dark";
    try {
      const saved = localStorage.getItem("portfolio-ink-mode");
      if (saved === "light" || saved === "dark") savedMode = saved;
    } catch { /* Theme switching also works when storage is unavailable. */ }
    setMode(savedMode);
    document.documentElement.dataset.mode = savedMode;
  }, []);

  function changeMode() {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    document.documentElement.dataset.mode = nextMode;
    try { localStorage.setItem("portfolio-ink-mode", nextMode); } catch { /* Keep the selection for this visit. */ }
  }

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogStatus, setBlogStatus] = useState<BlogStatus>("idle");
  const [blogError, setBlogError] = useState("");
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function fetchBlogs({ after = null, append = false }: { after?: string | null; append?: boolean } = {}) {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setBlogStatus("loading");
      }

      setBlogError("");

      const response = await fetch(HASHNODE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: BLOGS_QUERY,
          variables: {
            first: POSTS_PER_PAGE,
            after,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to load blogs right now.");
      }

      const data: HashnodeResponse = await response.json();

      if (data.errors?.length) {
        throw new Error(data.errors[0].message);
      }

      const connection = data.data?.publication?.posts;
      const nextPosts =
        connection?.edges?.map((edge) => edge.node).filter((post): post is BlogPost => post !== null) ?? [];

      setPosts((currentPosts) => {
        const mergedPosts = append ? [...currentPosts, ...nextPosts] : nextPosts;
        return Array.from(new Map(mergedPosts.map((post) => [post.id, post])).values());
      });
      setEndCursor(connection?.pageInfo?.endCursor ?? null);
      setHasNextPage(Boolean(connection?.pageInfo?.hasNextPage));
      setBlogStatus("success");
    } catch (error) {
      setBlogError(error instanceof Error ? error.message : "Unable to load blogs right now.");
      setBlogStatus("error");
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <main className="min-h-screen">
      <a href="#projects" className="skip-link">Skip to selected work</a>
      <SiteHeader mode={mode} onModeChange={changeMode} />
      <OverviewSection />
      <SideNav items={navItems} />
      <div className="portfolio-layout">
        <div className="portfolio-content">
          <GitHubSection />
          <StackSection stack={stack} />
          <BlogsSection
            posts={posts}
            blogStatus={blogStatus}
            blogError={blogError}
            hasNextPage={hasNextPage}
            isLoadingMore={isLoadingMore}
            onFetchBlogs={() => fetchBlogs()}
            onLoadMore={() => fetchBlogs({ after: endCursor, append: true })}
          />
          <ProfileSection />
          <div className="portfolio-extras">
            <LivePreviewSection tweets={featuredTweets} />
            <ChangelogSection changelog={changelog} />
          </div>
        </div>

      </div>
      <RightRail />
      <footer className="site-footer"><a href="#overview" className="brand"><JapaneseText className="seal" text="作" />AALAM PATIL</a><p>Code. Learn. Write. Repeat.</p><a href="#overview">Back to the top ↑</a></footer>
    </main>
  );
}
