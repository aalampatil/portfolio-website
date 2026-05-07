"use client";

import { useMemo, useState } from "react";
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
import { changelog, featuredTweets, navItems, previews, profile, projects, stack } from "./data/portfolio";
import { BLOGS_QUERY, HASHNODE_API_URL, POSTS_PER_PAGE } from "./lib/hashnode";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [blogStatus, setBlogStatus] = useState("idle");
  const [blogError, setBlogError] = useState("");
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const profileJson = useMemo(() => JSON.stringify(profile, null, 2), []);

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
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:px-6 lg:grid-cols-[17rem_1fr_20rem]">
        <SideNav items={navItems} />

        <div>
          <OverviewSection onFetchBlogs={fetchBlogs} />
          <ProfileSection profileJson={profileJson} />
          <ProjectsSection projects={projects} />
          <LivePreviewSection previews={previews} tweets={featuredTweets} />
          <BlogsSection
            posts={posts}
            blogStatus={blogStatus}
            blogError={blogError}
            hasNextPage={hasNextPage}
            isLoadingMore={isLoadingMore}
            onFetchBlogs={() => fetchBlogs()}
            onLoadMore={() => fetchBlogs({ after: endCursor, append: true })}
          />
          <StackSection stack={stack} />
          <ChangelogSection changelog={changelog} />
        </div>

        <RightRail />
      </div>
    </main>
  );
}
