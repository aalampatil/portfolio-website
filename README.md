# Aalam Patil Portfolio

Next.js portfolio in a Japanese-inspired Ink theme with dark charcoal and light paper modes. Ink draws on [this Japanese Android UI reference](https://www.reddit.com/r/androidthemes/comments/b71gzs/theme_japanese_style_ui/) with vertical lettering, original SVG landscapes, and a crimson sun. The header light/dark switch remembers your preference locally. Japanese text shows its English meaning on hover, keyboard focus, or tap. Popups support Escape and outside-tap dismissal and remain within the viewport. Content follows a project-first layout: pinned GitHub work, contribution graphs, a grouped toolkit, Hashnode writing, a short about section, and social links. Build updates and portfolio history are expandable.

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates the production build.
- `npm run lint` runs ESLint.
- `npm run typecheck` checks the application with strict TypeScript.
- `npm test` runs the GitHub import and calendar tests.
- `npm run test:browser` checks modes, translations, pinned-project refresh, mobile layout, and seasonal weather with Playwright. Run `npx playwright install chromium` first, or set `PLAYWRIGHT_EXECUTABLE_PATH` to an installed Chromium browser.
- `npm run start` serves the production build.
- `npm run sync:github` refreshes the checked-in public GitHub snapshot.

The project list shows only repositories pinned on the GitHub profile, in profile order. It does not substitute popular repositories when no pins are set. Its contribution calendar and monthly chart use real GitHub contribution counts (commits, pull requests, issues, and reviews). `/api/github` fetches current public data without browser or CDN caching. An open page requests updates every five minutes, when the tab becomes visible, and when the connection returns. Each source independently falls back to the checked-in snapshot if GitHub is unavailable, rate-limited, or changes its HTML format. No API token is required. Optionally set the server-only `GITHUB_TOKEN` environment variable to increase the repository API rate limit. Snapshot dates are shown separately when projects or the calendar cannot refresh; upstream failures are logged on the server. The daily calendar supports arrow keys, Home, and End, and scrolls within its panel on small screens.

Development output lives in `.next-dev`; production build and start use `.next`. This keeps `npm run build` from overwriting a running development server’s bundles and React client manifests. Restart `npm run dev` once after changing this configuration.

Next.js generates `next-env.d.ts` for the active build directory. It is ignored so switching between development and production does not create generated-file changes in Git.

## Seasonal weather

The usual Japanese-inspired Ink theme is the default, with optional **Snow** and **Cherry blossom** switches in the header. Each effect has its own on/off toggle, so visitors can enable either, both, or neither. Both start off on a fresh visit. Independent preferences are saved locally under `portfolio-weather-v2`; earlier `portfolio-weather-v1` selections are carried over without changing the light/dark theme.

Snow adds layered, wind-driven flakes that collect on visible buttons and action links. Hover, focus, or tap brushes the snow off. Cherry blossom weather adds softly shaded, notched sakura petals with varied depth, gentle flutter, and tumbling motion. The weather canvases let all pointer input through. Effects pause in hidden tabs and stop completely when switched off. Reduced-motion preferences display still scenes whenever an effect is enabled, including when restoring a saved preference.

Weather code is kept separate from portfolio content:

- `src/lib/seasons.ts` owns the two supported effects, their display details, and preference validation.
- `src/components/SeasonalWeather.tsx` renders the two accessible switches and lazily loads the enabled scenes.
- `src/components/weather/useWeatherPreferences.ts` owns independent preferences, migration from the previous picker, and reduced-motion settings.
- `src/components/weather/WeatherScene.tsx` connects the canvas to the animation lifecycle.
- `src/components/weather/engine.ts` owns frame scheduling, input, observers, and cleanup.
- `src/components/weather/particles.ts` creates and draws snowflakes, sakura petals, and brushed-off snow.
- `src/components/weather/surfaces.ts` measures real controls, detects collisions, and draws accumulating snow.
- `src/components/weather/types.ts` and `weather.css` contain scene data types and weather styles.

Add `data-weather-surface` to another substantial control to let it collect weather. Particle density and drawing live in `particles.ts`; buildup limits and deposition rates live in `surfaces.ts`.

## Structure

If local Atlas lookups fail with `querySrv ECONNREFUSED`, optionally set `MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8` in `.env.local`. This selects resolvers within the app process; it does not change system DNS. Leave it unset on hosts whose normal resolver already works.

The header visitor counter stores anonymous browser IDs in MongoDB and counts each ID once, so refreshes and duplicate React effects do not inflate it. Set `MONGODB_URI` and optionally `MONGODB_DATABASE` in `.env.local` for development and in the hosting environment for production. The default database is `portfolio-ap`, using the `portfolio_visitors` collection. No IP address or browser fingerprint is stored. A database outage displays an unavailable mark instead of an invented count.

### Private visitor analytics

Visit `/admin/analytics` to see total anonymous browsers, new browsers in the past 30 days, top sources/countries/cities, and the latest 25 first visits. This page is not linked publicly. Both the page and `/api/admin/analytics` require authentication; knowing the URL does not grant access. Responses are private, uncached, and marked noindex.

Set `ANALYTICS_ADMIN_USERNAME` (default `owner`) and `ANALYTICS_ADMIN_PASSWORD` in `.env.local` and your Vercel environment variables. Generate a password with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` and use the browser's login prompt. The password must be at least 24 characters; missing/short passwords disable dashboard access. Never use `NEXT_PUBLIC_` for these variables. Redeploy after setting production variables. Authentication uses the browser's built-in HTTP Basic flow; use HTTPS in production, and close the private browsing session after viewing analytics on a shared device. Rotating the password invalidates the previous credentials.

Attribution is captured only when a new anonymous browser is first counted. `utm_source` takes priority over the referring hostname. For example, share `https://your-domain.com/?utm_source=linkedin` on LinkedIn and `?utm_source=resume` in your resume. Only that campaign tag or the referrer's hostname is stored, never its full URL or other query parameters. Direct visits, unavailable referrers, and historical records appear as Direct / Unknown. Campaign tags and referrers are unverified analytics signals.

On Vercel (`VERCEL=1`), country and city come from the platform's `x-vercel-ip-country` and `x-vercel-ip-city` headers. These are approximate IP-derived locations, not GPS; VPNs and network routing can affect accuracy. Raw IP addresses are not stored or sent to a geolocation service. Location is Unknown locally, on other hosts, or when Vercel omits it. Historical records cannot be retroactively attributed. Existing browser IDs retain their original record; use a new browser profile to check a new campaign. Clearing browser storage counts the browser again, and bots or fabricated IDs can affect counts. The public visitor endpoint still returns only the total count.

Sources: [Vercel request headers](https://vercel.com/docs/headers/request-headers), [MDN referrer behavior](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer).

Project titles and “Visit project” links open the URL configured in `src/data/portfolio.ts`, falling back to GitHub’s Website field for new pinned projects. Repository links are kept separately as “View source.” Projects without a known live URL display “Live site not listed” instead of linking their title to GitHub.

The hero includes a CSS 3D code cube, pointer-driven landscape depth, a drifting crimson moon with a breathing halo, and a pause control. Japanese characters reveal like ink, move gently, and respond individually to hover or keyboard focus. Pausing the artwork also pauses the Japanese lettering. Section headings reveal gently as they enter the viewport in supporting browsers. Reduced-motion preferences stop these effects; touch input does not tilt the artwork. The inline SVG landscape uses the same geometry and colors in both Ink modes.

- `src/app` contains App Router pages, layouts, global styles, favicon, and API route handlers.
- `src/app/page.tsx` is a Server Component that renders the interactive `src/components/Portfolio.tsx` Client Component.
- `src/components` contains shared UI and layout components; `src/components/sections` contains the portfolio sections.
- `src/data/portfolio.ts` contains portfolio content; `src/data/github.json` is the GitHub fallback snapshot.
- `src/types/portfolio.ts` defines shared portfolio, blog, and GitHub data types.
- `src/lib` contains GitHub, Hashnode, project URL, and visitor database helpers.
- `@/` imports resolve to `src/`. Scripts and tests use the same alias, while filesystem snapshot paths point to `src/data/`.
- Environment files and framework configuration stay at the project root. `scripts` and `tests` remain separate from Next.js route files.
- Backend endpoints live in `src/app/api`, with database access in `src/lib/visitors.ts`.
- Application code, scripts, and tests use TypeScript. ESLint and PostCSS retain their standard JavaScript configuration files.
