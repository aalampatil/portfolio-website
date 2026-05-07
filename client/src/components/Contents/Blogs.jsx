import React, { useState } from "react";
import { SlArrowDown, SlArrowRight } from "react-icons/sl";

const HASHNODE_API_URL = "https://gql.hashnode.com";
const POSTS_PER_PAGE = 10;
const BLOGS_QUERY = `
  query Publication($first: Int!, $after: String) {
    publication(host: "aalampatilblogs.hashnode.dev") {
      id
      isTeam
      title
      posts(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            brief
            url
          }
        }
      }
    }
  }
`;

function Blogs() {
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function fetchBlogs({ after = null, append = false } = {}) {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setStatus("loading");
      }

      setError("");

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

      const postsConnection = data.data?.publication?.posts;
      const nextPosts =
        postsConnection?.edges?.map((edge) => edge.node).filter(Boolean) ?? [];

      setPosts((currentPosts) => {
        const mergedPosts = append ? [...currentPosts, ...nextPosts] : nextPosts;
        const uniquePosts = new Map(
          mergedPosts.map((post) => [post.id, post]),
        );

        return Array.from(uniquePosts.values());
      });

      setEndCursor(postsConnection?.pageInfo?.endCursor ?? null);
      setHasNextPage(Boolean(postsConnection?.pageInfo?.hasNextPage));
      setStatus("success");
    } catch (err) {
      setError(err.message || "Unable to load blogs right now.");
      setStatus("error");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleToggleBlogs() {
    const shouldOpen = !show;

    setShow(shouldOpen);

    if (shouldOpen && (status === "idle" || status === "error")) {
      fetchBlogs();
    }
  }

  function handleLoadMoreBlogs() {
    if (!endCursor || isLoadingMore) return;

    fetchBlogs({ after: endCursor, append: true });
  }

  return (
    <>
      <div id="blogs" className="w-full mt-4 my-4 pb-3">
        <div
          className="m-2 p-2 flex flex-row items-center justify-between cursor-pointer"
          onClick={handleToggleBlogs}
        >
          <h1 className="text-lg md:text-xl font-semibold">Blogs</h1>

          <span className="text-xl">
            {show ? <SlArrowDown /> : <SlArrowRight />}
          </span>
        </div>
        {show && (
          <div className="flex flex-col m-2 p-2 ">
            {status === "loading" && (
              <p className="m-2 p-4 text-gray-600">Loading blogs...</p>
            )}

            {status === "error" && (
              <p className="m-2 p-4 text-red-600">{error}</p>
            )}

            {status === "success" && posts.length === 0 && (
              <p className="m-2 p-4 text-gray-600">No blogs found.</p>
            )}

            {posts.length > 0 && (
              <>
                <ol className="m-2 p-4 list-decimal">
                  {posts.map((post) => (
                    <li key={post.id} className="mb-3">
                      <a
                        href={post.url}
                        className="text-blue-500"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {post.title}
                      </a>
                      {post.brief && (
                        <p className="text-sm md:text-base text-gray-700">
                          {post.brief}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>

                {hasNextPage && (
                  <button
                    type="button"
                    className="self-start mx-6 mb-4 px-4 py-2 border border-blue-500 text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoadingMore}
                    onClick={handleLoadMoreBlogs}
                  >
                    {isLoadingMore ? "Loading..." : "Load more blogs"}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Blogs;
