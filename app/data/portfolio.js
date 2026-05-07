export const navItems = [
  { id: "overview", label: "Overview", method: "GET" },
  { id: "profile", label: "Profile", method: "GET" },
  { id: "projects", label: "Projects", method: "GET" },
  { id: "live-preview", label: "Live Preview", method: "GET" },
  { id: "blogs", label: "Blogs", method: "GET" },
  { id: "stack", label: "Stack", method: "GET" },
  { id: "changelog", label: "Changelog", method: "GET" },
];

export const profile = {
  name: "Aalam Patil",
  role: "Backend-focused developer",
  location: "Haryana, India",
  status: "Building projects and writing technical notes",
  focus: ["APIs", "Authentication", "Node.js", "System design basics"],
};

export const stack = [
  "Node.js",
  "Express",
  "MongoDB",
  "React",
  "Next.js",
  "Tailwind CSS",
  "JWT",
  "OAuth",
  "REST APIs",
  "Git",
];

export const projects = [
  {
    name: "wordle-ap",
    status: "Live",
    method: "GET",
    endpoint: "/projects/wordle-ap",
    url: "https://wordle-ap.netlify.app/",
    description:
      "Wordle-inspired app built while learning JWT authentication, refresh tokens, session handling, cookies, and Google OAuth.",
    tags: ["React", "Auth", "OAuth"],
  },
  {
    name: "oidc-ap",
    status: "Live",
    method: "GET",
    endpoint: "/projects/oidc-ap",
    url: "https://oidc-ap.aalampatil.online/",
    description:
      "OpenID Connect authentication project focused on identity flows, provider integration, sessions, and secure login behavior.",
    tags: ["OIDC", "Auth", "Sessions"],
  },
  {
    name: "deadlink",
    status: "Live",
    method: "GET",
    endpoint: "/projects/deadlink",
    url: "http://deadlink.sbs/",
    description:
      "A live web project for checking, exploring, or presenting link behavior through a focused utility interface.",
    tags: ["Web Tool", "Links", "Utility"],
  },
  {
    name: "talaash-ap",
    status: "Live",
    method: "GET",
    endpoint: "/projects/talaash-ap",
    url: "http://talaash-ap.space/",
    description:
      "Search-oriented project with a deployed web experience built around discovery and fast access to relevant results.",
    tags: ["Search", "Frontend", "Product"],
  },
  {
    name: "chaicss-ap",
    status: "Live",
    method: "GET",
    endpoint: "/projects/chaicss-ap",
    url: "https://chaicss-ap.aalampatil.online/",
    description:
      "CSS-focused project for experimenting with reusable styles, interface patterns, and polished frontend presentation.",
    tags: ["CSS", "UI", "Frontend"],
  },
];

export const previews = [
  {
    title: "Live Project Updates",
    body: "Recent build notes and shipped work from the active project timeline.",
  },
  {
    title: "API Playground",
    body: "A future interactive panel can simulate requests like GET /projects or GET /blogs and render real portfolio data.",
  },
  {
    title: "Build Notes",
    body: "A changelog-style space for work in progress, recent experiments, and architecture decisions.",
  },
];

export const featuredTweets = [
  {
    title: "Latest Build Update",
    url: "https://x.com/aalam_twt/status/2050286970375672018?s=20",
  },
  {
    title: "Project Progress",
    url: "https://x.com/aalam_twt/status/2037235121825501266?s=20",
  },
  {
    title: "Development Note",
    url: "https://x.com/aalam_twt/status/2035409567987986729?s=20",
  },
];

export const changelog = [
  {
    version: "v2.0.0",
    title: "Migrated portfolio to API docs theme",
    detail: "Next.js app shell, docs navigation, project registry, live preview section, and Hashnode pagination.",
  },
  {
    version: "v1.3.0",
    title: "Added live Hashnode blog feed",
    detail: "Blogs load from Hashnode GraphQL and support cursor-based pagination.",
  },
  {
    version: "v1.0.0",
    title: "Wikipedia profile theme",
    detail: "Original single-page portfolio with profile, sections, blogs, projects, and social links.",
  },
];
