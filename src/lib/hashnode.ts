export const HASHNODE_API_URL = "https://gql.hashnode.com";
export const POSTS_PER_PAGE = 4;

export const BLOGS_QUERY = `
  query Publication($first: Int!, $after: String) {
    publication(host: "aalampatilblogs.hashnode.dev") {
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
