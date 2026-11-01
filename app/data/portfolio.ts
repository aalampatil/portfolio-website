import type { NavItem, Project, ChangelogEntry, BuildUpdate } from "../types";

export const navItems: NavItem[] = [
  { id: "projects", label: "Work", number: "01" },
  { id: "github", label: "GitHub", number: "01B" },
  { id: "stack", label: "Toolkit", number: "02" },
  { id: "blogs", label: "Writing", number: "03" },
  { id: "profile", label: "About", number: "04" },
  { id: "contact", label: "Connect", number: "05" },
];

export const profile = {
  name: "Aalam Patil",
  role: "Software developer",
  location: "Haryana, India",
  status: "Building projects and writing technical notes",
  focus: ["APIs", "Authentication", "Node.js", "System design basics"],
};

export const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "React-Native",
  "Expo Go",
  "Node.js",
  "Express",
  "MongoDB+Mongoose",
  "PostgreSQL+Drizzle",
  "Tailwind CSS",
  "JWT",
  "OAuth",
  "REST APIs",
  "Git",
];

export const projects: Project[] = [
  {
    name: "oidc-ap",
    status: "Live",
    method: "GET",
    endpoint: "/projects/oidc-ap",
    url: "https://oidc-ap.aalampatil.online/",
    description:
      "An OpenID Connect project exploring how an application signs users in through an identity provider, maintains a session, and handles the steps of an authentication flow.",
    tags: ["OIDC", "Auth", "Sessions"],
  },
  {
    name: "deadlink",
    status: "Live",
    method: "GET",
    endpoint: "/projects/deadlink",
    url: "http://deadlink.sbs/",
    description:
      "A link-focused web utility. Part of my collection of small, deployed projects for exploring how a focused tool takes shape on the web.",
    tags: ["Web Tool", "Links", "Utility"],
  },
  {
    name: "talaash-ap",
    status: "Live",
    method: "GET",
    endpoint: "/projects/talaash-ap",
    url: "http://talaash-ap.space/",
    description:
      "A search-oriented web project exploring how to turn a query into a useful discovery experience, from the search interface to the results.",
    tags: ["Search", "Frontend", "Product"],
  },
  {
    name: "chaicss-ap",
    status: "Live",
    method: "GET",
    endpoint: "/projects/chaicss-ap",
    url: "https://chaicss-ap.aalampatil.online/",
    description:
      "A CSS experiment in reusable styles and interface patterns. A place to work through how small styling decisions shape a complete page.",
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

export const featuredTweets: BuildUpdate[] = [
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

export const changelog: ChangelogEntry[] = [
  {
    version: "v3.1.0",
    title: "Ink, contrast, and clearer stories",
    detail: "A charcoal and crimson theme inspired by Japanese Android home screens, an original landscape illustration, and more focused project and profile copy.",
  },
  {
    version: "v3.0.0",
    title: "The way of the craft",
    detail: "A samurai-inspired portfolio with vermilion accents, paper textures, original artwork, and a new chapter-based layout.",
  },
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
