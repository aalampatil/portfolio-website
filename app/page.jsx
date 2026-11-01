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
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { StackSection } from "./components/sections/StackSection";
import { changelog, featuredTweets, navItems, projects, stack } from "./data/portfolio";
import { BLOGS_QUERY, HASHNODE_API_URL, POSTS_PER_PAGE } from "./lib/hashnode";

export default function Home() {
  const [theme, setTheme] = useState("sakura");

  useEffect(() => {
    let savedTheme = "sakura";
    try {
      const saved = localStorage.getItem("portfolio-theme");
      if (["samurai", "sakura", "moonlight"].includes(saved)) savedTheme = saved;
    } catch { /* Theme switching also works when storage is unavailable. */ }
    setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  function changeTheme(nextTheme) {
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try { localStorage.setItem("portfolio-theme", nextTheme); } catch { /* Keep the selection for this visit. */ }
  }

  const [posts, setPosts] = useState([]);
  const [blogStatus, setBlogStatus] = useState("idle");
  const [blogError, setBlogError] = useState("");
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function fetchBlogs({ after = null, append = false } = {}) {
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

      const data = await response.json();

      if (data.errors?.length) {
        throw new Error(data.errors[0].message);
      }

      const connection = data.data?.publication?.posts;
      const nextPosts =
        connection?.edges?.map((edge) => edge.node).filter(Boolean) ?? [];

      setPosts((currentPosts) => {
        const mergedPosts = append ? [...currentPosts, ...nextPosts] : nextPosts;
        return Array.from(new Map(mergedPosts.map((post) => [post.id, post])).values());
      });
      setEndCursor(connection?.pageInfo?.endCursor ?? null);
      setHasNextPage(Boolean(connection?.pageInfo?.hasNextPage));
      setBlogStatus("success");
    } catch (error) {
      setBlogError(error.message || "Unable to load blogs right now.");
      setBlogStatus("error");
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <main className="min-h-screen">
      <a href="#projects" className="skip-link">Skip to selected work</a>
      <SiteHeader theme={theme} onThemeChange={changeTheme} />
      <OverviewSection theme={theme} />
      <SideNav items={navItems} />
      <div className="portfolio-layout">
        <div className="portfolio-content">
          <ProjectsSection projects={projects} />
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
      <footer className="site-footer"><a href="#overview" className="brand"><span className="seal" aria-hidden="true">{theme === "samurai" ? "侍" : "桜"}</span>AALAM PATIL</a><p>Built with intention. Refined with practice.</p><a href="#overview">Back to the top ↑</a></footer>
    </main>
  );
}
