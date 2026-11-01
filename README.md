# Aalam Patil Portfolio

Next.js portfolio in a Japanese-inspired Ink theme with dark charcoal and light paper modes. Ink draws on [this Japanese Android UI reference](https://www.reddit.com/r/androidthemes/comments/b71gzs/theme_japanese_style_ui/) with vertical lettering, original SVG landscapes, and a crimson sun. The header light/dark switch remembers your preference locally. Japanese text shows its English meaning on hover, keyboard focus, or tap. Popups support Escape and outside-tap dismissal and remain within the viewport. Content follows a project-first layout: pinned GitHub work, contribution graphs, a grouped toolkit, Hashnode writing, a short about section, and social links. Build updates and portfolio history are expandable.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates the production build.
- `npm run lint` runs ESLint.
- `npm run typecheck` checks the application with strict TypeScript.
- `npm test` runs the GitHub import and calendar tests.
- `npm run test:browser` checks modes, translations, pinned-project refresh, and mobile layout with Playwright. Run `npx playwright install chromium` first, or set `PLAYWRIGHT_EXECUTABLE_PATH` to an installed Chromium browser.
- `npm run start` serves the production build.
- `npm run sync:github` refreshes the checked-in public GitHub snapshot.

The project list shows only repositories pinned on the GitHub profile, in profile order. It does not substitute popular repositories when no pins are set. Its contribution calendar and monthly chart use real GitHub contribution counts (commits, pull requests, issues, and reviews). `/api/github` revalidates public data hourly, and an open page requests updates every hour. Each source independently falls back to the checked-in snapshot if GitHub is unavailable, rate-limited, or changes its HTML format. No API token is required. Snapshot dates are shown when the calendar cannot refresh. The daily calendar supports arrow keys, Home, and End, and scrolls within its panel on small screens.

Development output lives in `.next-dev`; production build and start use `.next`. This keeps `npm run build` from overwriting a running development server’s bundles and React client manifests. Restart `npm run dev` once after changing this configuration.

## Structure

The hero includes a CSS 3D code cube, pointer-driven landscape depth, and a pause control. Section headings reveal gently as they enter the viewport in supporting browsers. Reduced-motion preferences stop these effects; touch input does not tilt the artwork.

- `app/components` contains shared UI and layout components.
- `app/components/sections` contains one component per portfolio section.
- `app/data/portfolio.ts` contains portfolio content.
- `app/types.ts` defines shared portfolio, blog, and GitHub data types.
- `app/lib/hashnode.ts` contains Hashnode feed configuration.
- Application code, scripts, and tests use TypeScript. The companion Express server in `server/` also uses strict TypeScript; run its `build` script before `start`. ESLint and PostCSS retain their standard JavaScript configuration files.
